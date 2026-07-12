// --- Types ---

export interface Project {
    title: string;
    link: string;
    category?: string;
    demo?: string;
    description?: string;
    techStack?: string[];
    featured?: boolean;
}

export interface CvExperience {
    title: string;
    company: string;
    location?: string;
    duration: string;
    details: string[];
    tags?: string[];
}

export interface CvEducation {
    degree: string;
    university: string;
    duration: string;
    note?: string;
}

export interface Education extends CvEducation {
    emoji?: string;
}

export interface PostgraduateDiploma {
    title: string;
    institution: string;
    year: string;
}

export interface CvReference {
    name: string;
    title: string;
    company: string;
    email: string | null;
    phone: string;
}

export interface CvSkillCategory {
    label: string;
    value: string;
}

export interface SkillCategory {
    category: string;
    skills: string[];
}

export interface CertificationItem {
    label: string;
    url?: string;
    /** Sortable completion date: YYYY, YYYY-MM, or YYYY-MM-DD */
    completed: string;
}

export interface CertificationGroup {
    category: string;
    items: CertificationItem[];
}

export interface CvData {
    name: string;
    jobTitle: string;
    email: string;
    phones: string[];
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
    skillCategories: CvSkillCategory[];
    experience: CvExperience[];
    community: CvExperience[];
    education: CvEducation[];
    awards: string[];
    certifications: string[];
    diplomas: string[];
    references: CvReference[];
}

// --- Skill Categories ---

export const skillCategories: SkillCategory[] = [
    {
        category: 'Languages',
        skills: ['Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'SQL'],
    },
    {
        category: 'Frontend',
        skills: ['React', 'Next.js', 'Tailwind CSS', 'Flutter', 'React Native'],
    },
    {
        category: 'Backend',
        skills: ['Node.js/Express', 'Django', '.NET', 'REST APIs'],
    },
    {
        category: 'AI',
        skills: [
            'Vercel AI SDK',
            'Genkit',
            'Firebase Studio',
            'Google AI Studio',
            'Gemini API',
            'RAG',
            'Orange Data Mining',
            'n8n',
        ],
    },
    {
        category: 'Cloud',
        skills: ['Docker', 'Kubernetes', 'Azure', 'CI/CD', 'Git', 'Vercel', 'Netlify'],
    },
    {
        category: 'Cybersecurity',
        skills: ['CompTIA CySA+', 'Network Security', 'SIEM', 'IDS', 'Compliance'],
    },
    {
        category: 'Databases',
        skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'Firebase'],
    },
    {
        category: 'Tools',
        skills: ['Cursor 2.0', 'Tableau', 'Microsoft 365/Office', 'Power BI', 'Claude Code'],
    },
];

// --- Projects ---

export const projects: Project[] = [
    {
        title: 'ai-chatBot using AI SDK by Vercel',
        link: 'https://github.com/MS0C54073/ai-chatBot_muzoGPT',
        category: 'AI/ML',
        featured: true,
        techStack: ['Next.js', 'Vercel AI SDK', 'TypeScript'],
    },
    {
        title: 'ZamFund — Zambia Fund Hub',
        link: 'https://github.com/MS0C54073/zamfundhub',
        demo: 'https://zamfund.vercel.app/',
        description:
            'A Zambian-first investment marketplace connecting local startups and SMEs with retail and diaspora investors. Founders raise capital through equity, revenue-share, loan, or crowdfunding campaigns, while investors browse verified opportunities, fund campaigns from an in-app wallet, and track returns.',
        featured: true,
        techStack: ['Next.js', 'TypeScript', 'Supabase'],
    },
    {
        title: "ZamRate — The People's Pulse",
        link: 'https://github.com/MS0C54073/zamrate',
        demo: 'https://zamrate.vercel.app/',
        description:
            'A citizen-driven, privacy-first review platform for Zambian companies and public services. Real reviews. Real experiences. Real impact.',
        featured: true,
        techStack: ['Next.js', 'TypeScript', 'Supabase'],
    },
    {
        title: 'Salem Tailors — Digital Shop Management System',
        link: 'https://github.com/MS0C54073/salemtailors',
        demo: 'https://salemtailors.vercel.app/',
        description:
            'A web-based platform that centralizes customer records, measurements, order tracking, appointments, and financials for tailoring businesses — optimized for mobile and low-connectivity environments. Built as a personal project for my parents, it has grown into a scalable solution with plans for inventory management, analytics, and online payments.',
        featured: true,
        techStack: ['Next.js', 'TypeScript'],
    },
    {
        title: 'Chicken Dodger',
        link: 'https://github.com/MS0C54073/Chicken_Dodger',
        demo: 'https://chickendodger.netlify.app/',
        description:
            'An emoji-powered arcade dodger game built with Next.js 15 + TypeScript + Supabase. Dodge falling chickens, collect power-ups, climb levels, and compete on a live global leaderboard — playable on both desktop and mobile.',
        featured: true,
        techStack: ['Next.js', 'TypeScript', 'Supabase'],
    },
    {
        title: 'Machine Learning Disease Predictor',
        link: 'https://github.com/MS0C54073/MLDiseasepredictor',
        category: 'AI/ML',
    },
    {
        title: 'Spiking Neural Network (SNN) with PyTorch',
        link: 'https://github.com/MS0C54073/Spiking-Neural-Network-SNN-with-PyTorch',
        category: 'AI/ML',
    },
    {
        title: 'AI CV Generator & Resume Parser',
        link: 'https://github.com/MS0C54073/Cv_Generator/tree/master/resume',
        category: 'AI/ML',
    },
    {
        title: 'Detecting Fake News with Python',
        link: 'https://github.com/MS0C54073/Detecting-Fake-News',
        category: 'AI/ML',
    },
    {
        title: 'Spotify Recommendation Model (ML)',
        link: 'https://github.com/MS0C54073/Spotify-Recommendation-model',
        category: 'AI/ML',
    },
    {
        title: 'Personal/Portfolio Website',
        link: 'https://github.com/MS0C54073/muzoprof',
        demo: 'https://tinyurl.com/muzoslim',
        featured: true,
        techStack: ['Next.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
        title: 'AquaView Water Quality Monitoring System',
        link: 'https://github.com/MS0C54073/AquaAnalys',
    },
    {
        title: 'Career Connect Zambia (CCZ), personal project.',
        link: 'https://github.com/MS0C54073/CCZ',
        demo: 'https://shorturl.at/jLk8n',
    },
    {
        title: 'Asset verification System',
        link: 'https://github.com/MS0C54073/AVEP-1.0',
    },
    {
        title: 'MULTI-VENDOR ECOMMERCE WEBSITE (FINAL YEAR PROJECT)',
        link: 'https://github.com/MS0C54073/Final-Year-Project',
    },
    {
        title: 'TEXT FILES ARCHIVING PROGRAM (C++ Builder)',
        link: 'https://github.com/MS0C54073/TEXT-FILES-ARCHIVING-PROGRAM-Cplusplus-Builder',
    },
    {
        title: 'ToDoTasks',
        link: 'https://github.com/MS0C54073/TaskTicker',
    },
    {
        title: 'PBX SUBSCRIBERS (Data structures and algorithms)',
        link: 'https://github.com/MS0C54073/QueueDatabaseCplusplus',
    },
    {
        title: 'STOCK PRICE PREDICTION',
        link: 'https://github.com/MS0C54073/Stocks-Price-Prediction-Python',
    },
    {
        title: 'STORE-LOCATOR',
        link: 'https://github.com/MS0C54073/store-locator',
    },
];

const FEATURED_PROJECT_ORDER = [
    'ZamFund — Zambia Fund Hub',
    "ZamRate — The People's Pulse",
    'Salem Tailors — Digital Shop Management System',
    'Personal/Portfolio Website',
    'Chicken Dodger',
    'ai-chatBot using AI SDK by Vercel',
] as const;

export const featuredProjects = FEATURED_PROJECT_ORDER.map((title) => {
    const project = projects.find((entry) => entry.title === title);
    if (!project) {
        throw new Error(`Featured project not found: ${title}`);
    }
    return project;
});

// --- Professional Experience ---

export const professionalExperiences: CvExperience[] = [
    {
        title: 'Wealth Management Consultant',
        company: 'Prudential Life Assurance Zambia · Contract',
        duration: 'Jun 2026 – Present',
        location: 'Lusaka, Zambia · Hybrid',
        details: [
            "Identify clients' financial protection and wealth creation needs and provide tailored financial solutions",
            'Build and maintain a strong network to generate leads, referrals, and grow a client portfolio',
            'Conduct financial needs analyses and advise clients on suitable insurance and investment products',
            'Develop long-term client relationships and serve as the primary point of contact for financial guidance',
            'Grow client portfolios through relationship management and cross-selling of financial products',
            'Educate clients on wealth protection, financial planning, and long-term financial security',
        ],
        tags: ['Family Wealth Management', 'Private Wealth Management'],
    },
    {
        title: 'IT Support Volunteer & Technical Assistant',
        company: 'Embassy of the Republic of Zambia, Moscow',
        duration: 'Jan 2025 – Jul 2025',
        details: [
            "Maintained and supported the embassy's IT infrastructure, ensuring reliable and secure daily operations",
            'Successfully upgraded legacy Windows 7 systems to Windows 10 and Windows 11, improving system performance, security, and compatibility',
            'Performed hardware upgrades including RAM installations, driver updates, system optimisation, and disk defragmentation to enhance overall performance',
            'Installed and configured the latest Microsoft Office, antivirus software, and email accounts for embassy staff',
            'Advised the mission on modernising its IT infrastructure by recommending the replacement of outdated systems to improve operational efficiency',
            'Delivered user support and troubleshooting, minimising downtime and ensuring uninterrupted embassy operations',
            'Promoted cybersecurity awareness by training staff on password security best practices, recognising cyber threats, and implementing regular password update policies',
        ],
    },
    {
        title: 'Software Engineer for AI Training Data | AI Content Evaluation Specialist (Project Based)',
        company: 'Invisible Technologies & Outlier',
        duration: 'Aug 2024 – Present · Part-time',
        details: [
            'Evaluated AI-generated content across code, text, images, and video',
            'Solved complex coding problems ensuring efficiency and reliability',
            'Developed test cases and verification methodologies to validate output quality',
            'Provided actionable feedback to optimise AI content generation processes',
        ],
    },
    {
        title: 'IT Support / Junior Programmer',
        company: 'Webstor (Bitrix24 Gold Partner), Novosibirsk, Russia',
        duration: '2022 – 2024',
        details: [
            'Supported implementation and integration projects for Bitrix24 corporate portals and client systems',
            'Assisted with onboarding, configuration, testing and troubleshooting for client deployments',
            'Contributed to development and support of Bitrix24 modules and applications for clients',
            'Provided technical support for integration-related issues, escalating complex cases as needed',
            'Documented workflows, configurations and support actions for ongoing client projects',
            'Gained exposure to CRM/ERP implementation, field-staff management tools and 1C integration projects',
        ],
    },
    {
        title: 'AI Training Methods Researcher',
        company: 'Novosibirsk State Technical University',
        duration: '2022 – 2024',
        details: [
            'Tested and evaluated novel training algorithms for Spiking Neural Networks (SNNs)',
            'Conducted experiments analysing performance of various SNN training methodologies',
            'Managed and preprocessed large-scale datasets for neural network models',
        ],
    },
    {
        title: 'System Administrator Intern',
        company: 'Pensions and Insurance Authority, Zambia',
        duration: 'May 2022 – Oct 2022',
        details: [
            'Maintained, secured, and optimised IT infrastructure and organisational websites',
            'Monitored system performance and resolved technical issues promptly',
            'Provided ICT support and user training, enhancing overall technical efficiency',
        ],
    },
    {
        title: 'Software Development Trainee',
        company: 'Kursk State University, Russia',
        duration: 'May 2019 – Jul 2021',
        details: [
            'Built, tested, and optimised applications using C++, Python, and C#',
            'Applied automated debugging and performance optimisation techniques',
            'Collaborated with senior developers in real-world software environments',
        ],
    },
    {
        title: 'IT Support Freelancer',
        company: 'Self-Employed',
        duration: '2017 – Present',
        details: [
            'Deliver remote and on-site technical assistance to individuals and businesses',
            'Resolve hardware, software, and network issues across multiple channels',
            'Document comprehensive solutions and maintain detailed client records',
        ],
    },
    {
        title: 'Customer Care Associate',
        company: 'Tech Mahindra (Airtel Zambia PLC)',
        duration: 'Aug 2015 – Oct 2016',
        details: [
            'Ensured customer satisfaction through consistent service excellence',
            'Managed customer relationship building and service retention initiatives',
            'Promoted brand value through service delivery aligned to customer needs',
        ],
    },
    {
        title: 'Internet Cafe Operator',
        company: 'AbduTech InterNet Cafe',
        duration: 'Dec 2013 – Aug 2015',
        details: [
            'Assisted customers with PC software including Microsoft Office, Adobe suites, Windows OS installation, and other essential programs',
            'Provided services such as encoding, printing, photocopying, typing, and downloading',
            'Troubleshot computer applications, hardware, and software issues across a range of customer devices',
            'Maintained computer systems with routine maintenance, virus removal, and system updates to ensure security and reliability',
            'Assisted customers with email setup, online applications, account creation, and basic IT guidance',
            'Delivered excellent customer care and maintained accurate store records and inventories',
        ],
    },
];

// --- Community Involvement ---

export const communityInvolvement: CvExperience[] = [
    {
        title: 'Student Welfare Volunteer',
        company: 'Zambian Student Community, Russia',
        duration: '2017 – 2025',
        details: [
            'Assisted newly arrived scholarship students with orientation, settlement, and integration',
            'Coordinated and maintained records of outgoing students, ensuring smooth transitions',
            'Provided ongoing pastoral support and guidance to the wider student community',
        ],
    },
    {
        title: 'Volunteer Teacher — Special Needs & TEFL Summer Camps',
        company: 'University Volunteer Programme, Russia',
        duration: '2019 – 2023',
        details: [
            'Taught at university-organised summer camps for children with special needs and able-bodied children',
            'Delivered TEFL (Teaching English as a Foreign Language) lessons and extracurricular activities',
            'Designed inclusive, engaging learning experiences catering to diverse abilities and learner needs',
        ],
    },
];

// --- Education ---

export const educationData: Education[] = [
    {
        degree: 'EducationUSA Scholar',
        emoji: '🇺🇸',
        university: 'U.S. Embassy Lusaka / EducationUSA Zambia',
        duration: '2026',
    },
    {
        degree: 'BSc Software and Information Systems Administration',
        university: 'Kursk State University, Russia',
        duration: '2017 – 2021',
    },
    {
        degree: 'Russian Language & Preparatory Programme',
        university: 'Belgorod State University',
        duration: '2016 – 2017',
    },
    {
        degree: 'General Certificate in Education (O-Levels)',
        university: 'Arakan Boys Secondary School',
        duration: '2011 – 2013',
    },
];

// --- Postgraduate Diplomas ---

export const postgraduateDiplomasData: PostgraduateDiploma[] = [
    {
        title: 'Management in the Digital Economy',
        institution: 'Novosibirsk State Technical University',
        year: '2023',
    },
    {
        title: 'Technological Entrepreneurship and Innovation Management',
        institution: 'Novosibirsk State Technical University',
        year: '2023',
    },
    {
        title: 'Management of High Tech Programmes and Projects',
        institution: 'Pskov State University',
        year: '2023',
    },
    {
        title: 'Certificate: Development of Digital Twins — Machine Learning with Orange Data Mining',
        institution: 'Novosibirsk State Technical University',
        year: '2023',
    },
];

// --- References ---

export const references: CvReference[] = [
    {
        name: 'Innocent Mukupa',
        title: 'ICT Manager',
        company: 'Pensions & Insurance Authority',
        email: 'mungolemukupa@gmail.com',
        phone: '+260 964 748 111',
    },
    {
        name: 'Mwansa Kapoka',
        title: 'Team Leader',
        company: 'TechMahindra Limited Zambia',
        email: 'mwansa.kapoka@sc.com',
        phone: '+260 978 980 443',
    },
    {
        name: 'Ann Chibinga',
        title: 'Team Leader',
        company: 'VITALITE Zambia',
        email: 'ann.chibinga@vitalitegroup.com',
        phone: '(+260) 777407124',
    },
    {
        name: 'Prof. Aaron B. Zyambo',
        title: 'CEO & Lead Consultant',
        company: "Mega Vision Logistics Int'l Ltd",
        email: 'abzyambo@yahoo.com',
        phone: '+260 979 793 999',
    },
    {
        name: 'Allan Mwimbu',
        title: 'First Secretary Political (Admin Supervisor)',
        company: 'Embassy of Zambia, Moscow',
        email: null,
        phone: '+7 985 515 9011',
    },
];

// --- Certifications ---

const parseCompletedDate = (value: string): number => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return new Date(value).getTime();
    }
    if (/^\d{4}-\d{2}$/.test(value)) {
        return new Date(`${value}-01`).getTime();
    }
    if (/^\d{4}$/.test(value)) {
        return new Date(`${value}-12-31`).getTime();
    }
    return 0;
};

const sortByCompletedDesc = <T extends { completed: string }>(items: T[]): T[] =>
    [...items].sort(
        (a, b) => parseCompletedDate(b.completed) - parseCompletedDate(a.completed)
    );

const sortCertificationGroups = (groups: CertificationGroup[]): CertificationGroup[] =>
    [...groups]
        .map((group) => ({
            ...group,
            items: sortByCompletedDesc(group.items),
        }))
        .sort((a, b) => {
            const aLatest = Math.max(...a.items.map((item) => parseCompletedDate(item.completed)));
            const bLatest = Math.max(...b.items.map((item) => parseCompletedDate(item.completed)));
            return bLatest - aLatest;
        });

const rawCertificationGroups: CertificationGroup[] = [
    {
        category: 'Cybersecurity',
        items: [
            {
                label: 'Cisco CCNA (200-301) Specialization - Coursera',
                url: 'https://coursera.org/verify/specialization/3IP35A6BG3KL',
                completed: '2026-07',
            },
            {
                label: 'CompTIA Cybersecurity Analyst (CySA+) CS0-003 (Specialization) - Pearson Education',
                url: 'https://coursera.org/verify/specialization/BEVC4O7ECJ16',
                completed: '2025-11',
            },
            {
                label: 'Google Cybersecurity Professional Certificate — Google',
                url: 'https://www.coursera.org/account/accomplishments/professional-cert/ZQRFL5JFN79Z',
                completed: '2023-11',
            },
            {
                label: 'IT Fundamentals for Cybersecurity — IBM (Specialisation)',
                url: 'https://www.coursera.org/account/accomplishments/specialization/certificate/BDSXYEGVZUWK',
                completed: '2023-05',
            },
            {
                label: 'Introduction to Cybersecurity — Smart Zambia Institute / Cisco',
                completed: '2018-06',
            },
        ],
    },
    {
        category: 'AI & Machine Learning',
        items: [
            {
                label: 'AI Agents and Agentic AI in Python: Powered by Generative AI — Vanderbilt University (Specialisation)',
                url: 'https://www.coursera.org/account/accomplishments/specialization/K42YL24QMRT3',
                completed: '2025-08',
            },
            {
                label: 'Prompt Engineering for ChatGPT — Vanderbilt University',
                url: 'https://www.coursera.org/account/accomplishments/certificate/G2PJN56CJCLF',
                completed: '2024-06',
            },
        ],
    },
    {
        category: 'Software Engineering',
        items: [
            {
                label: 'Developing Front-End Apps with React — IBM / Coursera',
                url: 'https://www.coursera.org/account/accomplishments/verify/IN3O7BHB70JS',
                completed: '2024-04',
            },
        ],
    },
    {
        category: 'Cloud & Data',
        items: [
            {
                label: 'Enterprise Data Integration, Governance and Architecture (Specialization)',
                url: 'https://coursera.org/verify/specialization/VQG0M4XP7P47',
                completed: '2025-10',
            },
            {
                label: 'Key Technologies for Business — IBM (Specialisation)',
                url: 'https://www.coursera.org/account/accomplishments/specialization/ED6HPWDG6QVB',
                completed: '2023-08',
            },
        ],
    },
    {
        category: 'Programming',
        items: [
            {
                label: 'C++ (Basic) Certificate',
                url: 'https://www.hackerrank.com/certificates/dea4f08fe541',
                completed: '2022-08',
            },
            {
                label: 'Python (Basic) Certificate',
                url: 'https://www.hackerrank.com/certificates/6e56080d33f3',
                completed: '2022-06',
            },
            {
                label: 'Basic Electronics and Arduino Programming — TME EDUCATION',
                completed: '2019-01',
            },
        ],
    },
    {
        category: 'Business & Entrepreneurship',
        items: [
            {
                label: "Business School's Globalization – Economic Growth and Stability — IE University / Coursera",
                url: 'https://www.coursera.org/account/accomplishments/specialization/Q33ORL130G9S',
                completed: '2024-02',
            },
        ],
    },
    {
        category: 'Taxation & Compliance',
        items: [
            {
                label: 'ZRA Customs Appreciation Course',
                url: 'https://online.atingi.org/pluginfile.php/1/tool_certificate/issues/1782245945/6699500449MS.pdf',
                completed: '2026-06-23',
            },
            {
                label: 'ZRA PAYE Appreciation Course',
                url: 'https://online.atingi.org/pluginfile.php/1/tool_certificate/issues/1782227768/0375281015MS.pdf',
                completed: '2026-06-23',
            },
            {
                label: 'ZRA Smart Invoice Course',
                url: 'https://online.atingi.org/pluginfile.php/1/tool_certificate/issues/1782065027/6893547292MS.pdf',
                completed: '2026-06-21',
            },
            {
                label: 'ZRA Indirect Taxes Course',
                url: 'https://online.atingi.org/pluginfile.php/1/tool_certificate/issues/1782056658/1233986026MS.pdf',
                completed: '2026-06-21',
            },
        ],
    },
];

export const certificationGroups: CertificationGroup[] =
    sortCertificationGroups(rawCertificationGroups);

export const certificationEntries: string[] = sortByCompletedDesc(
    certificationGroups.flatMap((group) => group.items)
).map((item) => (item.url ? `${item.label} — ${item.url}` : item.label));

// --- CV Data ---

export const buildCvData = (): CvData => ({
    name: 'MUSONDA SALIMU',
    jobTitle:
        'AI-enabled Software Engineer (TypeScript) | IT Specialist | Wealth Management Consultant | Tutor',
    email: 'musondasalim@gmail.com',
    phones: ['+260 966 882 901', '+260 979 287 496', '+260 977 288 260'],
    location: 'Lusaka, Zambia',
    linkedin: 'linkedin.com/in/musonda-salimu',
    github: 'github.com/MS0C54073',
    portfolio: 'tinyurl.com/muzoslim',
    summary: [
        "AI-enabled Software Engineer (TypeScript) | CompTIA CySA+ Certified | Tutor & Educator | EducationUSA Scholar | Winner of the International Olympiad of the Financial University for Youth (Master's Degree, 2023–2024).",
        'Passionate about AI, cybersecurity, cloud technologies, and software engineering. I enjoy building practical solutions with LLMs, Kubernetes, n8n, and Supabase. Dedicated to community service, volunteering, and empowering young people through ICT education to help build a stronger Zambia and Africa.',
    ].join(' '),
    skillCategories: [
        { label: 'Languages', value: 'Python, JavaScript, TypeScript, C++, C#, SQL' },
        { label: 'Frameworks', value: 'React, Next.js, Node.js/Express, Django, .NET' },
        { label: 'Mobile & Web', value: 'Flutter, React Native' },
        { label: 'Databases', value: 'PostgreSQL (Supabase), MongoDB, Firebase' },
        {
            label: 'AI & Automation',
            value: 'Genkit, Firebase Studio, Claude Code, n8n, Gemini API, Orange Data Mining, RAG',
        },
        { label: 'Cloud & DevOps', value: 'Docker, Kubernetes, Git, CI/CD, Azure' },
        { label: 'Cybersecurity', value: 'CompTIA CySA+, Network Security, SIEM, IDS, Compliance' },
        { label: 'Tools', value: 'Cursor 2.0, Tableau, Microsoft 365/Office, Power BI' },
    ],
    experience: professionalExperiences.map(({ title, company, duration, details, location, tags }) => ({
        title,
        company,
        duration,
        details,
        location,
        tags,
    })),
    community: communityInvolvement,
    education: educationData.map(({ degree, university, duration }) => ({
        degree,
        university,
        duration,
    })),
    awards: [
        "WINNER of 'International Olympiad of the Financial University for Youth (Master's Degree - 2023-2024)'",
        'EducationUSA Scholar — U.S. Embassy Lusaka / EducationUSA Zambia (2026)',
    ],
    certifications: certificationEntries,
    diplomas: postgraduateDiplomasData.map(
        (diploma) => `${diploma.title} — ${diploma.institution} (${diploma.year})`
    ),
    references,
});

export const cvData = buildCvData();
