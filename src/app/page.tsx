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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { jsPDF } from 'jspdf';
import { useState, useEffect } from 'react';
import { app, storage, db }from '@/lib/firebase';
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
        company: "Kursk State University",
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
        note: "Awaiting Official Translation and Validation (Legalization).",
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
        summary: "Results-driven IT professional with expertise in software development, system administration, and artificial intelligence. Background in technological entrepreneurship with hands-on experience in modern frameworks and cloud technologies. Active community contributor through technical mentorship, student welfare, and volunteer programmes across Zambia and Russia.",
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
                ACCENT: [15, 23, 42] as [number, number, number], // Slate 900
                LIGHT: [51, 65, 85] as [number, number, number],  // Slate 700
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
      <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8">
        {/* Hero Section */}
        <section id="home" className="py-20 text-center">
          <Image
            src="https://drive.google.com/uc?id=18haKNolQwC6XQxH3weaKMkvFEV_rBYc6"
            alt="Musonda Salimu Profile"
            width={150}
            height={150}
            data-ai-hint="profile picture"
            className="rounded-full mx-auto mb-6 shadow-lg border-4 border-primary object-cover"
            priority
            id="profile-pic"
            crossOrigin="anonymous"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            <TranslatedText text="Musonda Salimu" />
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mt-2 flex items-center justify-center gap-x-2 flex-wrap">
            <TranslatedText text="IT Professional" />
            <span className="text-primary">|</span>
            <TranslatedText text="Software Developer" />
            <span className="text-primary">|</span>
            <TranslatedText text="AI" />
            <span className="text-primary">|</span>
            <Button variant="link" asChild className="text-xl md:text-2xl p-0 h-auto">
                <Link href="/tutor"><TranslatedText text="Tutor" /></Link>
            </Button>
          </p>
          <p className="max-w-2xl mx-auto mt-4 text-foreground">
             <TranslatedText text="A results-driven IT professional with a dynamic educational background in IT, Technological Entrepreneurship and Innovation Management, Management in the Digital Economy, Development of Digital Twins, and Management of High Tech Programs and Projects. This diverse expertise is applied to software development, system administration, and AI, with a special focus on securely connecting large language models to data and conceptualizing advanced AI assistants." />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <a href="#contact"><TranslatedText text="Get in Touch" /></a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/it-service-calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  <TranslatedText text="Service Cost" />
              </Link>
            </Button>
            
            {/* --- CV Generator Controls --- */}
            <div className="flex gap-2">
                <Button onClick={() => generateCv('download')} size="lg" disabled={isGenerating}>
                    {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                    <TranslatedText text="Download CV" />
                </Button>
                <Button onClick={() => generateCv('preview')} size="lg" variant="outline" disabled={isGenerating}>
                    <Eye className="mr-2 h-5 w-5" />
                    <TranslatedText text="Preview" />
                </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 border-t">
            <h2 className="text-3xl font-bold text-center mb-12 text-primary"><TranslatedText text="About Me"/></h2>
            <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="text-lg text-muted-foreground space-y-4">
                    <p><TranslatedText text="I am a versatile and experienced professional with a passion for technology. My journey has taken me through system administration, software engineering, and cutting-edge AI research."/></p>
                    <p><TranslatedText text="I thrive on solving complex problems and am particularly excited by the intersection of AI and practical business solutions. My current focus is on securely connecting LLMs like GPT to proprietary databases, leveraging no-code platforms (N8N, WeWeb, Supabase) for rapid development, and exploring advanced AI concepts like the 'Neuro-secretary' to automate complex workflows."/></p>
                    <p><TranslatedText text="Driven by a willingness to learn, I am continuously pushing the boundaries of what's possible, merging my skills in full-stack development and AI to create next-generation solutions."/></p>
                </div>
            </div>
        </section>

        {/* Hobbies & Interests Section */}
        <section id="hobbies" className="py-20 border-t">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary"><TranslatedText text="Hobbies & Interests"/></h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <Card className="bg-card/50">
                  <CardHeader>
                      <Gamepad className="h-10 w-10 mx-auto text-primary" />
                      <CardTitle className="mt-2"><TranslatedText text="Gaming"/></CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground"><TranslatedText text="I enjoy immersive single-player adventures and competitive multiplayer games."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50">
                  <CardHeader>
                      <Film className="h-10 w-10 mx-auto text-primary" />
                      <CardTitle className="mt-2"><TranslatedText text="Documentaries"/></CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground"><TranslatedText text="Exploring real-world stories and learning about history, science, and culture."/></p>
                  </CardContent>
              </Card>
              <Card className="bg-card/50">
                  <CardHeader>
                      <BrainCircuit className="h-10 w-10 mx-auto text-primary" />
                      <CardTitle className="mt-2"><TranslatedText text="AI Research"/></CardTitle>
                  </CardHeader>
                  <CardContent>
                      <p className="text-muted-foreground"><TranslatedText text="Staying up-to-date with the latest advancements and tools in artificial intelligence."/></p>
                  </CardContent>
              </Card>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="py-20 border-t bg-muted/50 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary"><TranslatedText text="Technical Skills" /></h2>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {skills.map(skill => (
              <div key={skill.name} className="flex flex-col items-center text-center gap-2">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-md text-primary flex-shrink-0">
                  {skill.icon}
                </div>
                <p className="font-semibold text-foreground text-sm leading-tight px-1 flex items-center justify-center h-10">
                    <TranslatedText text={skill.name} />
                </p>
              </div>
            ))}
          </div>
           <div className="max-w-3xl mx-auto mt-12 text-center space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2"><TranslatedText text="Data Tools & Automation" /></h3>
              <p className="text-muted-foreground">
                <TranslatedText text="Data Collection: Google Forms, Microsoft Forms, REST APIs, webhooks. Databases: SQL/NoSQL (PostgreSQL, MySQL, MongoDB, Supabase). Workflow Automation: n8n, Zapier, Google AI Studio | Gemini API." />
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2"><TranslatedText text="Design & Media" /></h3>
              <p className="text-muted-foreground">
                <TranslatedText text="Creative Tools: Adobe Premiere Pro, Photoshop, Canva." />
              </p>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="py-20 border-t">
          <div className="text-center mb-12">
              <Button asChild size="lg" className="text-3xl font-bold h-auto py-3 px-6">
                  <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer">
                      <TranslatedText text="Projects" />
                      <ArrowRight className="ml-3 h-6 w-6" />
                  </a>
              </Button>
          </div>

          {/* AI/ML Sub-Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center justify-center gap-2">
                <BrainCircuit className="h-7 w-7" />
                <TranslatedText text="AI & Machine Learning" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.filter(p => p.category === 'AI/ML').map((project, index) => (
                    <a 
                      key={index}
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block"
                    >
                      <Card className="bg-card/50 hover:bg-accent/20 hover:border-primary transition-all duration-300 h-full">
                        <CardHeader>
                          <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg">
                              <TranslatedText text={project.title} />
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <span className="flex items-center">
                                    <Github className="mr-2 h-4 w-4" />
                                    <TranslatedText text="View on GitHub" />
                                  </span>
                              </Button>
                        </CardContent>
                      </Card>
                    </a>
                ))}
            </div>
          </div>

          {/* Web & General Section */}
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-primary mb-8 flex items-center justify-center gap-2">
                <Code className="h-7 w-7" />
                <TranslatedText text="Web & Software Development" />
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(showAllProjects ? projects.filter(p => !p.category) : projects.filter(p => !p.category).slice(0, initialProjectsToShow)).map((project, index) => {
                if ((project as any).demo) {
                  return (
                    <Card key={index} className="bg-card/50 hover:bg-accent/20 hover:border-primary transition-all duration-300 h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg">
                          <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex items-end">
                        <div className="mt-4 flex w-full">
                            <Button asChild variant="outline" className="flex-grow rounded-r-none focus:z-10">
                              <a href={project.link} target="_blank" rel="noopener noreferrer">
                                  <Github className="mr-2 h-4 w-4" />
                                  <TranslatedText text="GitHub" />
                                </a>
                            </Button>
                            <Button asChild variant="default" className="-ml-px rounded-l-none focus:z-10">
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
                    <Card key={index} className="bg-card/50 hover:bg-accent/20 hover:border-primary transition-all duration-300 h-full">
                      <CardHeader>
                        <CardTitle className="text-accent group-hover:text-primary transition-colors text-lg">
                            <TranslatedText text={project.title} />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <Button asChild variant="outline" className="w-full">
                              <span className="flex items-center">
                                  <Github className="mr-2 h-4 w-4" />
                                  <TranslatedText text="View on GitHub" />
                                </span>
                            </Button>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
            {!showAllProjects && projects.filter(p => !p.category).length > initialProjectsToShow && (
                <div className="text-center mt-8">
                    <Button variant="secondary" onClick={() => setShowAllProjects(true)}>
                        <TranslatedText text="View All Projects" />
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto mt-12">
            <Alert variant="accent">
              <Terminal className="h-4 w-4" />
              <AlertTitle><TranslatedText text="Explore My Full Portfolio" /></AlertTitle>
              <AlertDescription>
                <TranslatedText text="For a deeper dive into my work, including more projects and code samples, please " />
                <a href="https://github.com/MS0C54073" target="_blank" rel="noopener noreferrer" className="font-semibold text-accent underline">
                  <TranslatedText text="visit my GitHub profile" />
                </a>.
              </AlertDescription>
            </Alert>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="py-20 border-t">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary"><TranslatedText text="Work Experience" /></h2>
          <div className="max-w-3xl mx-auto">
            <Accordion 
              type="multiple"
              className="w-full"
              value={openAccordionItems}
              onValueChange={setOpenAccordionItems}
            >
              {(showAllExperience ? professionalExperiences : professionalExperiences.slice(0, initialExperienceToShow)).map((exp, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-accent"><TranslatedText text={exp.title}/></h3>
                      <p className="font-semibold text-foreground"><TranslatedText text={exp.company}/></p>
                      <p className="text-sm text-muted-foreground"><TranslatedText text={exp.duration}/></p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                      {exp.details.map((d, i) => <li key={i}><TranslatedText text={d}/></li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {!showAllExperience && professionalExperiences.length > initialExperienceToShow && (
                <div className="text-center mt-8">
                    <Button 
                        variant="secondary" 
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
        <section id="community" className="py-20 border-t bg-muted/30">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3 text-primary">
              <HeartHandshake className="h-8 w-8 text-primary" />
              <TranslatedText text="Community Involvement & Volunteering" />
          </h2>
          <div className="max-w-3xl mx-auto">
             <div className="space-y-6">
                {communityInvolvement.map((item, index) => (
                    <Card key={index} className="bg-card/50 border-primary/10">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl text-accent"><TranslatedText text={item.title}/></CardTitle>
                                    <CardDescription className="text-foreground font-medium"><TranslatedText text={item.company}/></CardDescription>
                                </div>
                                <Badge variant="outline" className="border-primary text-primary">{item.duration}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <ul className="list-disc list-inside text-muted-foreground space-y-1 text-sm">
                                {item.details.map((detail, dIdx) => (
                                    <li key={dIdx}><TranslatedText text={detail}/></li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
             </div>
          </div>
        </section>
        
        {/* Education Section */}
        <section id="education" className="py-20 border-t bg-muted/50 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3 text-primary">
              <GraduationCap className="h-8 w-8 text-primary" />
              <TranslatedText text="Academic Education" />
          </h2>
          <div className="max-w-3xl mx-auto relative pl-8">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-border"></div>
            {(showAllEducation ? educationData : educationData.slice(0, initialEducationToShow)).map((edu, index) => (
              <div key={index} className={cn("mb-12 relative")}>
                <div className="absolute left-[-34px] top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <p className="text-sm text-muted-foreground"><TranslatedText text={edu.duration}/></p>
                <h3 className="text-xl font-bold text-accent"><TranslatedText text={edu.degree}/></h3>
                <p className="font-semibold text-foreground"><TranslatedText text={edu.university}/></p>
                {edu.note && (
                  <p className="text-sm text-muted-foreground italic mt-1 font-medium border-l-2 border-primary/30 pl-2">
                      <TranslatedText text={edu.note}/>
                  </p>
                )}
              </div>
            ))}
          </div>
          {!showAllEducation && educationData.length > initialEducationToShow && (
              <div className="text-center mt-8">
                  <Button variant="secondary" onClick={() => setShowAllEducation(true)}>
                      <TranslatedText text="View All Education" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
          <div className="max-w-3xl mx-auto mt-8 text-center">
              <Button asChild variant="outline">
                  <a href="https://drive.google.com/drive/folders/1YuzeLBdj9-vTvZcJsEfyTUdH9j_ZqlIV?usp=sharing" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <TranslatedText text="Education File and CV" />
                  </a>
              </Button>
          </div>
        </section>

        {/* Postgraduate Diplomas Section */}
        <section id="retraining" className="py-20 border-t">
            <h2 className="text-3xl font-bold text-center mb-12 flex items-center justify-center gap-3 text-primary">
                <Zap className="h-8 w-8 text-primary" />
                <TranslatedText text="Postgraduate Diplomas (2023)" />
            </h2>
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {postgraduateDiplomasData.map((diploma, index) => (
                    <Card key={index} className="bg-card/50 hover:shadow-md transition-shadow group">
                        <CardHeader className="flex-row gap-4 items-center space-y-0">
                            <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-lg text-accent leading-tight"><TranslatedText text={diploma.title}/></CardTitle>
                                <CardDescription className="font-medium text-foreground mt-1">
                                    <TranslatedText text={diploma.institution}/>
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="secondary" className="font-mono">{diploma.year}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        {/* Certifications Section */}
        <section id="certifications" className="py-20 border-t bg-muted/20">
          <div className="text-center mb-12">
              <Button asChild size="lg" className="text-3xl font-bold h-auto py-3 px-6">
                  <Link href="https://www.coursera.org/user/d5bf15915278f56a6f96c3b5195c6d11" target="_blank">
                      <TranslatedText text="Licenses & Certifications" />
                      <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
              </Button>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {cvData.certifications.slice(0, showAllCerts ? cvData.certifications.length : initialCertsToShow).map((cert, index) => {
                  const urlMatch = cert.match(/(?:—\s*|\()(https?:\/\/[^\s\)]+)\)?/);
                  const certUrl = urlMatch ? urlMatch[1] : null;
                  const cleanText = cert.split(urlMatch ? urlMatch[0] : '___nonexistent___')[0].replace(/\s*—\s*$/, '').trim();

                  return (
                      <Card key={index} className="bg-card/50 flex flex-col">
                          <CardHeader className="flex-grow">
                              <CardTitle className="text-lg text-accent"><TranslatedText text={cleanText}/></CardTitle>
                          </CardHeader>
                          {certUrl && (
                              <CardContent className="pt-0">
                                  <Button variant="link" asChild className="p-0 h-auto text-primary">
                                      <a href={certUrl} target="_blank" rel="noopener noreferrer">
                                          <ExternalLink className="mr-1 h-3 w-3" />
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
                  <Button variant="secondary" onClick={() => setShowAllCerts(true)}>
                      <TranslatedText text="View All Certifications" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
        </section>

        {/* References Section */}
        <section id="references" className="py-20 border-t bg-muted/50 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary"><TranslatedText text="References"/></h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {references.map((ref, index) => (
                  <Card key={index} className="flex flex-col bg-card/80">
                      <CardHeader>
                          <CardTitle className="text-xl text-primary"><TranslatedText text={ref.name}/></CardTitle>
                          <CardDescription>
                              <TranslatedText text={ref.title}/> at <TranslatedText text={ref.company}/>
                          </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-2">
                          {ref.email && (
                              <a href={`mailto:${ref.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
                                  <Mail className="h-4 w-4" />
                                  <span>{ref.email}</span>
                              </a>
                          )}
                          {ref.phone && (
                              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Phone className="h-4 w-4" />
                                  <span>{ref.phone}</span>
                              </p>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
        </section>
        
        <section id="contact" className="py-20 border-t">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-primary"><TranslatedText text="Let's Connect" /></h2>
            <p className="text-muted-foreground mt-4 mb-8">
              <TranslatedText text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision. Feel free to reach out." />
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <Button asChild size="lg">
                <a href="mailto:musondasalim@gmail.com">musondasalim@gmail.com</a>
              </Button>
              <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-muted-foreground">
                {cvData.phones.map(p => (
                   <a key={p} href={`tel:${p.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-primary">
                    <Phone className="h-4 w-4" />
                    <span>{p}</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="flex space-x-6 justify-center">
              <SocialIcons className="flex space-x-4 justify-center" />
            </div>
          </div>
        </section>
        
        <footer className="text-center py-6 mt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
                <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
            </p>
        </footer>
      </div>
  );
}