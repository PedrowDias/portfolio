"""Precompute cross-lingual retrieval results for the portfolio demo.

Queries are drawn DIRECTLY from the same parallel dataset used to build the
candidate pool, so each query's true correct translation is guaranteed to be
present in the pool — the same setup evaluate.py uses to measure real
retrieval accuracy (~80% P@1). Earlier hand-written example sentences had no
guaranteed match in a small random pool, understating the model's actual
performance.

Usage:
    python generate_demo_data.py --checkpoint checkpoints/checkpoint_epoch_5.pt
"""
import argparse
import json
import logging
import random
import re
from pathlib import Path

import torch

from mse.data.loader import load_parallel_sentences
from mse.models.student import StudentEncoder
from mse.models.teacher import TeacherEncoder

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger(__name__)

LANGUAGES = ['de', 'fr', 'es', 'pt', 'it']
POOL_SIZE_PER_LANGUAGE = 60
QUERIES_PER_LANGUAGE = 2
TOP_K = 5
RAW_FETCH_MULTIPLIER = 10  # fetch extra and filter — OPUS-100 (subtitle-sourced) contains a lot of junk and dialogue fragments
SEED = 7


def is_valid_sentence(text: str) -> bool:
    '''Reject subtitle-artifact junk and dialogue-style fragments, favouring
    complete, declarative sentences that read well as standalone examples.
    OPUS-100 is sourced largely from movie subtitles, which skews heavily
    toward short, casual dialogue lines rather than the kind of clean prose
    a demo should show off.
    '''
    text = text.strip()
    if len(text) < 25:
        return False
    if len(text.split()) < 8:  # longer sentences read as complete thoughts, not dialogue fragments
        return False
    if text.startswith('-') or text.startswith('♪'):  # dialogue/lyric markers
        return False
    if re.search(r'\d{1,2}:\d{2}(:\d{2})?', text):  # timestamps like 04:26:35
        return False
    if '%s' in text or '%d' in text or '♪' in text:
        return False
    alpha_chars = sum(c.isalpha() for c in text)
    if alpha_chars / max(len(text), 1) < 0.6:  # mostly symbols/digits, not prose
        return False
    return True


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument('--checkpoint', type=Path, default=Path('checkpoints/checkpoint_epoch_5.pt'))
    parser.add_argument('--output', type=Path, default=Path('demo_data.json'))
    parser.add_argument('--max-seq-len', type=int, default=128)
    return parser.parse_args()


def load_student(checkpoint_path, teacher_dim):
    checkpoint = torch.load(checkpoint_path, map_location='cpu')
    student = StudentEncoder(teacher_dim=teacher_dim)
    student.load_state_dict(checkpoint['student_state_dict'])
    student.eval()
    return student


def embed_texts(texts, tokenizer, model, max_seq_len):
    embeddings = []
    with torch.no_grad():
        for i in range(0, len(texts), 32):
            batch = texts[i:i + 32]
            encoded = tokenizer(batch, max_length=max_seq_len, padding='max_length',
                                truncation=True, return_tensors='pt')
            out = model(encoded['input_ids'], encoded['attention_mask'])
            embeddings.append(out)
    return torch.cat(embeddings, dim=0)


def main():
    args = parse_args()

    logger.info('Loading teacher and student...')
    teacher = TeacherEncoder()
    student = load_student(args.checkpoint, teacher.embedding_dim)
    teacher_tokenizer = teacher._st_model.tokenizer

    pool_texts, pool_langs = [], []
    query_texts, query_source_lang, correct_indices = [], [], []
    pool_offset = 0

    for lang in LANGUAGES:
        raw_english, raw_translated = load_parallel_sentences(
            lang, POOL_SIZE_PER_LANGUAGE * RAW_FETCH_MULTIPLIER, split='test'
        )
        clean_pairs = [
            (en, tr) for en, tr in zip(raw_english, raw_translated)
            if is_valid_sentence(en) and is_valid_sentence(tr)
        ]
        random.Random(SEED).shuffle(clean_pairs)
        if len(clean_pairs) < POOL_SIZE_PER_LANGUAGE:
            logger.warning(
                f'Only found {len(clean_pairs)} clean pairs for {lang}, '
                f'wanted {POOL_SIZE_PER_LANGUAGE}. Consider raising RAW_FETCH_MULTIPLIER.'
            )
        selected = clean_pairs[:POOL_SIZE_PER_LANGUAGE]
        english = [p[0] for p in selected]
        translated = [p[1] for p in selected]

        pool_texts.extend(translated)
        pool_langs.extend([lang] * len(translated))

        # Track the exact pool position of each query's true correct
        # translation, so we can check whether it's actually retrieved as
        # the top match — rather than just eyeballing raw scores, which
        # don't by themselves tell us if the ranking is correct.
        for i in range(min(QUERIES_PER_LANGUAGE, len(english))):
            query_texts.append(english[i])
            query_source_lang.append(lang)
            correct_indices.append(pool_offset + i)

        pool_offset += len(translated)

    logger.info(f'Embedding candidate pool of {len(pool_texts)} sentences...')
    pool_embeddings = embed_texts(pool_texts, student.tokenizer, student, args.max_seq_len)
    pool_embeddings = torch.nn.functional.normalize(pool_embeddings, p=2, dim=-1)

    logger.info(f'Embedding {len(query_texts)} query sentences...')
    query_embeddings = embed_texts(query_texts, teacher_tokenizer, teacher, args.max_seq_len)
    query_embeddings = torch.nn.functional.normalize(query_embeddings, p=2, dim=-1)

    results = []
    n_correct_top1 = 0
    for query, q_emb, correct_idx in zip(query_texts, query_embeddings, correct_indices):
        scores = torch.mv(pool_embeddings, q_emb)
        top_scores, top_idx = scores.topk(TOP_K)
        matches = [
            {
                'text': pool_texts[idx],
                'language': pool_langs[idx],
                'score': round(score, 4),
                'correct': idx == correct_idx,
            }
            for idx, score in zip(top_idx.tolist(), top_scores.tolist())
        ]
        results.append({'query': query, 'matches': matches})

        top1_idx = top_idx.tolist()[0]
        is_correct = (top1_idx == correct_idx)
        n_correct_top1 += int(is_correct)
        correct_score = scores[correct_idx].item()
        correct_rank = (scores.argsort(descending=True) == correct_idx).nonzero(as_tuple=True)[0].item() + 1

        status = 'CORRECT' if is_correct else f'MISS (correct answer ranked #{correct_rank})'
        logger.info(
            f'  "{query[:40]}..." -> top: {matches[0]["language"]} ({matches[0]["score"]:.3f}) '
            f'| true match score: {correct_score:.3f} | {status}'
        )

    logger.info(f'\nTop-1 accuracy on these {len(query_texts)} queries: {n_correct_top1}/{len(query_texts)}')

    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)
    logger.info(f'Saved {len(results)} query results to {args.output}')


if __name__ == '__main__':
    main()
