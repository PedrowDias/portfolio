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
    name: 'Pedro Werneck!',
    tagline: 'I like Physics and Computer\u00A0Science,',
    subtitle:
        "and very interested in pursuing AI/ML\u00A0research",
}

export const about = {
    paragraphs: [
        "I'm from Brazil! But now a 3rd-year Physics and Computer Science double-major student at the University of Toronto (4.0 CGPA). Last summer I did a research internship at CERN and EPFL, working on generalizing direct Vlasov solvers to nonlinear longitudinal dynamics.",
        "I'm also a Research Assistant at the Dunlap Institute for Astronomy & Astrophysics under the supervision of Dr. Kevin McKinnon and Prof. Ting Li, and I have some medals at national (Brazil) science and math olympiads (you can see more on that below).",
    ],
    skills: [
        'Python',
        'PyTorch',
        'C',
        'Java',
        'JavaScript / React',
        'SQL',
        'NumPy / SciPy',
        'HTML / CSS',
    ],
    profilePhoto: 'images/profile.jpg',
    travel: {
        paragraphs: [
            "On a more personal note, ever since high school in Brazil, I dreamed of studying abroad and doing international collaborations. So having the chance to do my undergrad in Canada has been more special than I can describe, and I'm extremely grateful for that.",
            "This is a map of the countries I've visited so far! As I saw somewhere (probably Instagram), the goal is for the \"number of countries I\u2019ve visited to always be greater than my age\"!",
        ],
    },
    cern: {
        paragraphs: [
            "Last summer I got to spend three months at CERN, which still feels surreal (I used to write about CERN in my university applications, so actually walking into the site every morning was a dream).",
            "Being based in Geneva also meant everything else was a train ride away, so most weekends I was somewhere new: exploring Switzerland, the French side of the border, and even Milan! These are a few photos from that summer, click through them!",
            "Studying and working abroad has also given me the opportunity to travel a lot, which is probably what I love doing most in life (along with learning)! Meeting new people, experiencing different cultures and languages, visiting new places, and trying new food are some of my favorite things to do.",
        ],
        photos: [
            { src: 'images/cern/cern-01.jpeg', caption: 'The classic sculpture in front of the globe' },
            { src: 'images/cern/cern-02.jpeg', caption: 'CERN streets are named after physicists!' },
            { src: 'images/cern/cern-03.jpeg', caption: 'From the weekend I spent in Milan' },
            { src: 'images/cern/cern-04.jpeg', caption: 'The place where they literally make antimatter!!! So so cool' },
            { src: 'images/cern/cern-05.jpeg', caption: 'The GBAR experiment inside the Antimatter Factory, used to test gravity' },
            { src: 'images/cern/cern-06.jpeg', caption: 'Lauterbrunnen, the real-life inspiration to Rivendell!' },
            { src: 'images/cern/cern-07.jpeg', caption: 'The Saint-Chapelle chapel in Paris, extremely beautiful' },
            { src: 'images/cern/cern-08.jpeg', caption: 'My first hike in Switzerland (and in my life!)' },
            { src: 'images/cern/cern-09.jpeg', caption: 'The famous Oeschinensee Lake, the most beautiful place I have ever went to' },
            { src: 'images/cern/cern-10.jpeg', caption: 'Just a famous tower' },
        ],
    },
}

export const visitedCountries = [
    'Brazil',
    'Argentina',
    'Bahamas',
    'United States of America',
    'Canada',
    'France',
    'Switzerland',
    'Liechtenstein',
    'Qatar',
    'United Arab Emirates',
    'Japan',
    'Cambodia',
    'Vietnam',
    'Singapore',
]

export const experience = [
    {
        role: 'Research Intern',
        org: 'CERN (European Organization for Nuclear Research) and EPFL',
        date: 'June 2026 — Aug. 2026',
        duration: '3 months',
        location: 'Geneva, Switzerland',
        bullets: [
            "Selected for EPFL's Excellence Research Internship Program (ERIP) in the Laboratory of Particle Accelerator Physics (LPAP), a fully funded program open to the top 10% students. Worked under Dr. Nicolas Mounet and Prof. Tatiana Pieloni in CERN's Accelerators and Beam Physics, Coherent Effects and Impedances (ABP-CEI) group",
            "Generalized a Vlasov beam-stability solver (DELPHI) from linear to nonlinear longitudinal motion, reproducing it to 10^-4 in the linear limit and running 27 times faster on the PS Booster benchmark, by using a numerically integrated coupling kernel and a spline-cached basis (10^-13 interpolation error)",
            "Verified the solver to within 1% on 20+ instability cases (mode coupling, head-tail modes, feedback damper) by building an independent macroparticle benchmark in Xsuite, confirming a 6% instability-threshold shift.}",
        ],
    },
    {
        role: 'Research Assistant',
        org: 'University of Toronto, Dunlap Institute for Astronomy & Astrophysics',
        date: 'Aug. 2025 — Present',
        startDate: '2025-08-01',
        location: 'Toronto, Canada',
        bullets: [
            'Built an automated data pipeline to process 23TB+ of Gaia+HST astrometry data, producing an interactive proper motion catalog of 200+ Local Group structures, deployed as a web application',
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
        'University of Toronto: Dean\u2019s List Scholar (2025); International Scholar Award (2024); Scholar at the Faculty of Arts & Science Award (2024)',
    ],
}

export const projects = [
    {
        title: 'Distributed Key-Value Store',
        paperRef: null,
        stack: ['Go'],
        description:
            "Built a distributed key-value store from scratch, including an LSM-tree storage engine (write-ahead log, memtable, SSTables, background compaction) and Raft consensus (leader election with Pre-Vote, log replication, ReadIndex, log compaction) with a custom wire protocol.",
        results: [
            '69.9x faster reads on a real 3-node cluster',
            '700ms mean leader failover time with zero data loss across simulated node failures',
        ],
        github: 'https://github.com/PedrowDias/key-value-store',
        interactive: true,
        demoType: 'architecture',
    },
    {
        title: 'Fourier Neural Operator for PDEs',
        paperRef: 'Li et al., 2021',
        stack: ['Python', 'PyTorch', 'NumPy'],
        description:
            'Implemented a Fourier Neural Operator for the 1D Burgers and 2D Navier-Stokes equations, including finite-difference and pseudo-spectral solvers, an MLP baseline, and spectral convolution layers in Fourier space.',
        results: [
            '15x lower test error than the MLP baseline (0.076 vs 1.14 relative L2)',
            'Resolution-invariant generalization to 1024-point grids trained only on 32–128 points',
            '21x per-sample inference speedup over classical solvers (0.6ms vs 12.65ms)',
        ],
        github: 'https://github.com/PedrowDias/Fourier-Neural-Operator',
        interactive: true,
    },
    {
        title: 'Multilingual Sentence Embeddings',
        paperRef: 'Reimers & Gurevych, 2020',
        stack: ['Python', 'PyTorch', 'Transformers'],
        description:
            'Implemented multilingual sentence embeddings via knowledge distillation, training a multilingual student (XLM-RoBERTa) to match a frozen English teacher (MiniLM) across 5 languages.',
        results: [
            '81.0% average Precision@1 and 85.7% average MRR on cross-lingual retrieval against a 500-candidate pool',
            '95.6% relative improvement in Precision@1 (41.4% \u2192 81.0%) by scaling training data 4x and epochs from 3 to 5',
        ],
        github: 'https://github.com/PedrowDias/multilingual-sentence-embeddings',
        interactive: true,
        demoType: 'retrieval',
    },
    {
        title: 'Python for the First Time',
        paperRef: null,
        stack: ['Python'],
        description:
            "Authored a free Python book for beginners covering the memory model, runtime complexity, OOP, and exercises with solutions. Downloaded 300+ times.",
        results: [],
        github: null,
        link: 'https://tinyurl.com/python-for-the-first-time',
        coverImage: 'images/python-book-cover.jpg',
        interactive: false,
    },
]

export const contact = {
    heading: "Contact Me",
    subheading: 'Let\'s Get In Touch!',
    body:
        "No need to do all that formal \"Dear Pedro, I hope this email finds you well...\", just send me a message! I'm always available and open to chat with new people :)",
    email: 'pedrowcdias@gmail.com',
    socials: [
        { label: 'GitHub', href: 'https://github.com/PedrowDias' },
        { label: 'LinkedIn', href: 'https://linkedin.com/in/pedrowdias' },
    ],
}
