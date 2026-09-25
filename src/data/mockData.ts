import { EventItem, StudyResource, ClubItem } from '../types';

export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Chronova HackFest 2026',
    tagline: '36-Hour Multi-Track Innovation & GenAI Marathon',
    description: 'The flagship annual hackathon bringing together 500+ builders, creators, and engineers to build groundbreaking projects across Generative AI, Web3 Infrastructure, Autonomous Robotics, and Climate Tech. Mentorship from industry pioneers and fast-track seed funding.',
    category: 'hackathon',
    format: 'hybrid',
    venue: 'Grand Tech Arena, North Campus & Discord Virtual Space',
    startDate: '2026-10-10T09:00:00Z',
    endDate: '2026-10-11T21:00:00Z',
    registrationDeadline: '2026-10-05T23:59:59Z',
    totalSeats: 500,
    registeredCount: 412,
    price: 'Free',
    prizes: '$35,000 Prize Pool + Cloud Credits',
    bannerImage: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    tags: ['AI/ML', 'FullStack', 'Web3', 'Hardware', 'Prizes'],
    featured: true,
    speakers: [
      {
        name: 'Dr. Elena Vance',
        role: 'Head of Applied AI',
        company: 'Synthetix Labs',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      {
        name: 'Marcus Sterling',
        role: 'Founding Partner',
        company: 'Vanguard Ventures',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      }
    ],
    agenda: [
      { time: '09:00 AM', activity: 'Opening Keynote & Problem Statements Unveiling' },
      { time: '11:00 AM', activity: 'Hacking Commences & Team Formation Room' },
      { time: '04:00 PM', activity: 'Mentor Office Hours: Architecture & Pitches' },
      { time: '09:00 AM (Day 2)', activity: 'Draft Submission & Code Freeze' },
      { time: '03:00 PM (Day 2)', activity: 'Top 10 Live Stage Pitches & Winner Ceremony' }
    ]
  },
  {
    id: 'evt-2',
    title: 'Zero to Transformer: Hands-On LLM Workshop',
    tagline: 'Build, Quantize & Fine-Tune Modern Attention Models',
    description: 'A deep-dive technical masterclass on transformer architectures. Learn how to train custom LoRA adapters, optimize inference throughput with TensorRT, and deploy low-latency embeddings on consumer GPUs with hands-on Google Colab notebooks provided.',
    category: 'workshop',
    format: 'virtual',
    venue: 'Google Meet High-Bandwidth Stream',
    startDate: '2026-09-28T14:00:00Z',
    endDate: '2026-09-28T18:00:00Z',
    registrationDeadline: '2026-09-27T12:00:00Z',
    totalSeats: 250,
    registeredCount: 228,
    price: 'Free',
    prizes: 'Certificate of Mastery + Compute Credits',
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['MachineLearning', 'PyTorch', 'Transformers', 'GPU'],
    featured: true,
    speakers: [
      {
        name: 'Siddharth Rao',
        role: 'Senior ML Engineer',
        company: 'Hugging Face Contributor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      }
    ],
    agenda: [
      { time: '02:00 PM', activity: 'Self-Attention Math from First Principles' },
      { time: '03:00 PM', activity: 'Coding FlashAttention & Multi-Head Projections' },
      { time: '04:30 PM', activity: 'Parameter-Efficient Fine-Tuning (PEFT/LoRA)' },
      { time: '05:30 PM', activity: 'Live Q&A and Deployment Benchmarks' }
    ]
  },
  {
    id: 'evt-3',
    title: 'Distributed Systems & Cloud Scale Architecture',
    tagline: 'Lessons from Scaling Services to 100M+ Daily Active Users',
    description: 'An exclusive tech talk examining real-world consensus algorithms (Raft, Paxos), eventual consistency patterns, and fault-tolerant event streams with Apache Kafka and distributed database replication.',
    category: 'tech-talk',
    format: 'in-person',
    venue: 'Auditorium Hall B, Turing Tech Center',
    startDate: '2026-10-02T16:00:00Z',
    endDate: '2026-10-02T18:30:00Z',
    registrationDeadline: '2026-10-01T20:00:00Z',
    totalSeats: 180,
    registeredCount: 165,
    price: 'Free',
    bannerImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    tags: ['SystemDesign', 'DistributedSystems', 'Kafka', 'Backend'],
    speakers: [
      {
        name: 'Aria Chen',
        role: 'Principal Architect',
        company: 'CloudScale Global',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      }
    ],
    agenda: [
      { time: '04:00 PM', activity: 'CAP Theorem in Production Reality' },
      { time: '04:45 PM', activity: 'Partitioning, Consensus & Leader Election' },
      { time: '05:40 PM', activity: 'Case Study: Handling 5M req/sec Flash Sales' }
    ]
  },
  {
    id: 'evt-4',
    title: 'CodeSprint Algo Showdown 2026',
    tagline: 'Competitive Coding Tournament with Live Leaderboard',
    description: 'Test your algorithmic agility against top competitive programmers! 6 challenging algorithmic problems spanning dynamic programming, graph theory, segment trees, and number theory. Instant feedback judge engine.',
    category: 'competition',
    format: 'virtual',
    venue: 'Chronova Arena Online Judge',
    startDate: '2026-10-04T13:00:00Z',
    endDate: '2026-10-04T16:00:00Z',
    registrationDeadline: '2026-10-03T23:59:59Z',
    totalSeats: 400,
    registeredCount: 310,
    price: 'Free',
    prizes: '$5,000 + Tech Gadgets & Swag',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Algorithms', 'DSA', 'CompetitiveProgramming', 'C++'],
    speakers: [
      {
        name: 'Karan Mehra',
        role: 'Grandmaster on Codeforces',
        company: 'Chronova Lead Setter',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      }
    ]
  },
  {
    id: 'evt-5',
    title: 'Autonomous Robotics & Edge AI Bootcamp',
    tagline: 'ROS2, LiDAR Slam & Micro-Controllers in Action',
    description: '3-day hands-on intensive bootcamp exploring computer vision at the edge, SLAM navigation for rover robots, and sensor fusion using Raspberry Pi and NVIDIA Jetson platforms.',
    category: 'bootcamp',
    format: 'in-person',
    venue: 'Robotics Fabrication Lab, Room 304',
    startDate: '2026-10-18T10:00:00Z',
    endDate: '2026-10-20T17:00:00Z',
    registrationDeadline: '2026-10-15T18:00:00Z',
    totalSeats: 60,
    registeredCount: 52,
    price: 'Free',
    prizes: 'Hardware Kit Sponsorships',
    bannerImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    tags: ['Robotics', 'ROS2', 'ComputerVision', 'Embedded'],
    speakers: [
      {
        name: 'Prof. Henrik Johansson',
        role: 'Director of Mechatronics',
        company: 'Institute of Robotics',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      }
    ]
  },
  {
    id: 'evt-6',
    title: 'CyberDefend: Capture The Flag (CTF) Invitational',
    tagline: 'Ethical Hacking, Reverse Engineering & Binary Exploitation',
    description: 'Jeopardy-style security challenge with tracks in Web Exploitation, Cryptography, Reverse Engineering, Forensic Analysis, and Cloud Security. Suitable for both novice bug hunters and hardened security enthusiasts.',
    category: 'competition',
    format: 'virtual',
    venue: 'Secure Cyber Range VPN',
    startDate: '2026-10-24T12:00:00Z',
    endDate: '2026-10-25T12:00:00Z',
    registrationDeadline: '2026-10-22T23:59:59Z',
    totalSeats: 300,
    registeredCount: 198,
    price: 'Free',
    prizes: '$8,000 + Security Certifications Vouchers',
    bannerImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    tags: ['CyberSecurity', 'CTF', 'EthicalHacking', 'Cryptography'],
    speakers: [
      {
        name: 'Natasha Romanova',
        role: 'Threat Intelligence Lead',
        company: 'DefSec Labs',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      }
    ]
  }
];

export const MOCK_STUDY_RESOURCES: StudyResource[] = [
  {
    id: 'res-1',
    title: 'Data Structures & Algorithms: The Complete Visual Field Guide',
    courseCode: 'CS-201',
    courseName: 'Data Structures & Analysis',
    department: 'cs',
    semester: 3,
    type: 'pdf',
    description: 'Comprehensive, illustrated handbook covering advanced trees (AVL, Red-Black, B-Trees), Graph Algorithms (Dijkstra, Bellman-Ford, Tarjan SCC), Dynamic Programming paradigms with step-by-step state transition formulas and C++/Python reference code.',
    author: {
      name: 'Prof. Alan Vance',
      role: 'Distinguished Professor of CS',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '14.8 MB',
    pageCount: 184,
    rating: 4.9,
    ratingCount: 342,
    downloadCount: 4210,
    likesCount: 1280,
    tags: ['Trees', 'Graphs', 'DynamicProgramming', 'Big-O'],
    lastUpdated: '2026-09-15',
    featured: true,
    contentPreview: {
      summary: 'A curated visual reference breaking down complex data structures into memory layouts, runtime proofs, and high-performance traversal algorithms.',
      keyPoints: [
        'Time & Space Complexity Proofs for 40+ Core Data Structures',
        'Visual Balance Rotations for Self-Balancing Binary Search Trees',
        'Graph Shortest Paths & Disjoint Set Union optimization techniques',
        'DP Memorization vs Tabulation with real-world state compression'
      ],
      sampleSnippet: '// Dijkstra with Min-Heap Priority Queue\nvoid dijkstra(int src, vector<vector<pair<int,int>>>& adj) {\n  priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n  dist[src] = 0;\n  pq.push({0, src});\n  // Traversal code...\n}'
    }
  },
  {
    id: 'res-2',
    title: 'Deep Learning & Neural Network Architectures: Math & Code',
    courseCode: 'AI-401',
    courseName: 'Deep Learning & Neural Computations',
    department: 'ai',
    semester: 7,
    type: 'notes',
    description: 'Rigorous handwritten and typed notes breaking down backpropagation tensor calculus, stochastic gradient descent optimizers (AdamW, RMSprop), normalization layers, CNN convolution arithmetic, and Transformer Multi-Query Attention.',
    author: {
      name: 'Sarah K. Jenkins',
      role: 'PhD AI Researcher',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '9.2 MB',
    pageCount: 96,
    rating: 4.8,
    ratingCount: 289,
    downloadCount: 3180,
    likesCount: 954,
    tags: ['PyTorch', 'Transformers', 'Backpropagation', 'Math'],
    lastUpdated: '2026-09-18',
    featured: true,
    contentPreview: {
      summary: 'Mathematical derivations of modern neural networks alongside concise PyTorch implementations.',
      keyPoints: [
        'Vectorized Jacobian derivations for multi-layer cross-entropy loss',
        'Mathematical proof of vanishing gradients and residual connections',
        'FlashAttention memory optimization mechanics and QKV projections',
        'LayerNorm vs RMSNorm computational trade-offs'
      ],
      sampleSnippet: 'class MultiHeadAttention(nn.Module):\n  def __init__(self, d_model, num_heads):\n    super().__init__()\n    self.qkv_proj = nn.Linear(d_model, 3 * d_model)\n    # Compute Scaled Dot-Product Attention...'
    }
  },
  {
    id: 'res-3',
    title: 'Operating Systems: Kernel Architecture & Concurrency Cheat Sheet',
    courseCode: 'CS-302',
    courseName: 'Operating Systems & Concurrency',
    department: 'cs',
    semester: 5,
    type: 'cheatsheet',
    description: 'Concise, high-yield summary of virtual memory paging, translation lookaside buffers (TLB), multi-level page tables, synchronization primitives (mutex, semaphores, spinlocks, condition variables), and POSIX thread safety.',
    author: {
      name: 'Devon Miles',
      role: 'Systems Engineer & TA',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '3.4 MB',
    pageCount: 12,
    rating: 4.95,
    ratingCount: 410,
    downloadCount: 5620,
    likesCount: 1890,
    tags: ['Kernel', 'VirtualMemory', 'Concurrency', 'Deadlocks'],
    lastUpdated: '2026-09-20',
    featured: true,
    contentPreview: {
      summary: 'High-density exam cheat sheet designed for rapid revision of core OS kernel topics.',
      keyPoints: [
        'Bankers Algorithm for Deadlock Avoidance with step-by-step matrices',
        'LRU, Clock, and Second-Chance Page Replacement Simulations',
        'Process State Lifecycle and Context Switching overhead metrics',
        'Reader-Writer and Dining Philosophers concurrency solutions in C'
      ]
    }
  },
  {
    id: 'res-4',
    title: 'Distributed Systems: Consensus, Raft & Paxos Interactive Masterclass',
    courseCode: 'CS-450',
    courseName: 'Cloud & Distributed Computing',
    department: 'cloud',
    semester: 7,
    type: 'video',
    description: 'A 10-episode video lecture masterclass recorded in 4K with interactive architectural diagrams explaining replication state machines, vector clocks, split-brain resolution, and quorum reads/writes.',
    author: {
      name: 'Dr. Marcus Vance',
      role: 'Chair of Cloud Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    duration: '4h 45m',
    rating: 4.9,
    ratingCount: 195,
    downloadCount: 1840,
    likesCount: 720,
    tags: ['Raft', 'Consensus', 'Cloud', 'Microservices'],
    lastUpdated: '2026-09-10',
    contentPreview: {
      summary: 'Full video walkthrough of building a resilient Raft consensus node from scratch.',
      keyPoints: [
        'Leader Election mechanics and randomized heartbeat timeouts',
        'Log compaction and snapshot installation across clusters',
        'Two-Phase Commit vs Saga pattern for distributed transactions',
        'Chaos engineering with Jepsen test suite'
      ]
    }
  },
  {
    id: 'res-5',
    title: 'Linear Algebra & Multivariable Calculus for Machine Learning',
    courseCode: 'MTH-205',
    courseName: 'Applied Mathematics for Computing',
    department: 'math',
    semester: 3,
    type: 'pdf',
    description: 'Essential mathematical foundations: Eigenvalues & Eigenvectors, Singular Value Decomposition (SVD), Principal Component Analysis (PCA), Hessian matrices, gradient descent contours, and convex optimization.',
    author: {
      name: 'Dr. Rebecca Stone',
      role: 'Associate Professor of Mathematics',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '18.1 MB',
    pageCount: 220,
    rating: 4.7,
    ratingCount: 215,
    downloadCount: 2790,
    likesCount: 680,
    tags: ['LinearAlgebra', 'SVD', 'Calculus', 'Optimization'],
    lastUpdated: '2026-09-02',
    contentPreview: {
      summary: 'Intuitive geometric and matrix interpretations of core machine learning mathematics.',
      keyPoints: [
        'Geometric visualization of linear transformations and span',
        'Spectral Theorem and Singular Value Decomposition proofs',
        'Lagrange Multipliers for constrained optimization',
        'Taylor series approximation in higher dimensions'
      ]
    }
  },
  {
    id: 'res-6',
    title: 'End-Term Previous Year Question Papers (PYQ) Bank: 2021-2025',
    courseCode: 'CS-301',
    courseName: 'Database Management Systems (DBMS)',
    department: 'cs',
    semester: 4,
    type: 'pyq',
    description: 'Fully solved 5-year official university question papers with marked model solutions for SQL queries, Relational Algebra, B+ Tree indexing, BCNF Normalization decompositions, and ACID transaction concurrency schedules.',
    author: {
      name: 'Chronova Academic Council',
      role: 'Student Academic Peer Board',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '12.5 MB',
    pageCount: 88,
    rating: 4.92,
    ratingCount: 512,
    downloadCount: 7890,
    likesCount: 2410,
    tags: ['DBMS', 'SQL', 'Normalization', 'ExamPrep'],
    lastUpdated: '2026-09-12',
    contentPreview: {
      summary: 'Official question sets paired with step-by-step marked rubrics and normalization matrices.',
      keyPoints: [
        'Full SQL relational algebra solutions for complex joins',
        'Step-by-step 1NF, 2NF, 3NF and BCNF loss-less decomposition proofs',
        'Conflict Serializability testing via Precedence Graphs',
        'B+ Tree insertion and deletion node split algorithms'
      ]
    }
  },
  {
    id: 'res-7',
    title: 'Modern Cryptography & Network Security Protocols',
    courseCode: 'CYB-402',
    courseName: 'Cybersecurity & Cryptographic Systems',
    department: 'cyber',
    semester: 7,
    type: 'pdf',
    description: 'Deep architectural walkthrough of AES-GCM, RSA key exchange, Elliptic Curve Cryptography (ECC), Diffie-Hellman, SHA-3, TLS 1.3 handshake lifecycle, and Zero-Knowledge Proof (ZKP) fundamentals.',
    author: {
      name: 'Prof. Viktor Krum',
      role: 'Chief of Cyber Defense Lab',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '11.0 MB',
    pageCount: 140,
    rating: 4.85,
    ratingCount: 168,
    downloadCount: 2130,
    likesCount: 590,
    tags: ['Cryptography', 'TLS', 'Security', 'ECC'],
    lastUpdated: '2026-08-28',
    contentPreview: {
      summary: 'Rigorous exploration of modern encryption protocols and attack vectors.',
      keyPoints: [
        'Elliptic Curve point addition and scalar multiplication math',
        'TLS 1.3 1-RTT and 0-RTT handshake cryptographic packet flow',
        'Side-channel attacks: timing vulnerabilities and cache attacks',
        'Post-Quantum Cryptography: Lattice-based Kyber and Dilithium'
      ]
    }
  },
  {
    id: 'res-8',
    title: 'Digital Signal Processing & Microcontroller Lab Manual',
    courseCode: 'ECE-305',
    courseName: 'Signals, Systems & Microcontrollers',
    department: 'ece',
    semester: 5,
    type: 'code',
    description: 'Complete hands-on laboratory manual with embedded C source code, MATLAB scripts for Fast Fourier Transforms (FFT), FIR/IIR filter design, and ARM Cortex-M4 peripheral register configurations.',
    author: {
      name: 'Dr. Arjun Patel',
      role: 'Professor of Embedded Systems',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80'
    },
    fileSize: '8.7 MB',
    pageCount: 110,
    rating: 4.65,
    ratingCount: 142,
    downloadCount: 1420,
    likesCount: 390,
    tags: ['Signals', 'DSP', 'ARM', 'C-Language', 'MATLAB'],
    lastUpdated: '2026-08-15',
    contentPreview: {
      summary: 'Practical signal processing algorithms mapped to hardware registers and execution cycles.',
      keyPoints: [
        'Radix-2 Cooley-Tukey FFT implementation in optimized C',
        'Bilinear transformation for digital Butterworth and Chebyshev filters',
        'DMA-driven ADC sampling on ARM Cortex architecture',
        'Audio spectrum analyzer real-time firmware template'
      ]
    }
  }
];

export const DEPARTMENT_OPTIONS = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'cs', label: 'Computer Science' },
  { id: 'ai', label: 'AI & Data Science' },
  { id: 'cloud', label: 'Cloud & Systems' },
  { id: 'cyber', label: 'Cyber Security' },
  { id: 'ece', label: 'Electrical & ECE' },
  { id: 'math', label: 'Applied Math' }
];

export const RESOURCE_TYPE_OPTIONS = [
  { id: 'all', label: 'All Formats' },
  { id: 'pdf', label: 'Textbooks / PDFs' },
  { id: 'notes', label: 'Lecture Notes' },
  { id: 'cheatsheet', label: 'Cheat Sheets' },
  { id: 'pyq', label: 'Previous Year (PYQ)' },
  { id: 'video', label: 'Video Lectures' },
  { id: 'code', label: 'Code & Labs' }
];

export const SEMESTER_OPTIONS = [
  { id: 0, label: 'All Semesters' },
  { id: 1, label: 'Sem 1' },
  { id: 2, label: 'Sem 2' },
  { id: 3, label: 'Sem 3' },
  { id: 4, label: 'Sem 4' },
  { id: 5, label: 'Sem 5' },
  { id: 6, label: 'Sem 6' },
  { id: 7, label: 'Sem 7' },
  { id: 8, label: 'Sem 8' }
];

export const MOCK_CLUBS: ClubItem[] = [
  {
    id: 'club-1',
    name: 'Autonomous Robotics & AI Club',
    category: 'Hardware & AI',
    meetingTime: 'Tuesdays & Thursdays, 5:30 PM',
    location: 'Maker Lab 304, North Block',
    currentMembers: 68,
    leadName: 'Prof. Henrik & Alex Vance',
    qrToken: 'CLUB_AUTH_ROBOTICS_2026_X91',
    icon: 'Bot',
    description: 'Building autonomous quadrupeds, ROS2 navigation stacks, and custom embedded drone hardware.',
    email: 'robotics@chronova.edu',
    tags: ['ROS2', 'Computer Vision', 'Microcontrollers', 'Drones'],
    coverImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
    recruiting: true
  },
  {
    id: 'club-2',
    name: 'Chronova Competitive Programmers Guild',
    category: 'Algorithms & DSA',
    meetingTime: 'Wednesdays, 6:00 PM',
    location: 'Turing Computer Lab 2',
    currentMembers: 112,
    leadName: 'Karan Mehra',
    qrToken: 'CLUB_CP_GUILD_2026_Q42',
    icon: 'Code2',
    description: 'Weekly ICPC style mock contests, dynamic programming masterclasses, and code review rounds.',
    email: 'cp-guild@chronova.edu',
    tags: ['ICPC', 'Codeforces', 'Graph Theory', 'C++'],
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    recruiting: true
  },
  {
    id: 'club-3',
    name: 'CyberDefend Security Guild',
    category: 'Cybersecurity & CTF',
    meetingTime: 'Fridays, 4:00 PM',
    location: 'Cyber Range Sandbox Lab',
    currentMembers: 54,
    leadName: 'Natasha Romanova',
    qrToken: 'CLUB_CYBER_DEF_2026_C77',
    icon: 'ShieldCheck',
    description: 'Ethical hacking drills, binary reverse engineering, red-team simulations and national CTF squads.',
    email: 'cyberdefend@chronova.edu',
    tags: ['CTF', 'Web Security', 'Binary Exploitation', 'Ghidra'],
    coverImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    recruiting: true
  },
  {
    id: 'club-4',
    name: 'UI/UX & Product Design Collective',
    category: 'Creative Tech',
    meetingTime: 'Mondays, 5:00 PM',
    location: 'Design Studio B, Art Wing',
    currentMembers: 42,
    leadName: 'Maya Lin',
    qrToken: 'CLUB_DESIGN_COLL_2026_D18',
    icon: 'Palette',
    description: 'Figma prototyping jams, design system architecture, accessibility audits and portfolio critiques.',
    email: 'design@chronova.edu',
    tags: ['Figma', 'Design Systems', 'Micro-interactions', 'User Research'],
    coverImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80',
    recruiting: false
  },
  {
    id: 'club-5',
    name: 'Open Source Software Society (OSSS)',
    category: 'Open Source',
    meetingTime: 'Saturdays, 3:00 PM',
    location: 'Linux Hub, Central Library',
    currentMembers: 89,
    leadName: 'Aarav Nair',
    qrToken: 'CLUB_OSSS_2026_O99',
    icon: 'Terminal',
    description: 'Contributing to high-impact CNCF, Linux Foundation & Apache projects. GSoC & LFX mentoring.',
    email: 'oss@chronova.edu',
    tags: ['Linux', 'Git', 'Rust', 'Kubernetes'],
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    recruiting: true
  },
  {
    id: 'club-6',
    name: 'Generative AI & LLM Builders Club',
    category: 'Artificial Intelligence',
    meetingTime: 'Thursdays, 6:30 PM',
    location: 'Deep Learning Cluster 101',
    currentMembers: 130,
    leadName: 'Devika Sen',
    qrToken: 'CLUB_GENAI_2026_G12',
    icon: 'Cpu',
    description: 'Fine-tuning open weights, multi-agent orchestrations with LangChain, and edge inference on TPUs.',
    email: 'genai@chronova.edu',
    tags: ['LLMs', 'Transformers', 'PyTorch', 'Agents'],
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    recruiting: true
  }
];

export const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Certificate of Excellence: HackFest 2026 Finalist',
    issueDate: '2026-09-18',
    recipientName: 'Alex Mercer',
    recipientEmail: 'alex.mercer@chronova.edu',
    verificationId: 'CERT-CHRON-84920-HF',
    qrCode: 'https://chronova.edu/verify/CERT-CHRON-84920-HF',
    issuer: 'Chronova Innovation Council & Synthetix Labs',
    grade: 'First Class with Distinction',
    skills: ['Generative AI', 'System Design', 'Fast Prototyping']
  },
  {
    id: 'cert-2',
    title: 'Mastery in Attention Mechanisms & Transformers',
    issueDate: '2026-08-30',
    recipientName: 'Alex Mercer',
    recipientEmail: 'alex.mercer@chronova.edu',
    verificationId: 'CERT-CHRON-32091-TF',
    qrCode: 'https://chronova.edu/verify/CERT-CHRON-32091-TF',
    issuer: 'Chronova Machine Learning Chapter',
    grade: 'Grade A+',
    skills: ['PyTorch', 'LoRA Fine-Tuning', 'Quantization']
  },
  {
    id: 'cert-3',
    title: 'Distinguished Club Attendance & Leadership',
    issueDate: '2026-07-25',
    recipientName: 'Alex Mercer',
    recipientEmail: 'alex.mercer@chronova.edu',
    verificationId: 'CERT-CHRON-19402-CL',
    qrCode: 'https://chronova.edu/verify/CERT-CHRON-19402-CL',
    issuer: 'Competitive Programmers Guild',
    grade: 'Honor Roll',
    skills: ['DSA Mastery', 'Graph Algorithms', 'Mentorship']
  }
];

export const MOCK_FEEDBACKS = [
  {
    id: 'fb-1',
    eventId: 'evt-2',
    eventTitle: 'Zero to Transformer: Hands-On LLM Workshop',
    studentName: 'Rohan Sharma',
    studentEmail: 'rohan.s@chronova.edu',
    type: 'complaint' as const,
    rating: 3,
    category: 'Technical Glitch' as const,
    subject: 'Colab GPU quota exhaustion during FlashAttention practicals',
    message: 'During the second half of the transformer workshop, many students ran out of free Google Colab T4 GPU compute. It would be super helpful if coupon codes or pre-configured cloud VMs were shared ahead of time.',
    status: 'Under Review' as const,
    adminResponse: 'We have taken note of this. For the upcoming workshop batch, Chronova Cloud compute instances with dedicated L4 GPUs will be allocated to all registered attendees.',
    createdAt: '2026-09-20T10:15:00Z'
  },
  {
    id: 'fb-2',
    eventId: 'evt-1',
    eventTitle: 'Chronova HackFest 2026',
    studentName: 'Elena Rostova',
    studentEmail: 'elena.r@chronova.edu',
    type: 'suggestion' as const,
    rating: 5,
    category: 'Organization' as const,
    subject: 'Quiet room request for late-night architecture discussions',
    message: 'Last year the hackathon floor was fantastic but very loud. Can the committee allocate Room 204 or the library mezzanine as a designated quiet debugging and pitch rehearsal zone?',
    status: 'Resolved' as const,
    adminResponse: 'Approved! Room 204 has officially been reserved as the 24/7 Silent Focus & Architecture Sanctuary for HackFest 2026.',
    createdAt: '2026-09-18T16:40:00Z'
  },
  {
    id: 'fb-3',
    eventId: 'evt-3',
    eventTitle: 'Distributed Systems & Cloud Scale Architecture',
    studentName: 'Marcus Wright',
    studentEmail: 'marcus.w@chronova.edu',
    type: 'review' as const,
    rating: 5,
    category: 'Speaker Quality' as const,
    subject: 'Incredible real-world breakdown of Raft and consensus algorithms',
    message: 'Aria Chen explained consensus and split-brain recovery better than any textbook I have read. The interactive slides and live chaos injection demo were top notch.',
    status: 'Resolved' as const,
    adminResponse: 'Thank you for the review! The recorded replay and speaker slide deck are now live in the Study Material Hub under CS-450.',
    createdAt: '2026-09-19T09:20:00Z'
  },
  {
    id: 'fb-4',
    eventId: 'evt-4',
    eventTitle: 'CodeSprint Algo Showdown 2026',
    studentName: 'Priya Patel',
    studentEmail: 'priya.p@chronova.edu',
    type: 'complaint' as const,
    rating: 2,
    category: 'Technical Glitch' as const,
    subject: 'Online judge testcase discrepancy on Problem 4 (Segment Trees)',
    message: 'One of the hidden test cases in Problem 4 had a negative array index constraint that was not specified in the problem statement. Several submissions received unexpected runtime errors.',
    status: 'Pending' as const,
    adminResponse: '',
    createdAt: '2026-09-21T18:05:00Z'
  }
];

