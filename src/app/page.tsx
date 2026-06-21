'use client';

import Image from 'next/image';
import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { SocialIcons } from '@/components/social-icons';
import { 
    ArrowRight, BrainCircuit, Check, Code, Database, Download, Eye, ExternalLink, 
    Github, Globe, GraduationCap, Loader2, Network, Phone, Server, Shield, 
    Smartphone, Terminal, UserCog, ChevronDown, Calculator, Gamepad, Film, 
    Edit, BookOpen, HeartHandshake, Zap, FileText, Mail, Stars, Search, 
    HardDrive, BarChart3, MousePointer2, Flame, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { jsPDF } from 'jspdf';
import { useState } from 'react';
import { storage, db } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/types';

// --- Types ---
interface CvExperience {
    title: string;
    company: string;
    location?: string;
    duration: string;
    details: string[];
}

interface CvEducation {
    degree: string;
    university: string;
    duration: string;
    note?: string;
}

interface CvReference {
    name: string;
    title: string;
    company: string;
    email: string | null;
    phone: string;
}

interface CvSkillCategory {
    label: string;
    value: string;
}

interface CvData {
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
    certifications: string[];
    diplomas: string[];
    references: CvReference[];
}

// --- Data Constants ---
const skills = [
    // Core Dev
    { name: 'Javascript', icon: <Code className="h-6 w-6" />, category: 'dev' },
    { name: 'TypeScript', icon: <Code className="h-6 w-6" />, category: 'dev' },
    { name: 'React', icon: <Globe className="h-6 w-6" />, category: 'dev' },
    { name: 'Next.js', icon: <Globe className="h-6 w-6" />, category: 'dev' },
    { name: 'Node.js/Express', icon: <Server className="h-6 w-6" />, category: 'dev' },
    { name: 'Django', icon: <Server className="h-6 w-6" />, category: 'dev' },
    { name: 'C++', icon: <Terminal className="h-6 w-6" />, category: 'dev' },
    { name: 'Flutter', icon: <Smartphone className="h-6 w-6" />, category: 'dev' },
    
    // AI & Data
    { name: 'AI & Automation', icon: <BrainCircuit className="h-6 w-6" />, category: 'ai' },
    { name: 'AI SDK (Vercel)', icon: <Zap className="h-6 w-6" />, category: 'ai' },
    { name: 'Firebase Studio', icon: <Flame className="h-6 w-6" />, category: 'ai' },
    { name: 'Google AI Studio', icon: <Stars className="h-6 w-6" />, category: 'ai' },
    { name: 'RAG (basic)', icon: <Search className="h-6 w-6" />, category: 'ai' },
    { name: 'Data Analysis (Python & SQL)', icon: <BarChart3 className="h-6 w-6" />, category: 'ai' },
    { name: 'Tableau (Foundational)', icon: <BarChart3 className="h-6 w-6" />, category: 'ai' },

    // Infrastructure & Tools
    { name: 'Networking', icon: <Network className="h-6 w-6" />, category: 'infra' },
    { name: 'System Admin', icon: <HardDrive className="h-6 w-6" />, category: 'infra' },
    { name: 'Cybersecurity (basic)', icon: <Shield className="h-6 w-6" />, category: 'infra' },
    { name: 'Databases (PostgreSQL, Supabase, MongoDB, Firebase)', icon: <Database className="h-6 w-6" />, category: 'infra' },
    { name: 'Cursor 2.0', icon: <MousePointer2 className="h-6 w-6" />, category: 'infra' },
];

const projects = [
  {
    title: 'ai-chatBot using AI SDK by Vercel',
    link: 'https://github.com/MS0C54073/ai-chatBot_muzoGPT',
    category: 'AI/ML'
  },
  {
    title: 'Salem Tailors — Digital Shop Management System',
    link: 'https://github.com/MS0C54073/salemtailors',
    demo: 'https://salemtailors.vercel.app/',
  },
  {
    title: 'Machine Learning Disease Predictor',
    link: 'https://github.com/MS0C54073/MLDiseasepredictor',
    category: 'AI/ML'
  },
  {
    title: 'Spiking Neural Network (SNN) with PyTorch',
    link: 'https://github.com/MS0C54073/Spiking-Neural-Network-SNN-with-PyTorch',
    category: 'AI/ML'
  },
  {
    title: 'AI CV Generator & Resume Parser',
    link: 'https://github.com/MS0C54073/Cv_Generator/tree/master/resume',
    category: 'AI/ML'
  },
  {
    title: 'Detecting Fake News with Python',
    link: 'https://github.com/MS0C54073/Detecting-Fake-News',
    category: 'AI/ML'
  },
  {
    title: 'Spotify Recommendation Model (ML)',
    link: 'https://github.com/MS0C54073/Spotify-Recommendation-model',
    category: 'AI/ML'
  },
  {
    title: 'Personal/Portfolio Website',
    link: 'https://github.com/MS0C54073/muzoprof',
    demo: 'https://tinyurl.com/muzoslim',
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

const professionalExperiences = [
    {
        title: "AI Content Evaluation Specialist",
        company: "Invisible Technologies & Outlier",
        duration: "Aug 2024 – Sep 2025",
        details: [
            "Evaluated AI-generated content across code, text, images, and video",
            "Solved complex coding problems ensuring efficiency and reliability",
            "Developed test cases and verification methodologies to validate output quality",
            "Provided actionable feedback to optimise AI content generation processes"
        ]
    },
    {
        title: "IT Support Volunteer & Technical Assistant",
        company: "Embassy of the Republic of Zambia, Moscow",
        duration: "May 2025 – Jul 2025",
        details: [
            "Maintained and managed critical embassy IT infrastructure systems",
            "Provided proactive technical support ensuring seamless digital operations"
        ]
    },
    {
        title: "IT Support Freelancer",
        company: "Self-Employed",
        duration: "2017 – Present",
        details: [
            "Deliver remote and on-site technical assistance to individuals and businesses",
            "Resolve hardware, software, and network issues across multiple channels",
            "Document comprehensive solutions and maintain detailed client records"
        ]
    },
    {
        title: "AI Training Methods Researcher",
        company: "Novosibirsk State Technical University",
        duration: "2022 – 2024",
        details: [
          "Tested and evaluated novel training algorithms for Spiking Neural Networks (SNNs)",
          "Conducted experiments analysing performance of various SNN training methodologies",
          "Managed and preprocessed large-scale datasets for neural network models"
        ]
    },
    {
        title: "System Administrator Intern",
        company: "Pensions and Insurance Authority, Zambia",
        duration: "May 2022 – Oct 2022",
        details: [
            "Maintained, secured, and optimised IT infrastructure and organisational websites",
            "Monitored system performance and resolved technical issues promptly",
            "Provided ICT support and user training, enhancing overall technical efficiency"
        ]
    },
    {
        title: "Software Development Trainee",
        company: "Kursk State University, Russia",
        duration: "May 2019 – Jul 2021",
        details: [
            "Built, tested, and optimised applications using C++, Python, and C#",
            "Applied automated debugging and performance optimisation techniques",
            "Collaborated with senior developers in real-world software environments"
        ]
    },
    {
        title: "Customer Care Associate",
        company: "Tech Mahindra (Airtel Zambia PLC)",
        duration: "Aug 2015 – Oct 2016",
        details: [
            "Ensured customer satisfaction through consistent service excellence",
            "Managed customer relationship building and service retention initiatives",
            "Promoted brand value through service delivery aligned to customer needs"
        ]
    },
];

const communityInvolvement = [
    {
        title: "City Representative & Student Welfare Volunteer",
        company: "Zambian Student Community, Russia",
        duration: "2017 – 2025",
        details: [
            "Served as city representative for Zambian scholarship students studying across Russia",
            "Assisted newly arrived scholarship students with orientation, settlement, and integration",
            "Coordinated and maintained records of outgoing students, ensuring smooth transitions",
            "Provided ongoing pastoral support and guidance to the wider student community"
        ]
    },
    {
        title: "Volunteer Teacher — Special Needs & TEFL Summer Camps",
        company: "University Volunteer Programme, Russia",
        duration: "2019 – 2023",
        details: [
            "Taught at university-organised summer camps for children with special needs and able-bodied children",
            "Delivered TEFL (Teaching English as a Foreign Language) lessons and extracurricular activities",
            "Designed inclusive, engaging learning experiences catering to diverse abilities and learner needs"
        ]
    },
];

const educationData = [
    {
        degree: "Associate of Science, Information Science and Computer Engineering",
        university: "Novosibirsk State Technical University",
        duration: "Sep 2022 - Jul 2024",
        note: "Awaiting Official Translation and Legalization",
    },
    {
        degree: "BSc Software and Information Systems Administration",
        university: "Kursk State University, Russia",
        duration: "2017 – 2021",
    },
    {
        degree: "Russian Language & Preparatory Programme",
        university: "Belgorod State University",
        duration: "2016 – 2017",
    },
    {
        degree: "General Certificate in Education (O-Levels)",
        university: "Arakan Boys Secondary School",
        duration: "2011 – 2013",
    },
];

const postgraduateDiplomasData = [
    {
        title: "Management in the Digital Economy",
        institution: "Novosibirsk State Technical University",
        year: "2023",
    },
    {
        title: "Technological Entrepreneurship and Innovation Management",
        institution: "Novosibirsk State Technical University",
        year: "2023",
    },
    {
        title: "Management of High Tech Programmes and Projects",
        institution: "Pskov State University",
        year: "2023",
    },
    {
        title: "Development of Digital Twins: Machine Learning with Orange Data Mining",
        institution: "Novosibirsk State Technical University",
        year: "2023",
    },
];

const references = [
    {
        name: "Innocent Mukupa",
        title: "ICT Manager",
        company: "Pensions & Insurance Authority",
        email: "mungolemukupa@gmail.com",
        phone: "+260 964 748 111"
    },
    {
        name: "Mwansa Kapoka",
        title: "Team Leader",
        company: "TechMahindra Limited Zambia",
        email: "mwansa.kapoka@sc.com",
        phone: "+260 978 980 443"
    },
    {
        name: "Ann Chibinga",
        title: "Team Leader",
        company: "VITALITE Zambia",
        email: "ann.chibinga@vitalitegroup.com",
        phone: "(+260) 777407124"
    },
    {
        name: "Prof. Aaron B. Zyambo",
        title: "CEO & Lead Consultant",
        company: "Mega Vision Logistics Int'l Ltd",
        email: "abzyambo@yahoo.com",
        phone: "+260 979 793 999"
    },
    {
        name: "Allan Mwimbu",
        title: "First Secretary Political (Admin Supervisor)",
        company: "Embassy of Zambia, Moscow",
        email: null,
        phone: "+7 985 515 9011"
    },
];

const orderSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  phone: z.string().min(10, { message: 'A valid phone number is required' }),
  details: z.string().min(10, { message: 'Please provide some details about your project.' }),
  attachment: z.any().optional(), 
});
type OrderFormData = z.infer<typeof orderSchema>;


export default function Home() {
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();
    const [orderStatus, setOrderStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [showAllProjects, setShowAllProjects] = useState(false);
    const [showAllCerts, setShowAllCerts] = useState(false);
    const [showAllExperience, setShowAllExperience] = useState(false);
    const [openAccordionItems, setOpenAccordionItems] = useState<string[]>([]);
    const [showAllEducation, setShowAllEducation] = useState(false);
    
    // --- State for CV Data (Editable) ---
    const [cvData, setCvData] = useState<CvData>({
        name: "MUSONDA SALIMU",
        jobTitle: "IT Support | Software Developer | AI | Tutor",
        email: "musondasalim@gmail.com",
        phones: ["+260 966 882 901", "+260 979 287 496", "+260 977 288 260"],
        location: "Lusaka, Zambia",
        linkedin: "linkedin.com/in/musonda-salimu",
        github: "github.com/MS0C54073",
        portfolio: "tinyurl.com/muzoslim",
        summary: "I'm a tech explorer delving into system architecture, Kubernetes, and AI. I enjoy experimenting with LLM integrations and automation using n8n and Supabase, constantly learning and looking for practical ways to build better software solutions.",
        skillCategories: [
            { label: "Languages", value: "Python, JavaScript, TypeScript, C++, C#, SQL" },
            { label: "Frameworks", value: "React, Next.js, Node.js/Express, Django, .NET" },
            { label: "Mobile & Web", value: "Flutter, React Native" },
            { label: "Databases", value: "PostgreSQL (Supabase), MongoDB, Firebase" },
            { label: "AI & Automation", value: "Genkit, Firebase Studio, Claude Code, n8n, Gemini API, Orange Data Mining, RAG" },
            { label: "Cloud & DevOps", value: "Docker, Kubernetes, Git, CI/CD" },
            { label: "Cybersecurity", value: "Network Security, SIEM, IDS, Compliance (Basic)" },
            { label: "Tools", value: "Cursor 2.0, Tableau, Microsoft 365/Office" },
        ],
        experience: professionalExperiences,
        community: communityInvolvement,
        education: educationData,
        certifications: [
            "ZRA Tax Compliance & Smart Invoicing Certifications — https://online.atingi.org/admin/tool/certificate/index.php?code=6893547292MS",
            "Zambia Revenue Authority: Smart Invoice & Indirect Taxes — https://online.atingi.org/admin/tool/certificate/index.php?code=1233986026MS",
            "CompTIA Cybersecurity Analyst (CySA+) CS0-003 (Specialization) - Pearson Education — https://coursera.org/verify/specialization/BEVC4O7ECJ16",
            "Enterprise Data Integration, Governance and Architecture (Specialization)",
            "AI Agents and Agentic AI in Python: Powered by Generative AI — Vanderbilt University (Specialisation)",
            "Prompt Engineering for ChatGPT — Vanderbilt University",
            "Developing Front-End Apps with React — IBM / Coursera",
            "Business School's Globalization – Economic Growth and Stability — IE University / Coursera",
            "Google Cybersecurity Professional Certificate — Google",
            "Key Technologies for Business — IBM (Specialisation)",
            "IT Fundamentals for Cybersecurity — IBM (Specialisation)",
            "Introduction to Cybersecurity — Smart Zambia Institute / Cisco",
            "C++ (Basic) Certificate — https://www.hackerrank.com/certificates/dea4f08fe541",
            "Python (Basic) Certificate — https://www.hackerrank.com/certificates/6e56080d33f3"
        ],
        diplomas: [
            "Management in the Digital Economy — Novosibirsk State Technical University",
            "Technological Entrepreneurship and Innovation Management — Novosibirsk State Technical University",
            "Management of High Tech Programmes and Projects — Pskov State University",
            "Development of Digital Twins: Machine Learning with Orange Data Mining — Novosibirsk State Technical University"
        ],
        references: references
    });

    const initialProjectsToShow = 4;
    const initialCertsToShow = 4;
    const initialExperienceToShow = 4;
    const initialEducationToShow = 4;


    const { register, handleSubmit, reset, formState: { errors } } = useForm<OrderFormData>({
      resolver: zodResolver(orderSchema),
      defaultValues: {
        name: '',
        email: '',
        phone: '',
        details: '',
        attachment: null,
      }
    });

    const onOrderSubmit: SubmitHandler<OrderFormData> = async (data) => {
        setOrderStatus('submitting');
        try {
            const file = data.attachment?.[0];
            let attachmentUrl: string | null = null;
            let attachmentName: string | null = null;
            
            if (file) {
                attachmentName = file.name;
                const storageRef = ref(storage, `orders/${Date.now()}_${attachmentName}`);
                await uploadBytes(storageRef, file);
                attachmentUrl = await getDownloadURL(storageRef);
            }
            
            const orderPayload: Omit<Order, 'id'> = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                details: data.details,
                status: 'pending',
                attachmentName,
                attachmentUrl,
                timestamp: serverTimestamp(),
                userId: null,
            };
            await addDoc(collection(db, 'orders'), orderPayload);

            const emailPayload = {
                ...data,
                details: data.details,
                attachmentName,
                attachmentUrl,
            };
            const response = await fetch('/api/process-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailPayload),
            });
            const result = await response.json();

            if (!result.success) {
                toast({
                    variant: 'default',
                    title: 'Request Submitted (Email Failed)',
                    description: "Your request was saved, but the email notification could not be sent. I will still get back to you!"
                });
            } else {
                toast({
                    variant: 'success',
                    title: 'Request Submitted!',
                    description: `Thank you for your interest. I will get back to you shortly.`
                });
            }
            
            setOrderStatus('success');
            reset();

        } catch (error) {
          console.error("Error submitting order: ", error);
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
          toast({ 
            variant: 'destructive', 
            title: 'Submission Failed', 
            description: errorMessage
          });
          setOrderStatus('error');
        } finally {
            setTimeout(() => setOrderStatus('idle'), 4000);
        }
    };


    const generateCv = (outputType: 'preview' | 'download') => {
        setIsGenerating(true);

        try {
            const doc = new jsPDF({ unit: 'pt', format: 'a4' });
            
            // --- CONSTANTS & METRICS ---
            const PAGE_W = doc.internal.pageSize.getWidth();
            const PAGE_H = doc.internal.pageSize.getHeight();
            const MARGIN = 46; 
            const CONTENT_W = PAGE_W - (MARGIN * 2);
            
            const COLORS = {
                ACCENT: [31, 78, 121] as [number, number, number], // #1F4E79 (Deep Navy)
                LIGHT: [46, 117, 182] as [number, number, number],  // #2E75B6 (Medium Blue)
                GRAY: [85, 85, 85] as [number, number, number],
                BLACK: [17, 17, 17] as [number, number, number],
                BLUE_LINE: [46, 117, 182] as [number, number, number] // #2E75B6
            };

            let currentY = MARGIN;

            const addSectionHeader = (title: string) => {
                currentY += 22;
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(11);
                doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
                doc.text(title.toUpperCase(), MARGIN, currentY);
                
                currentY += 4;
                doc.setDrawColor(COLORS.BLUE_LINE[0], COLORS.BLUE_LINE[1], COLORS.BLUE_LINE[2]);
                doc.setLineWidth(1);
                doc.line(MARGIN, currentY, PAGE_W - MARGIN, currentY);
                currentY += 16;
            };

            const addJobTitleLine = (title: string, org: string, dates: string) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(10);
                doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
                doc.text(title, MARGIN, currentY);
                
                const titleWidth = doc.getTextWidth(title);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
                doc.text(`  |  ${org}`, MARGIN + titleWidth + 5, currentY);
                
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(9);
                doc.text(dates, PAGE_W - MARGIN, currentY, { align: 'right' });
                currentY += 12;
            };

            const addBullet = (text: string) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
                
                const lines = doc.splitTextToSize(text, CONTENT_W - 25);
                doc.text("•", MARGIN + 8, currentY);
                doc.text(lines, MARGIN + 18, currentY);
                currentY += (lines.length * 9.5 * 1.2) + 2;
            };

            const addPara = (text: string) => {
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(9.5);
                doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
                const lines = doc.splitTextToSize(text, CONTENT_W);
                doc.text(lines, MARGIN, currentY);
                currentY += (lines.length * 9.5 * 1.2) + 4;
            };

            const addSkillRow = (label: string, value: string) => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9.5);
                doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
                doc.text(`${label}:`, MARGIN, currentY);
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
                const lines = doc.splitTextToSize(value, CONTENT_W - 100);
                doc.text(lines, MARGIN + 100, currentY);
                currentY += (lines.length * 9.5 * 1.2) + 2;
            };

            // ─── PAGE 1 ───────────────────────────────────────────────────
            currentY = MARGIN + 15;
            
            // Header
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(23); 
            doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
            doc.text(cvData.name.toUpperCase(), PAGE_W/2, currentY, { align: 'center' });
            currentY += 18;

            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10.5);
            doc.setTextColor(COLORS.LIGHT[0], COLORS.LIGHT[1], COLORS.LIGHT[2]);
            doc.text(cvData.jobTitle, PAGE_W/2, currentY, { align: 'center' });
            currentY += 15;

            doc.setFontSize(9);
            doc.setTextColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
            const contact1 = `${cvData.email}   |   ${cvData.phones.join("  /  ")}`;
            doc.text(contact1, PAGE_W/2, currentY, { align: 'center' });
            currentY += 12;

            const contact2 = `${cvData.github}   |   ${cvData.portfolio}   |   ${cvData.linkedin}`;
            doc.text(contact2, PAGE_W/2, currentY, { align: 'center' });
            currentY += 15;

            // Summary
            addSectionHeader("Professional Summary");
            addPara(cvData.summary);

            // Competencies
            addSectionHeader("Core Competencies");
            cvData.skillCategories.forEach(cat => addSkillRow(cat.label, cat.value));

            // Experience
            addSectionHeader("Professional Experience");
            cvData.experience.forEach(exp => {
                addJobTitleLine(exp.title, exp.company, exp.duration);
                exp.details.forEach(d => addBullet(d));
                currentY += 4;
            });

            // ─── PAGE 2 ───────────────────────────────────────────────────
            doc.addPage();
            currentY = MARGIN;

            addSectionHeader("Community Involvement & Volunteering");
            cvData.community.forEach(vol => {
                addJobTitleLine(vol.title, vol.company, vol.duration);
                vol.details.forEach(d => addBullet(d));
                currentY += 4;
            });

            addSectionHeader("Education");
            cvData.education.forEach(edu => {
                addJobTitleLine(edu.degree, edu.university, edu.duration);
                if (edu.note) {
                    doc.setFont('helvetica', 'italic');
                    doc.setFontSize(8.5);
                    doc.setTextColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
                    doc.text(edu.note, MARGIN + 10, currentY);
                    currentY += 10;
                }
                currentY += 4;
            });

            addSectionHeader("Licences & Certifications");
            cvData.certifications.forEach(cert => addBullet(cert));
            
            currentY += 15;
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(COLORS.ACCENT[0], COLORS.ACCENT[1], COLORS.ACCENT[2]);
            doc.text("Postgraduate Diplomas (2023):", MARGIN, currentY);
            currentY += 14;
            cvData.diplomas.forEach(diploma => addBullet(diploma));

            // ─── PAGE 3 ───────────────────────────────────────────────────
            doc.addPage();
            currentY = MARGIN;
            addSectionHeader("Professional References");
            cvData.references.forEach(ref => {
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(9.5);
                doc.setTextColor(COLORS.BLACK[0], COLORS.BLACK[1], COLORS.BLACK[2]);
                doc.text(ref.name, MARGIN, currentY);
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(COLORS.GRAY[0], COLORS.GRAY[1], COLORS.GRAY[2]);
                const nameWidth = doc.getTextWidth(ref.name);
                doc.text(`  —  ${ref.title}, ${ref.company}`, MARGIN + nameWidth + 5, currentY);
                currentY += 12;
                
                const contact = [ref.email, ref.phone].filter(Boolean).join("  |  ");
                doc.text(contact, MARGIN, currentY);
                currentY += 20;
            });

            if (outputType === 'preview') {
                doc.output('dataurlnewwindow');
            } else {
                doc.save(`${cvData.name.replace(/\s+/g, '_')}_CV.pdf`);
            }
        } catch (error) {
            console.error("CV generation failed:", error);
            toast({
                variant: 'destructive',
                title: 'Export Failed',
                description: 'An unexpected error occurred during PDF generation.',
            });
        } finally {
            setIsGenerating(false);
        }
    };
    

  return (
      <div className="container mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-12">
        {/* Hero Section */}
        <section id="home" className="py-6 md:py-10 text-center flex flex-col items-center">
          <div className="relative w-72 h-72 md:w-[26rem] md:h-[26rem] mb-8 group">
              <Image
                src="https://drive.google.com/uc?id=18haKNolQwC6XQxH3weaKMkvFEV_rBYc6"
                alt="Musonda Salimu Profile"
                fill
                data-ai-hint="profile picture"
                className="rounded-full shadow-2xl border-4 border-primary object-cover transition-transform duration-500 group-hover:scale-105"
                priority
                id="profile-pic"
                crossOrigin="anonymous"
              />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight">
            <TranslatedText text="Musonda Salimu" />
          </h1>
          
          {/* Enhanced Roles Design */}
          <div className="text-lg md:text-2xl text-muted-foreground mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 max-w-3xl px-4 font-medium tracking-tight">
            <span className="hover:text-primary transition-colors cursor-default whitespace-nowrap"><TranslatedText text="IT Support" /></span>
            <span className="text-primary/30 select-none hidden sm:inline">|</span>
            <span className="hover:text-primary transition-colors cursor-default whitespace-nowrap"><TranslatedText text="Software Developer" /></span>
            <span className="text-primary/30 select-none hidden sm:inline">|</span>
            <span className="hover:text-primary transition-colors cursor-default whitespace-nowrap"><TranslatedText text="AI" /></span>
            <span className="text-primary/30 select-none hidden sm:inline">|</span>
            <Button variant="link" asChild className="text-lg md:text-2xl p-0 h-auto font-bold text-accent hover:text-primary transition-all underline-offset-8">
                <Link href="/tutor"><TranslatedText text="Tutor" /></Link>
            </Button>
          </div>
          
          {/* Redesigned Hero Buttons */}
          <div className="mt-8 flex flex-col items-center gap-6 w-full max-w-4xl px-4">
              <div className="flex flex-wrap justify-center gap-4 w-full">
                  <Button asChild size="lg" className="h-14 px-10 rounded-full shadow-xl hover:scale-105 transition-all bg-primary text-primary-foreground font-black text-lg flex-1 sm:flex-none min-w-[200px]">
                      <a href="#contact">
                          <Mail className="mr-2 h-5 w-5" />
                          <TranslatedText text="Get in Touch" />
                      </a>
                  </Button>
                  <Button onClick={() => generateCv('download')} size="lg" disabled={isGenerating} className="h-14 px-10 rounded-full shadow-xl hover:scale-105 transition-all border-2 border-primary bg-transparent text-primary hover:bg-primary/5 font-black text-lg flex-1 sm:flex-none min-w-[200px]">
                      {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                      <TranslatedText text="Download CV" />
                  </Button>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-3">
                  <Button asChild variant="outline" className="h-12 px-6 rounded-full border-accent text-accent hover:bg-accent hover:text-white font-bold transition-all shadow-sm group">
                      <Link href="/cover-letter-generator">
                          <Sparkles className="mr-2 h-4 w-4 text-accent group-hover:text-white transition-colors" />
                          <TranslatedText text="AI Cover Letter" />
                      </Link>
                  </Button>
                  <Button asChild variant="ghost" className="h-12 px-6 rounded-full text-muted-foreground hover:text-primary font-bold transition-all border border-transparent hover:border-border">
                      <Link href="/it-service-calculator">
                          <Calculator className="mr-2 h-4 w-4" />
                          <TranslatedText text="Service Cost" />
                      </Link>
                  </Button>
                  <div className="w-px h-6 bg-border hidden sm:block mx-2" />
                  <Button onClick={() => generateCv('preview')} variant="link" size="sm" disabled={isGenerating} className="h-12 px-4 text-muted-foreground hover:text-primary font-bold decoration-primary underline-offset-4 flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      <TranslatedText text="Preview" />
                  </Button>
              </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-6 md:py-8 border-t px-4 md:px-0">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-4 text-primary tracking-tight"><TranslatedText text="About Me"/></h2>
            <div className="max-w-4xl mx-auto">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                    <TranslatedText text="I'm a tech explorer delving into system architecture, Kubernetes, and AI. I enjoy experimenting with LLM integrations and automation using n8n and Supabase, constantly learning and looking for practical ways to build better software solutions."/>
                </p>
            </div>
        </section>

        {/* Hobbies & Interests Section */}
        <section id="hobbies" className="py-6 md:py-8 border-t px-4 md:px-0 bg-muted/20">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-6 text-primary tracking-tight"><TranslatedText text="Hobbies & Interests"/></h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <Gamepad className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg"><TranslatedText text="Gaming"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="I enjoy immersive single-player adventures and competitive multiplayer games."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <Film className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg"><TranslatedText text="Documentaries"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="Exploring real-world stories and learning about history, science, and culture."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                  <CardHeader className="text-center pb-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <BrainCircuit className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg"><TranslatedText text="AI Research"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="Staying up-to-date with the latest advancements and tools in artificial intelligence."/></p>
                  </CardContent>
              </Card>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="py-8 md:py-12 border-t bg-muted/30 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-2xl md:text-4xl font-black text-center mb-10 text-primary tracking-tight">
            <TranslatedText text="Technical Specialist Stack" />
          </h2>
          
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Skill Group: Core Development */}
            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 border-l-4 border-primary pl-4">
                    <TranslatedText text="Core Development" />
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {skills.filter(s => s.category === 'dev').map(skill => (
                        <Card key={skill.name} className="group border-none bg-background/50 hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                <div className="text-primary group-hover:text-white transition-colors">
                                    {skill.icon}
                                </div>
                                <span className="text-[10px] md:text-xs font-bold group-hover:text-white transition-colors">
                                    <TranslatedText text={skill.name} />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Skill Group: AI & Machine Learning */}
            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-accent/60 border-l-4 border-accent pl-4">
                    <TranslatedText text="AI & Machine Learning" />
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                    {skills.filter(s => s.category === 'ai').map(skill => (
                        <Card key={skill.name} className="group border-none bg-background/50 hover:bg-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                            <CardContent className="p-4 flex flex-col items-center text-center gap-3">
                                <div className="text-accent group-hover:text-white transition-colors">
                                    {skill.icon}
                                </div>
                                <span className="text-[10px] md:text-xs font-bold group-hover:text-white transition-colors">
                                    <TranslatedText text={skill.name} />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Skill Group: Infrastructure & Specialist Tools */}
            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 border-l-4 border-primary/40 pl-4">
                    <TranslatedText text="Infrastructure & Engineering" />
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.filter(s => s.category === 'infra').map(skill => (
                        <Card key={skill.name} className="group border-none bg-background/50 hover:bg-primary transition-all duration-300 shadow-sm hover:shadow-xl">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className="text-primary group-hover:text-white transition-colors shrink-0">
                                    {skill.icon}
                                </div>
                                <span className="text-xs font-bold group-hover:text-white transition-colors leading-tight">
                                    <TranslatedText text={skill.name} />
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-6 md:py-8 border-t px-4 md:px-0">
          <div className="text-center mb-6">
              <Button asChild size="lg" className="text-xl md:text-3xl font-black h-auto py-3 px-6 rounded-full shadow-xl">
                  <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer">
                      <TranslatedText text="Projects" />
                      <ArrowRight className="ml-2 h-6 w-6 md:h-8 md:w-8" />
                  </a>
              </Button>
          </div>

          <div className="max-w-5xl mx-auto mb-10">
            <h3 className="text-lg md:text-2xl font-extrabold text-primary mb-6 flex items-center justify-center gap-3 border-b-2 border-primary/10 pb-2">
                <BrainCircuit className="h-6 w-6" />
                <TranslatedText text="AI & Machine Learning" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {projects.filter(p => p.category === 'AI/ML').map((project, index) => (
                    <a 
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="bg-card/50 hover:bg-accent/5 border-primary/5 hover:border-primary transition-all duration-300 h-full shadow-sm hover:shadow-lg">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-accent group-hover:text-primary transition-colors text-base md:text-lg font-bold leading-tight">
                              <TranslatedText text={project.title} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" size="sm" className="w-full bg-background group-hover:bg-primary group-hover:text-white transition-colors">
                                <Github className="mr-2 h-4 w-4" />
                                <TranslatedText text="View on GitHub" />
                            </Button>
                        </CardContent>
                      </Card>
                    </a>
                ))}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <h3 className="text-lg md:text-2xl font-extrabold text-primary mb-6 flex items-center justify-center gap-3 border-b-2 border-primary/10 pb-2">
                <Code className="h-6 w-6" />
                <TranslatedText text="Web & Software Development" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {(showAllProjects ? projects.filter(p => !p.category) : projects.filter(p => !p.category).slice(0, initialProjectsToShow)).map((project, index) => {
                if ((project as any).demo) {
                  return (
                    <Card key={index} className="bg-card/50 hover:bg-accent/5 border-primary/5 hover:border-primary transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-base md:text-lg font-bold leading-tight">
                          <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                        <div className="mt-2 flex w-full gap-2">
                            <Button asChild variant="outline" size="sm" className="flex-grow bg-background">
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" />
                                  <TranslatedText text="GitHub" />
                                </a>
                            </Button>
                            <Button asChild variant="default" size="sm" className="flex-grow shadow-md">
                                <a href={(project as any).demo} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    <TranslatedText text="Demo" />
                                </a>
                            </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                }
                return (
                  <a 
                    key={index}
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <Card className="bg-card/50 hover:bg-accent/5 border-primary/5 hover:border-primary transition-all duration-300 h-full shadow-sm hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-base md:text-lg font-bold leading-tight">
                            <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Button variant="outline" size="sm" className="w-full bg-background group-hover:bg-primary group-hover:text-white transition-colors">
                              <Github className="mr-2 h-4 w-4" />
                              <TranslatedText text="View on GitHub" />
                          </Button>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
            {!showAllProjects && projects.filter(p => !p.category).length > initialProjectsToShow && (
                <div className="text-center mt-8">
                    <Button variant="secondary" size="md" onClick={() => setShowAllProjects(true)} className="rounded-full px-8 shadow-sm">
                        <TranslatedText text="View All Projects" />
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-10 px-4 md:px-0">
            <Alert variant="accent" className="rounded-2xl border-2 py-4">
              <Terminal className="h-5 w-5" />
              <AlertTitle className="text-md font-bold"><TranslatedText text="Explore My Full Portfolio" /></AlertTitle>
              <AlertDescription className="text-xs md:text-sm mt-1">
                <TranslatedText text="For a deeper dive into my work, including more projects and code samples, please " />
                <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer" className="font-bold text-accent underline underline-offset-4 decoration-2">
                  <TranslatedText text="visit my GitHub profile" />
                </a>.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-6 md:py-8 border-t px-4 md:px-0">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-6 text-primary tracking-tight"><TranslatedText text="Work Experience" /></h2>
          <div className="max-w-4xl mx-auto">
            <Accordion 
              type="multiple"
              className="w-full space-y-3"
              value={openAccordionItems}
              onValueChange={setOpenAccordionItems}
            >
              {(showAllExperience ? professionalExperiences : professionalExperiences.slice(0, initialExperienceToShow)).map((exp, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border rounded-2xl px-4 md:px-6 bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="text-left">
                      <h3 className="text-base md:text-lg font-black text-accent tracking-tight"><TranslatedText text={exp.title}/></h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                          <p className="font-bold text-foreground text-xs md:text-sm"><TranslatedText text={exp.company}/></p>
                          <span className="hidden sm:inline text-muted-foreground text-xs">•</span>
                          <p className="text-[10px] md:text-xs text-muted-foreground font-medium uppercase tracking-wider"><TranslatedText text={exp.duration}/></p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-2 pl-4 border-l-2 border-primary/20 ml-1">
                      {exp.details.map((d, i) => (
                          <li key={i} className="text-muted-foreground text-xs md:text-sm flex items-start">
                              <span className="text-primary mr-2 mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                              <TranslatedText text={d}/>
                          </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {!showAllExperience && professionalExperiences.length > initialExperienceToShow && (
                <div className="text-center mt-8">
                    <Button 
                        variant="secondary" 
                        size="md"
                        className="rounded-full px-8 shadow-sm"
                        onClick={() => {
                            setShowAllExperience(true);
                            setOpenAccordionItems(professionalExperiences.map((_, index) => `item-${index}`));
                        }}
                    >
                        <TranslatedText text="View All Experience" />
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>
        </section>

        {/* Community Involvement Section */}
        <section id="community" className="py-6 md:py-8 border-t bg-muted/30 px-4 md:px-0">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-6 flex items-center justify-center gap-3 text-primary tracking-tight">
              <HeartHandshake className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <TranslatedText text="Community Involvement & Volunteering" />
          </h2>
          <div className="max-w-4xl mx-auto space-y-4">
                {communityInvolvement.map((item, index) => (
                    <Card key={index} className="bg-card/50 border-primary/10 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                <div className="space-y-1">
                                    <CardTitle className="text-base md:text-lg text-accent font-black tracking-tight"><TranslatedText text={item.title}/></CardTitle>
                                    <CardDescription className="text-foreground font-bold text-sm"><TranslatedText text={item.company}/></CardDescription>
                                </div>
                                <Badge variant="outline" className="border-primary/30 text-primary font-mono whitespace-nowrap bg-background text-[10px]">{item.duration}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-1">
                                {item.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="text-muted-foreground text-xs md:text-sm flex items-start">
                                        <Check className="h-3 w-3 text-primary mr-2 mt-1 shrink-0" />
                                        <TranslatedText text={detail}/>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
          </div>
        </section>
        
        {/* Education Section */}
        <section id="education" className="py-6 md:py-8 border-t bg-muted/50 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-primary tracking-tight">
              <GraduationCap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <TranslatedText text="Academic Education" />
          </h2>
          <div className="max-w-4xl mx-auto relative pl-8 md:pl-12">
            <div className="absolute left-1 md:left-2 top-0 h-full w-1 bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"></div>
            {(showAllEducation ? educationData : educationData.slice(0, initialEducationToShow)).map((edu, index) => (
              <div key={index} className={cn("mb-8 relative group")}>
                <div className="absolute left-[-39px] md:left-[-54px] top-1 w-5 h-5 md:w-7 md:h-7 bg-background rounded-full border-4 border-primary group-hover:bg-primary transition-colors flex items-center justify-center shadow-lg z-10">
                    <div className="w-1 h-1 bg-primary group-hover:bg-white rounded-full"></div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest bg-primary/10 w-fit px-3 py-1 rounded-full mb-1"><TranslatedText text={edu.duration}/></p>
                    <h3 className="text-base md:text-lg font-black text-accent leading-tight"><TranslatedText text={edu.degree}/></h3>
                    <p className="font-bold text-foreground text-sm md:text-base"><TranslatedText text={edu.university}/></p>
                    {edu.note && (
                      <p className="text-xs md:text-sm text-muted-foreground italic mt-2 font-medium border-l-4 border-accent/40 pl-4 bg-accent/5 py-1.5 rounded-r-lg">
                          <TranslatedText text={edu.note}/>
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
          {!showAllEducation && educationData.length > initialEducationToShow && (
              <div className="text-center mt-8">
                  <Button variant="secondary" size="md" onClick={() => setShowAllEducation(true)} className="rounded-full px-8 shadow-sm">
                      <TranslatedText text="View All Education" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
          <div className="max-w-3xl mx-auto mt-8 text-center">
              <Button asChild variant="outline" size="md" className="rounded-full shadow-sm hover:shadow-md transition-all border-2">
                  <a href="https://drive.google.com/drive/folders/1YuzeLBdH9-vTvZcJsEfyTUdH9j_ZqlIV?usp=sharing" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <TranslatedText text="Education File and CV" />
                  </a>
              </Button>
          </div>
        </section>

        {/* Postgraduate Diplomas Section */}
        <section id="retraining" className="py-6 md:py-8 border-t px-4 md:px-0">
            <h2 className="text-xl md:text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3 text-primary tracking-tight">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                <TranslatedText text="Postgraduate Diplomas (2023)" />
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 px-2">
                {postgraduateDiplomasData.map((diploma, index) => (
                    <Card key={index} className="bg-card/50 hover:shadow-xl transition-all group border-none shadow-sm rounded-2xl">
                        <CardHeader className="flex-row gap-4 items-center space-y-0 p-4">
                            <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors shadow-inner">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-sm md:text-base text-accent font-black leading-snug tracking-tight"><TranslatedText text={diploma.title}/></CardTitle>
                                <CardDescription className="font-bold text-foreground text-xs">
                                    <TranslatedText text={diploma.institution}/>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <Badge variant="secondary" className="font-mono text-[10px] px-3 rounded-full bg-background border shadow-inner">{diploma.year}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-6 md:py-8 border-t bg-muted/20 px-4 md:px-0">
          <div className="text-center mb-6">
              <Button asChild size="lg" className="text-lg md:text-2xl font-black h-auto py-3 px-8 rounded-full shadow-2xl">
                  <Link href="https://www.coursera.org/user/d5bf15915278f56a6f96c3b5195c6d11" target="_blank">
                      <TranslatedText text="Licenses & Certifications" />
                      <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                  </Link>
              </Button>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
              {cvData.certifications.slice(0, showAllCerts ? cvData.certifications.length : initialCertsToShow).map((cert, index) => {
                  const urlMatch = cert.match(/(?:—\s*|\()(https?:\/\/[^\s\)]+)\)?/);
                  const certUrl = urlMatch ? urlMatch[1] : null;
                  const cleanText = cert.split(urlMatch ? urlMatch[0] : '___nonexistent___')[0].replace(/\s*—\s*$/, '').trim();

                  return (
                      <Card key={index} className="bg-card/50 flex flex-col shadow-sm border-none rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
                          <CardHeader className="flex-grow p-4">
                              <CardTitle className="text-xs md:text-sm text-accent font-bold leading-tight"><TranslatedText text={cleanText}/></CardTitle>
                          </CardHeader>
                          {certUrl && (
                              <CardContent className="pt-0 px-4 pb-4 mt-auto">
                                  <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary font-black text-[10px] uppercase tracking-wider">
                                      <a href={certUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="mr-2 h-3 w-3" />
                                          <TranslatedText text="Verify Certificate" />
                                      </a>
                                  </Button>
                              </CardContent>
                          )}
                      </Card>
                  );
              })}
          </div>
          {!showAllCerts && cvData.certifications.length > initialCertsToShow && (
              <div className="text-center mt-8">
                  <Button variant="secondary" size="md" onClick={() => setShowAllCerts(true)} className="rounded-full px-8 shadow-sm">
                      <TranslatedText text="View All Certifications" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
        </section>

        {/* References Section */}
        <section id="references" className="py-6 md:py-8 border-t bg-muted/50 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-6 text-primary tracking-tight"><TranslatedText text="References"/></h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {references.map((ref, index) => (
                  <Card key={index} className="flex flex-col bg-card/80 border-none shadow-sm rounded-2xl hover:shadow-lg transition-all p-2">
                      <CardHeader className="pb-2">
                          <CardTitle className="text-lg text-primary font-black"><TranslatedText text={ref.name}/></CardTitle>
                          <CardDescription className="font-bold text-foreground text-xs">
                              <TranslatedText text={ref.title}/> <span className="text-muted-foreground font-medium px-1">at</span> <TranslatedText text={ref.company}/>
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-2 p-4 pt-0">
                          {ref.email && (
                              <a href={`mailto:${ref.email}`} className="flex items-center gap-3 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/30 p-2 rounded-lg">
                                  <Mail className="h-4 w-4 text-primary" />
                                  <span className="font-medium truncate">{ref.email}</span>
                              </a>
                          )}
                          {ref.phone && (
                              <div className="flex items-center gap-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg">
                                  <Phone className="h-4 w-4 text-primary" />
                                  <span className="font-medium">{ref.phone}</span>
                              </div>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-10 md:py-12 border-t px-4 md:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-black text-primary tracking-tighter"><TranslatedText text="Let's Connect" /></h2>
            <p className="text-muted-foreground mt-4 mb-8 text-base md:text-xl leading-relaxed font-medium">
              <TranslatedText text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision. Feel free to reach out." />
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <Button asChild size="lg" className="h-14 px-8 text-lg font-black rounded-full shadow-2xl hover:scale-105 transition-transform">
                <a href="mailto:musondasalim@gmail.com">musondasalim@gmail.com</a>
              </Button>
              <div className="flex flex-col sm:flex-row items-center gap-x-8 gap-y-2 text-muted-foreground">
                {cvData.phones.map(p => (
                   <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-primary font-black transition-colors text-base md:text-lg">
                    <Phone className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex space-x-6 justify-center">
              <SocialIcons className="flex space-x-6 justify-center" />
            </div>
          </div>
        </section>
        
        <footer className="text-center py-6 mt-8 border-t border-border/50">
            <p className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase">
                <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
            </p>
        </footer>
      </div>
  );
}
