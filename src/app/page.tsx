'use client';

import Image from 'next/image';
import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { SocialIcons } from '@/components/social-icons';
import { ArrowRight, Award, BrainCircuit, Calendar, Code, Database, Download, Eye, ExternalLink, Github, Globe, GraduationCap, Loader2, Mail, Network, Phone, Server, Shield, Smartphone, Star, Users, Check, UserCog, ChevronDown, Calculator, Terminal, Gamepad, Film, Edit, Layout, BookOpen, HeartHandshake, Zap } from 'lucide-react';
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
    { name: 'Laravel (PHP)', icon: <Server className="h-6 w-6" /> },
    { name: '.NET (C#)', icon: <Server className="h-6 w-6" /> },
    { name: 'Javascript', icon: <Code className="h-6 w-6" /> },
    { name: 'TypeScript', icon: <Code className="h-6 w-6" /> },
    { name: 'React', icon: <Globe className="h-6 w-6" /> },
    { name: 'Next.js', icon: <Globe className="h-6 w-6" /> },
    { name: 'Node.js/Express', icon: <Server className="h-6 w-6" /> },
    { name: 'C++', icon: <Code className="h-6 w-6" /> },
    { name: 'Flutter', icon: <Smartphone className="h-6 w-6" /> },
    { name: 'Networking', icon: <Network className="h-6 w-6" /> },
    { name: 'Databases (PostgreSQL, Supabase, MongoDB, Firebase)', icon: <Database className="h-6 w-6" /> },
    { name: 'AI & Automation', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'AI SDK (Vercel)', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'Firebase Studio', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'Google AI Studio', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'RAG', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'Cybersecurity', icon: <Shield className="h-6 w-6" /> },
    { name: 'System Admin', icon: <Server className="h-6 w-6" /> },
    { name: 'Data Analysis(Python & SQL)', icon: <Code className="h-6 w-6" /> },
    { name: 'Django', icon: <Server className="h-6 w-6" /> },
    { name: 'Tableau (Foundational)', icon: <Code className="h-6 w-6" /> },
    { name: 'Design & Photo Editing', icon: <Eye className="h-6 w-6" /> },
    { name: 'Microsoft 365/Office', icon: <UserCog className="h-6 w-6" /> },
    { name: 'Cursor 2.0', icon: <Terminal className="h-6 w-6" /> },
];

const projects = [
  {
    title: 'ai-chatBot using AI SDK by Vercel',
    link: 'https://github.com/MS0C54073/ai-chatBot_muzoGPT',
    category: 'AI/ML'
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
    title: 'Circuit Minds Web',
    link: 'https://github.com/MS0C54073/CM_Electronics',
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
        jobTitle: "IT Support  |  Software Developer  |  AI Specialist",
        email: "musondasalim@gmail.com",
        phones: ["+260 966 882 901", "+260 979 287 496", "+260 977 288 260"],
        location: "Lusaka, Zambia",
        linkedin: "linkedin.com/in/musonda-salimu",
        github: "github.com/MS0C54073",
        portfolio: "tinyurl.com/muzoslim",
        summary: "I am a curious and driven professional with a background in system administration, software engineering, and AI. I enjoy solving real problems across the stack, from designing system architecture and managing CI/CD workflows and Kubernetes environments, to connecting LLMs to proprietary databases and automating workflows with platforms like N8N and Supabase. I make active use of AI tools including Cursor AI, Claude, ChatGPT, and Gemini to move faster and build better, while keeping a strong focus on performance, security, and maintainability.",
        skillCategories: [
            { label: "Languages", value: "Python, JavaScript, TypeScript, C++, C#" },
            { label: "Frameworks", value: "React, Next.js, Node.js/Express, Django, .NET" },
            { label: "Mobile & Web", value: "Flutter, React Native" },
            { label: "Databases", value: "PostgreSQL (Supabase), MongoDB, Firebase" },
            { label: "AI & Automation", value: "Genkit, Firebase Studio, Claude Code, n8n, Gemini API, Orange Data Mining, Power BI, SQL" },
            { label: "Cloud & DevOps", value: "Docker, Git" },
            { label: "Cybersecurity", value: "SIEM, IDS, Network Security, Cybersecurity Compliance (Basic)" },
            { label: "Tools & Platforms", value: "Cursor 2.0, Tableau, Microsoft 365/Office, Adobe Creative Suite" },
        ],
        experience: professionalExperiences,
        community: communityInvolvement,
        education: educationData,
        certifications: [
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
        <section id="home" className="py-8 md:py-16 text-center flex flex-col items-center">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 group">
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
          <div className="text-lg md:text-2xl text-muted-foreground mt-3 flex flex-wrap items-center justify-center gap-2 max-w-2xl px-2">
            <TranslatedText text="IT Professional" />
            <span className="hidden md:inline text-primary">|</span>
            <TranslatedText text="Software Developer" />
            <span className="hidden md:inline text-primary">|</span>
            <TranslatedText text="AI Specialist" />
            <span className="hidden md:inline text-primary">|</span>
            <Button variant="link" asChild className="text-lg md:text-2xl p-0 h-auto font-semibold">
                <Link href="/tutor"><TranslatedText text="Tutor" /></Link>
            </Button>
          </div>
          <p className="max-w-2xl mx-auto mt-6 text-foreground/80 leading-relaxed text-sm md:text-base px-4">
             <TranslatedText text="A results-driven IT professional with a dynamic educational background in IT, Technological Entrepreneurship and Innovation Management, Management in the Digital Economy, Development of Digital Twins, and Management of High Tech Programs and Projects. This diverse expertise is applied to software development, system administration, and AI, with a special focus on securely connecting large language models to data and conceptualizing advanced AI assistants." />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 md:gap-4 px-4">
            <Button asChild size="lg" className="w-full sm:w-auto shadow-md">
              <a href="#contact"><TranslatedText text="Get in Touch" /></a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto shadow-sm">
              <Link href="/it-service-calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  <TranslatedText text="Service Cost" />
              </Link>
            </Button>
            
            <div className="flex flex-wrap gap-2 w-full justify-center mt-2 sm:mt-0 sm:w-auto">
                <Button onClick={() => generateCv('download')} size="lg" disabled={isGenerating} className="flex-1 sm:flex-none">
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                    <TranslatedText text="Download CV" />
                </Button>
                <Button onClick={() => generateCv('preview')} size="lg" variant="outline" disabled={isGenerating} className="flex-1 sm:flex-none">
                    <Eye className="mr-2 h-5 w-5" />
                    <TranslatedText text="Preview" />
                </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-10 md:py-16 border-t px-4 md:px-0">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-6 md:mb-10 text-primary tracking-tight"><TranslatedText text="About Me"/></h2>
            <div className="max-w-4xl mx-auto">
                <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-center">
                    <TranslatedText text="I am a curious and driven professional with a background in system administration, software engineering, and AI. I enjoy solving real problems across the stack, from designing system architecture and managing CI/CD workflows and Kubernetes environments, to connecting LLMs to proprietary databases and automating workflows with platforms like N8N and Supabase. I make active use of AI tools including Cursor AI, Claude, ChatGPT, and Gemini to move faster and build better, while keeping a strong focus on performance, security, and maintainability."/>
                </p>
            </div>
        </section>

        {/* Hobbies & Interests Section */}
        <section id="hobbies" className="py-10 md:py-16 border-t px-4 md:px-0 bg-muted/20">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-primary tracking-tight"><TranslatedText text="Hobbies & Interests"/></h2>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <Gamepad className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl"><TranslatedText text="Gaming"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="I enjoy immersive single-player adventures and competitive multiplayer games."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow">
                  <CardHeader className="text-center pb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <Film className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl"><TranslatedText text="Documentaries"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="Exploring real-world stories and learning about history, science, and culture."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50 shadow-sm border-primary/5 hover:shadow-md transition-shadow sm:col-span-2 md:col-span-1">
                  <CardHeader className="text-center pb-2">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2 text-primary">
                          <BrainCircuit className="h-7 w-7" />
                      </div>
                      <CardTitle className="text-xl"><TranslatedText text="AI Research"/></CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                      <p className="text-muted-foreground text-sm leading-relaxed"><TranslatedText text="Staying up-to-date with the latest advancements and tools in artificial intelligence."/></p>
                  </CardContent>
              </Card>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-10 md:py-16 border-t bg-muted/50 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-primary tracking-tight"><TranslatedText text="Technical Skills" /></h2>
          <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-10">
            {skills.map(skill => (
              <div key={skill.name} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-background rounded-2xl flex items-center justify-center shadow-lg text-primary transform transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-white mb-4">
                  {skill.icon}
                </div>
                <p className="font-bold text-foreground text-xs md:text-sm leading-snug px-1">
                    <TranslatedText text={skill.name} />
                </p>
              </div>
            ))}
          </div>
           <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
            <Card className="bg-background/80 backdrop-blur shadow-sm border-none">
              <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2"><Database className="h-5 w-5 text-primary" /><TranslatedText text="Data Tools & Automation" /></CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    <TranslatedText text="Data Collection: Google Forms, Microsoft Forms, REST APIs, webhooks. Databases: SQL/NoSQL (PostgreSQL, MySQL, MongoDB, Supabase). Workflow Automation: n8n, Zapier, Google AI Studio | Gemini API." />
                  </p>
              </CardContent>
            </Card>
            <Card className="bg-background/80 backdrop-blur shadow-sm border-none">
              <CardHeader className="pb-2">
                  <CardTitle className="text-lg md:text-xl flex items-center gap-2"><Edit className="h-5 w-5 text-primary" /><TranslatedText text="Design & Media" /></CardTitle>
              </CardHeader>
              <CardContent>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    <TranslatedText text="Creative Tools: Adobe Premiere Pro, Photoshop, Canva. Graphic Design, Videography, Photography (Intermediate)." />
                  </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-10 md:py-16 border-t px-4 md:px-0">
          <div className="text-center mb-10">
              <Button asChild size="lg" className="text-2xl md:text-4xl font-black h-auto py-4 px-8 rounded-full shadow-xl">
                  <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer">
                      <TranslatedText text="Projects" />
                      <ArrowRight className="ml-3 h-6 w-6 md:h-8 md:w-8" />
                  </a>
              </Button>
          </div>

          {/* AI/ML Sub-Section */}
          <div className="max-w-5xl mx-auto mb-16">
            <h3 className="text-xl md:text-3xl font-extrabold text-primary mb-10 flex items-center justify-center gap-3 border-b-2 border-primary/10 pb-4">
                <BrainCircuit className="h-8 w-8" />
                <TranslatedText text="AI & Machine Learning" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                {projects.filter(p => p.category === 'AI/ML').map((project, index) => (
                    <a 
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="bg-card/50 hover:bg-accent/5 border-primary/5 hover:border-primary transition-all duration-300 h-full shadow-sm hover:shadow-lg">
                        <CardHeader className="pb-4">
                          <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg md:text-xl font-bold leading-tight">
                              <TranslatedText text={project.title} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button variant="outline" className="w-full bg-background group-hover:bg-primary group-hover:text-white transition-colors">
                                <Github className="mr-2 h-4 w-4" />
                                <TranslatedText text="View on GitHub" />
                            </Button>
                        </CardContent>
                      </Card>
                    </a>
                ))}
            </div>
          </div>

          {/* Web & General Section */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl md:text-3xl font-extrabold text-primary mb-10 flex items-center justify-center gap-3 border-b-2 border-primary/10 pb-4">
                <Code className="h-8 w-8" />
                <TranslatedText text="Web & Software Development" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
              {(showAllProjects ? projects.filter(p => !p.category) : projects.filter(p => !p.category).slice(0, initialProjectsToShow)).map((project, index) => {
                if ((project as any).demo) {
                  return (
                    <Card key={index} className="bg-card/50 hover:bg-accent/5 border-primary/5 hover:border-primary transition-all duration-300 h-full flex flex-col shadow-sm hover:shadow-lg">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg md:text-xl font-bold leading-tight">
                          <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                        <div className="mt-4 flex w-full gap-2">
                            <Button asChild variant="outline" className="flex-grow bg-background">
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" />
                                  <TranslatedText text="GitHub" />
                                </a>
                            </Button>
                            <Button asChild variant="default" className="flex-grow shadow-md">
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
                      <CardHeader className="pb-4">
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg md:text-xl font-bold leading-tight">
                            <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Button variant="outline" className="w-full bg-background group-hover:bg-primary group-hover:text-white transition-colors">
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
                <div className="text-center mt-12">
                    <Button variant="secondary" size="lg" onClick={() => setShowAllProjects(true)} className="rounded-full px-8 shadow-sm">
                        <TranslatedText text="View All Projects" />
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-16 px-4 md:px-0">
            <Alert variant="accent" className="rounded-2xl border-2 py-6">
              <Terminal className="h-6 w-6" />
              <AlertTitle className="text-lg font-bold"><TranslatedText text="Explore My Full Portfolio" /></AlertTitle>
              <AlertDescription className="text-sm md:text-base mt-2">
                <TranslatedText text="For a deeper dive into my work, including more projects and code samples, please " />
                <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer" className="font-bold text-accent underline underline-offset-4 decoration-2">
                  <TranslatedText text="visit my GitHub profile" />
                </a>.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-10 md:py-16 border-t px-4 md:px-0">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-primary tracking-tight"><TranslatedText text="Work Experience" /></h2>
          <div className="max-w-4xl mx-auto">
            <Accordion 
              type="multiple"
              className="w-full space-y-4"
              value={openAccordionItems}
              onValueChange={setOpenAccordionItems}
            >
              {(showAllExperience ? professionalExperiences : professionalExperiences.slice(0, initialExperienceToShow)).map((exp, index) => (
                <AccordionItem value={`item-${index}`} key={index} className="border rounded-2xl px-6 bg-card/40 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="hover:no-underline py-6">
                    <div className="text-left">
                      <h3 className="text-lg md:text-xl font-black text-accent tracking-tight"><TranslatedText text={exp.title}/></h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mt-1">
                          <p className="font-bold text-foreground text-sm md:text-base"><TranslatedText text={exp.company}/></p>
                          <span className="hidden sm:inline text-muted-foreground">•</span>
                          <p className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider"><TranslatedText text={exp.duration}/></p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6">
                    <ul className="space-y-3 pl-4 border-l-2 border-primary/20 ml-1">
                      {exp.details.map((d, i) => (
                          <li key={i} className="text-muted-foreground text-sm md:text-base flex items-start">
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
                <div className="text-center mt-12">
                    <Button 
                        variant="secondary" 
                        size="lg"
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
        <section id="community" className="py-10 md:py-16 border-t bg-muted/30 px-4 md:px-0">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 text-primary tracking-tight">
              <HeartHandshake className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              <TranslatedText text="Community Involvement & Volunteering" />
          </h2>
          <div className="max-w-4xl mx-auto space-y-6">
                {communityInvolvement.map((item, index) => (
                    <Card key={index} className="bg-card/50 border-primary/10 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-4">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <CardTitle className="text-lg md:text-xl text-accent font-black tracking-tight"><TranslatedText text={item.title}/></CardTitle>
                                    <CardDescription className="text-foreground font-bold text-base"><TranslatedText text={item.company}/></CardDescription>
                                </div>
                                <Badge variant="outline" className="border-primary/30 text-primary font-mono whitespace-nowrap bg-background">{item.duration}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2">
                                {item.details.map((detail, dIdx) => (
                                    <li key={dIdx} className="text-muted-foreground text-sm md:text-base flex items-start">
                                        <Check className="h-4 w-4 text-primary mr-2 mt-1 shrink-0" />
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
        <section id="education" className="py-10 md:py-16 border-t bg-muted/50 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 text-primary tracking-tight">
              <GraduationCap className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              <TranslatedText text="Academic Education" />
          </h2>
          <div className="max-w-4xl mx-auto relative pl-8 md:pl-12">
            <div className="absolute left-1 md:left-2 top-0 h-full w-1 bg-gradient-to-b from-primary/40 via-primary/10 to-transparent"></div>
            {(showAllEducation ? educationData : educationData.slice(0, initialEducationToShow)).map((edu, index) => (
              <div key={index} className={cn("mb-12 relative group")}>
                <div className="absolute left-[-39px] md:left-[-54px] top-1 w-6 h-6 md:w-8 md:h-8 bg-background rounded-full border-4 border-primary group-hover:bg-primary transition-colors flex items-center justify-center shadow-lg z-10">
                    <div className="w-1.5 h-1.5 bg-primary group-hover:bg-white rounded-full"></div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs md:text-sm text-primary font-black uppercase tracking-widest bg-primary/10 w-fit px-3 py-1 rounded-full mb-2"><TranslatedText text={edu.duration}/></p>
                    <h3 className="text-xl md:text-2xl font-black text-accent leading-tight"><TranslatedText text={edu.degree}/></h3>
                    <p className="font-bold text-foreground md:text-lg"><TranslatedText text={edu.university}/></p>
                    {edu.note && (
                      <p className="text-sm md:text-base text-muted-foreground italic mt-3 font-medium border-l-4 border-accent/40 pl-4 bg-accent/5 py-2 rounded-r-lg">
                          <TranslatedText text={edu.note}/>
                      </p>
                    )}
                </div>
              </div>
            ))}
          </div>
          {!showAllEducation && educationData.length > initialEducationToShow && (
              <div className="text-center mt-12">
                  <Button variant="secondary" size="lg" onClick={() => setShowAllEducation(true)} className="rounded-full px-8 shadow-sm">
                      <TranslatedText text="View All Education" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
          <div className="max-w-3xl mx-auto mt-10 text-center">
              <Button asChild variant="outline" size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all border-2">
                  <a href="https://drive.google.com/drive/folders/1YuzeLBdj9-vTvZcJsEfyTUdH9j_ZqlIV?usp=sharing" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      <TranslatedText text="Education File and CV" />
                  </a>
              </Button>
          </div>
        </section>

        {/* Postgraduate Diplomas Section */}
        <section id="retraining" className="py-10 md:py-16 border-t px-4 md:px-0">
            <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 flex items-center justify-center gap-3 text-primary tracking-tight">
                <Zap className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                <TranslatedText text="Postgraduate Diplomas (2023)" />
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-2">
                {postgraduateDiplomasData.map((diploma, index) => (
                    <Card key={index} className="bg-card/50 hover:shadow-xl transition-all group border-none shadow-sm rounded-2xl">
                        <CardHeader className="flex-row gap-4 items-center space-y-0 p-5">
                            <div className="bg-primary/10 p-4 rounded-2xl group-hover:bg-primary/20 transition-colors shadow-inner">
                                <BookOpen className="h-7 w-7 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <CardTitle className="text-lg md:text-xl text-accent font-black leading-snug tracking-tight"><TranslatedText text={diploma.title}/></CardTitle>
                                <CardDescription className="font-bold text-foreground text-sm">
                                    <TranslatedText text={diploma.institution}/>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="px-5 pb-5">
                            <Badge variant="secondary" className="font-mono text-sm px-4 rounded-full bg-background border shadow-inner">{diploma.year}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-10 md:py-16 border-t bg-muted/20 px-4 md:px-0">
          <div className="text-center mb-10">
              <Button asChild size="lg" className="text-xl md:text-4xl font-black h-auto py-4 px-10 rounded-full shadow-2xl">
                  <Link href="https://www.coursera.org/user/d5bf15915278f56a6f96c3b5195c6d11" target="_blank">
                      <TranslatedText text="Licenses & Certifications" />
                      <ArrowRight className="ml-3 h-6 w-6 md:h-8 md:w-8" />
                  </Link>
              </Button>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 px-2">
              {cvData.certifications.slice(0, showAllCerts ? cvData.certifications.length : initialCertsToShow).map((cert, index) => {
                  const urlMatch = cert.match(/(?:—\s*|\()(https?:\/\/[^\s\)]+)\)?/);
                  const certUrl = urlMatch ? urlMatch[1] : null;
                  const cleanText = cert.split(urlMatch ? urlMatch[0] : '___nonexistent___')[0].replace(/\s*—\s*$/, '').trim();

                  return (
                      <Card key={index} className="bg-card/50 flex flex-col shadow-sm border-none rounded-2xl hover:shadow-md transition-shadow overflow-hidden">
                          <CardHeader className="flex-grow p-6">
                              <CardTitle className="text-base md:text-lg text-accent font-bold leading-tight"><TranslatedText text={cleanText}/></CardTitle>
                          </CardHeader>
                          {certUrl && (
                              <CardContent className="pt-0 px-6 pb-6 mt-auto">
                                  <Button variant="link" asChild className="p-0 h-auto text-primary font-black text-sm uppercase tracking-wider">
                                      <a href={certUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="mr-2 h-4 w-4" />
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
              <div className="text-center mt-12">
                  <Button variant="secondary" size="lg" onClick={() => setShowAllCerts(true)} className="rounded-full px-8 shadow-sm">
                      <TranslatedText text="View All Certifications" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
        </section>

        {/* References Section */}
        <section id="references" className="py-10 md:py-16 border-t bg-muted/50 rounded-2xl md:rounded-[3rem] px-4 md:px-8 mx-2 md:mx-0">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-10 text-primary tracking-tight"><TranslatedText text="References"/></h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {references.map((ref, index) => (
                  <Card key={index} className="flex flex-col bg-card/80 border-none shadow-sm rounded-2xl hover:shadow-lg transition-all p-2">
                      <CardHeader className="pb-4">
                          <CardTitle className="text-xl text-primary font-black"><TranslatedText text={ref.name}/></CardTitle>
                          <CardDescription className="font-bold text-foreground">
                              <TranslatedText text={ref.title}/> <span className="text-muted-foreground font-medium px-1">at</span> <TranslatedText text={ref.company}/>
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-3 p-6 pt-0">
                          {ref.email && (
                              <a href={`mailto:${ref.email}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors bg-muted/30 p-2 rounded-lg">
                                  <Mail className="h-5 w-5 text-primary" />
                                  <span className="font-medium">{ref.email}</span>
                              </a>
                          )}
                          {ref.phone && (
                              <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                                  <Phone className="h-5 w-5 text-primary" />
                                  <span className="font-medium">{ref.phone}</span>
                              </div>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="py-10 md:py-16 border-t px-4 md:px-0">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-5xl font-black text-primary tracking-tighter"><TranslatedText text="Let's Connect" /></h2>
            <p className="text-muted-foreground mt-6 mb-10 text-base md:text-xl leading-relaxed font-medium">
              <TranslatedText text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision. Feel free to reach out." />
            </p>
            <div className="flex flex-col items-center gap-6 mb-10">
              <Button asChild size="lg" className="h-16 px-10 text-xl font-black rounded-full shadow-2xl hover:scale-105 transition-transform">
                <a href="mailto:musondasalim@gmail.com">musondasalim@gmail.com</a>
              </Button>
              <div className="flex flex-col sm:flex-row items-center gap-x-10 gap-y-4 text-muted-foreground">
                {cvData.phones.map(p => (
                   <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="flex items-center gap-3 hover:text-primary font-black transition-colors text-lg">
                    <Phone className="h-5 w-5 text-primary" />
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
        
        <footer className="text-center py-8 mt-12 border-t border-border/50">
            <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
                <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
            </p>
        </footer>
      </div>
  );
}
