
export interface Material {
    title: string;
    children?: Material[];
}

export const englishMaterials: Material[] = [
    {
        title: 'Adults Courses',
        children: [
            {
                title: 'Market Leader Series (Business English)',
                children: [
                    { title: 'Elementary' },
                    { title: 'Pre-Intermediate' },
                    { title: 'Intermediate' },
                    { title: 'Upper-Intermediate' },
                    { title: 'Advanced' },
                ],
            },
            {
                title: 'Life Series (General English)',
                children: [
                    { title: 'Beginner' },
                    { title: 'Elementary' },
                    { title: 'Pre-Intermediate' },
                    { title: 'Intermediate' },
                    { title: 'Upper-Intermediate' },
                    { title: 'Advanced' },
                ],
            },
            {
                title: 'Summer Course Materials',
                children: [
                    { title: 'Adults Summer Course (A1-C1 levels)' },
                    { title: 'Adults Life Club materials' },
                ],
            },
        ],
    },
    {
        title: 'Exam Preparation',
        children: [
            {
                title: 'Cambridge Exam Books',
                children: [
                    { title: 'Advanced Trainer' },
                    { title: 'B1 Preliminary 1' },
                    { title: 'B1 Preliminary for Schools Trainer' },
                    { title: 'CAE Practice Tests 1' },
                    { title: 'First for Schools 1' },
                    { title: 'First for Schools Trainer' },
                    { title: 'MiniMovers (A1)' },
                    { title: 'Starters 2 & 3' },
                ],
            },
        ],
    },
    {
        title: 'Main Course Series',
        children: [
            { title: 'Gold Experience (A1-C1)' },
            { title: 'Wider World (Levels 2 & 4)' },
            { title: 'English File (Beginner-Advanced)' },
            { title: 'Go Getter (Levels 1-4)' },
            { title: 'Super Minds (Starter-Level 3)' },
            { title: 'Prepare (Level 1)' },
            { title: 'Kids Box (Starter-Level 3)' },
            { title: 'Playway (Levels 1-3)' },
        ],
    },
    {
        title: 'Grammar & Vocabulary',
        children: [
            { title: 'Grammar in Use series' },
            { title: 'Vocabulary in Use series' },
            { title: 'Round-Up grammar (Starter-Level 6)' },
        ],
    },
    {
        title: 'Young Learners',
        children: [
            { title: 'Wonderland Junior A' },
            { title: 'Various supplementary materials' },
        ],
    },
];
