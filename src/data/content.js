// Central content store — components import from here rather than hardcoding
// text, so updating your bio/experience/projects never requires touching
// component or layout code.

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export const hero = {
  greeting: 'Hi, my name is',
  name: 'Pedro Werneck.',
  tagline: 'I build things at the intersection of physics and machine learning.',
  subtitle:
    "I'm a Physics & Computer Science student at the University of Toronto, currently researching beam instabilities at CERN and building ML systems from first principles.",
}

export const about = {
  paragraphs: [
    "I'm a Physics and Computer Science double-major at the University of Toronto (4.0 GPA), currently a Research Intern at CERN and EPFL's Laboratory of Particle Accelerator Physics, working on nonlinear beam dynamics in particle accelerators.",
    'Outside of accelerator physics, I build machine learning systems from scratch — implementing research papers end-to-end rather than relying on high-level libraries, because I want to actually understand what the tools I use are doing under the hood.',
    "I'm also an Undergraduate Research Assistant at the Dunlap Institute for Astronomy & Astrophysics, and I've represented Brazil at national science and math olympiads.",
  ],
  skills: [
    'Python',
    'PyTorch',
    'C',
    'Java',
    'JavaScript / React',
    'SQL',
    'NumPy / SciPy',
  ],
}

export const experience = [
  {
    role: 'Research Intern',
    org: 'CERN and EPFL',
    date: 'June 2026 — Aug. 2026',
    location: 'Geneva, Switzerland',
    bullets: [
      "Selected for EPFL's Excellence Research Internship Program (ERIP) in the Laboratory of Particle Accelerator Physics (LPAP), a fully funded program open to the top 10% of applicants, working under Dr. Nicolas Mounet in CERN's Accelerators and Beam Physics, Coherent Effects and Impedances (ABP-CEI) group",
      "Generalized a direct linear Vlasov solver to nonlinear longitudinal motion, replacing DELPHI's closed-form Bessel-function kernels with a numerical, FFT-based evaluator for the nonlinear coupling kernel",
    ],
  },
  {
    role: 'Undergraduate Research Assistant',
    org: 'University of Toronto, Dunlap Institute for Astronomy & Astrophysics',
    date: 'Aug. 2025 — Present',
    location: 'Toronto, Canada',
    bullets: [
      'Built an automated data pipeline to process 23TB+ of Gaia+HST astrometry data, producing a proper motion catalog of 200+ Local Group structures, deployed as a web application',
      'Applied statistical modeling and kinematic analyses to study galaxy rotation and stellar stream–dark matter interactions, generating 25 plots to evaluate BP3M improvements on proper motion measurements',
    ],
  },
]

export const skills = {
  technical: [
    'Python', 'C', 'Java', 'JavaScript', 'SQL', 'HTML/CSS', 'R',
    'PyTorch', 'NumPy', 'SciPy', 'pandas', 'Matplotlib',
  ],
  coursework: [
    'Linear Algebra', 'Multivariable Calculus', 'ODEs',
    'Statistics', 'Quantum Mechanics', 'E&M',
  ],
  awards: [
    'Four gold medals at the Brazilian Astronomy Olympiad (2020–2023), including perfect scores in 2022 and 2023',
    'Two gold and one silver medal at the National Olympiad of Science of Brazil; top 50 nationwide out of 4.88 million participants (2023)',
    'Bronze medal and honorable mention at the Brazilian Math Olympiad for Public Schools',
    'Dean\u2019s List Scholar (2025); International Scholar, Faculty of Arts & Science (2024)',
  ],
}

export const projects = [
  {
    title: 'Fourier Neural Operator for PDEs',
    paperRef: 'Li et al., 2021',
    stack: ['Python', 'PyTorch', 'NumPy'],
    description:
      'Implemented a Fourier Neural Operator from scratch for the 1D Burgers and 2D Navier-Stokes equations, including finite-difference and pseudo-spectral solvers, an MLP baseline, and spectral convolution layers in Fourier space.',
    results: [
      '15x lower test error than the MLP baseline (0.076 vs 1.14 relative L2)',
      'Resolution-invariant generalization to 256-point grids trained only on 32–128 points',
      '21x per-sample inference speedup over classical solvers (0.6ms vs 12.65ms)',
    ],
    github: 'https://github.com/PedrowDias/Fourier-Neural-Operator',
    interactive: true, // flag for the live demo, built in a later pass
  },
  {
    title: 'Multilingual Sentence Embeddings',
    paperRef: 'Reimers & Gurevych, 2020',
    stack: ['Python', 'PyTorch', 'Transformers'],
    description:
      'Implemented multilingual sentence embeddings from scratch via knowledge distillation, training a multilingual student (XLM-RoBERTa) to match a frozen English teacher (MiniLM) across 5 languages.',
    results: [
      '81.0% average Precision@1 and 85.7% average MRR on cross-lingual retrieval against a 500-candidate pool',
      '95.6% relative improvement in Precision@1 (41.4% \u2192 81.0%) by scaling training data 4x and epochs from 3 to 5',
    ],
    github: 'https://github.com/PedrowDias/multilingual-sentence-embeddings',
    interactive: false,
  },
  {
    title: 'Python for the First Time',
    paperRef: null,
    stack: ['Python'],
    description:
      "Sole-authored a free Python book for beginners covering the memory model, runtime complexity, OOP, and exercises with solutions.",
    results: ['Downloaded 300+ times'],
    github: null,
    link: 'https://tinyurl.com/python-for-the-first-time',
    interactive: false,
  },
]

export const contact = {
  heading: "What's Next?",
  subheading: 'Get In Touch',
  body:
    "I'm always interested in hearing about new opportunities in ML and software engineering. Whether you have a question or just want to say hi, I'll try my best to get back to you.",
  email: 'pedro.werneck@mail.utoronto.ca',
  socials: [
    { label: 'GitHub', href: 'https://github.com/PedrowDias' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/pedrowdias' },
  ],
}
