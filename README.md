# MuzoInTech - Professional Portfolio

A modern, high-performance personal portfolio website built with Next.js, React, and Firebase. This platform showcases technical expertise, professional projects, and educational milestones.

## Core Features

- **Dynamic CV Generation**: High-precision PDF generation engine for professional resumes.
- **IT Service Calculator**: Interactive tool for project cost estimation across web, software, and AI services.
- **Bilingual Support**: Real-time language translation capabilities (English/Russian) via Gemini Pro.
- **AI Career Portal**: Resume analysis flow that transforms PDF uploads into personalized landing pages.
- **Modern UI/UX**: Responsive design built with Tailwind CSS, Shadcn UI, and dynamic background themes.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Backend**: Firebase (Firestore, Storage, Authentication)
- **AI Integration**: Genkit (Google AI)
- **PDF Engine**: jsPDF

## Getting Started

1. Clone the repository.
2. Set up environment variables in a `.env` file:
   - `GOOGLE_GENAI_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `RESEND_API_KEY`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Architecture

```mermaid
graph TD
    User((User)) --> Router[Next.js App Router]
    
    subgraph "Frontend Pages"
        Router --> Home[Home Page /]
        Router --> Blog[Blog /blog]
        Router --> Calculator[Service Calculator /it-service-calculator]
        Router --> Portal[AI Career Portal /career-portal]
        Router --> Tutor[Tutor Page /tutor]
        Router --> Services[MIT Services /mit-services]
    end

    subgraph "Logic Engines"
        Home --> CVGen[CV Generation Engine]
        Calculator --> PriceLogic[Quotation Logic]
    end

    subgraph "AI & Backend"
        Router -.-> Genkit[Genkit AI Flows]
        Router -.-> Firebase[Firebase Services]
        
        Genkit --> Translate[Batch Translation]
        Genkit --> CareerGen[Resume Analysis]
        
        Firebase --> Firestore[Database]
        Firebase --> Storage[File Storage]
        Firebase --> Auth[Authentication]
    end
```

## License

© 2026 Musonda Salimu. All Rights Reserved.
