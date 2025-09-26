
export interface Material {
    title: string;
    children?: Material[];
}

export const englishMaterials: Material[] = [
    {
        title: 'Adults',
        children: [
            {
                title: 'Adults Life Club',
                children: [
                    { title: 'An Outstanding CV' },
                    { title: 'Making a good first impression' },
                ],
            },
            {
                title: 'Adults Summer Course',
                children: [
                    {
                        title: 'Block 1',
                        children: [
                            {
                                title: 'Medium A2+ and up',
                                children: [
                                    { title: '01 - Build Your Career' },
                                    { title: '02 - Cars and Transportation' },
                                    { title: '03 - Clothes and Fashion' },
                                    { title: '04 - Cooking and Recipes' },
                                    { title: '05 - Exploring Space' },
                                    { title: '06 - Job Interview Tips' },
                                    { title: '07 - Online Streaming and TV Shows' },
                                    { title: '08 - Relationships' },
                                    { title: '09 - Sports and Health' },
                                    { title: '10 - Talking About Animals' },
                                    { title: '11 - Talking About Art' },
                                    { title: '12 - Which English Are You' },
                                ],
                            },
                            {
                                title: 'Raw A1-A2',
                                children: [
                                    { title: '01 - Colors and Patterns' },
                                    { title: '02 - Shopping for Food' },
                                    { title: '03 - Talking About Weather' },
                                    { title: '04 - Developing Confidence' },
                                    { title: '05 - Expressing Feelings' },
                                    { title: '06 - Clothes Shopping' },
                                    { title: '07 - Renovations' },
                                    { title: '08 - Haircuts' },
                                    { title: '09 - Entertainment' },
                                    { title: '10 - Etiquette' },
                                    { title: '11 - Healthy Living' },
                                    { title: '12 - Taxi Rentals' },
                                ],
                            },
                        ],
                    },
                    {
                        title: 'Block 2',
                        children: [
                            {
                                title: 'Medium A2+ and up',
                                children: [
                                    { title: '01 - Gardens and Gardening' },
                                    { title: '02 - Storage at Home and Online' },
                                    { title: '03 - Everyday Tools and Technology' },
                                    { title: '04 - Around Town' },
                                    { title: '05 - Bikes and Motorcycles' },
                                    { title: '06 - Question Tags' },
                                    { title: '07 - Football and the Future' },
                                    { title: '08 - Minding the Future' },
                                    { title: '09 - Healthy Life' },
                                    { title: '10 - Cup of Tea' },
                                    { title: '11 - Street Talk' },
                                    { title: '12 - Veggies or Sweets' },
                                ],
                            },
                            {
                                title: 'Raw A1-A2',
                                children: [
                                    { title: '01 - English in the Classroom' },
                                    { title: '02 - Basics of Grammar' },
                                    { title: '03 - Reading Basics' },
                                    { title: '04 - Countries and Cities' },
                                    { title: '05 - Food and Drinks' },
                                    { title: '06 - Home Furnishings' },
                                    { title: '07 - Jobs and Companies' },
                                    { title: '08 - Describing People' },
                                    { title: '09 - Shops and Shopping' },
                                    { title: '10 - Banking' },
                                    { title: '11 - Playground' },
                                    { title: '12 - Technology' },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                title: 'VIP Adults',
                children: [
                    {
                        title: 'Business English',
                        children: [
                            { title: 'Market Leader Advanced' },
                            { title: 'Market Leader Elementary' },
                            { title: 'Market Leader Intermediate' },
                            { title: 'Market Leader Pre-Intermediate' },
                            { title: 'Market Leader Upper-Intermediate' },
                        ],
                    },
                    {
                        title: 'General English',
                        children: [
                            { title: 'Life 1 Beginner' },
                            { title: 'Life 2 Elementary' },
                            { title: 'Life 3 Pre-Intermediate' },
                            { title: 'Life 4 Intermediate' },
                            { title: 'Life 5 Upper-Intermediate' },
                            { title: 'Life 6 Advanced' },
                            { title: 'Survival English (Pre-Intermediate)' },
                        ],
                    },
                    {
                        title: 'Grammar and Vocabulary',
                        children: [
                            { title: 'Grammar in Use' },
                            {
                                title: 'Vocabulary in Use',
                                children: [
                                    { title: 'Business Vocabulary' },
                                    { title: 'Collocations in Use' },
                                    { title: 'English Vocabulary in Use' },
                                    { title: 'Idioms in Use' },
                                    { title: 'Phrasal Verbs in Use' },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        title: 'Cambridge Exam Preparations',
        children: [
            { title: 'Advanced Trainer' },
            { title: 'B1 Preliminary 1' },
            { title: 'B1 Preliminary for Schools Trainer' },
            { title: 'CAE Practice Tests 1' },
            { title: 'First for Schools 1' },
            { title: 'First for Schools Trainer' },
            {
                title: 'MiniMovers',
                children: [{ title: 'A1 Mini Movers' }],
            },
            {
                title: 'Starters2',
                children: [{ title: 'Starters 2' }],
            },
            {
                title: 'Starters3',
                children: [{ title: 'Starters 3' }],
            },
        ],
    },
    {
        title: 'Gold Experience Series',
        children: [
            { title: 'Gold Experience A1' },
            { title: 'Gold Experience A2' },
            { title: 'Gold Experience A2+' },
            { title: 'Gold Experience B1' },
            { title: 'Gold Experience B1+' },
            { title: 'Gold Experience B2' },
            { title: 'Gold Experience B2+' },
            { title: 'Gold Experience C1' },
        ],
    },
    { title: 'Lesson Plans (B2+)' },
    {
        title: 'Wider World Series',
        children: [
            { title: 'Wider World ActiveTeach' },
            { title: 'Wider World 2 ActiveTeach' },
            { title: 'Wider World 3 ActiveTeach' },
            { title: 'Wider World 4 ActiveTeach' },
        ],
    },
];
