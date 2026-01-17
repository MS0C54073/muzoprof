
'use client';

import Image from 'next/image';
import Link from 'next/link';
import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { SocialIcons } from '@/components/social-icons';
import { ArrowRight, Award, BrainCircuit, Calendar, Code, Database, Download, Eye, ExternalLink, Github, Globe, GraduationCap, Loader2, Mail, Network, Phone, Server, Shield, Smartphone, Star, Users, Check, UserCog, ChevronDown, Calculator, Terminal, Gamepad, Film } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { jsPDF } from 'jspdf';
import { useState, type ComponentType } from 'react';
import { getAnalytics, logEvent } from "firebase/analytics";
import { app, storage, db }from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Order } from '@/lib/types';


const skills = [
    { name: 'Data Analysis(Python & SQL)', icon: <Code className="h-6 w-6" /> },
    { name: 'Django', icon: <Server className="h-6 w-6" /> },
    { name: 'Laravel (PHP)', icon: <Server className="h-6 w-6" /> },
    { name: '.NET (C#)', icon: <Server className="h-6 w-6" /> },
    { name: 'Javascript', icon: <Code className="h-6 w-6" /> },
    { name: 'TypeScript', icon: <Code className="h-6 w-6" /> },
    { name: 'React', icon: <Globe className="h-6 w-6" /> },
    { name: 'Next.js', icon: <Globe className="h-6 w-6" /> },
    { name: 'Node.js/Express', icon: <Server className="h-6 w-6" /> },
    { name: 'C++', icon: <Code className="h-6 w-6" /> },
    { name: 'Flutter', icon: <Smartphone className="h-6 w-6" /> },
    { name: 'Databases (PostgreSQL, Supabase, MongoDB, Firebase)', icon: <Database className="h-6 w-6" /> },
    { name: 'AI & Automation', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'Firebase Studio', icon: <BrainCircuit className="h-6 w-6" /> },
    { name: 'Cybersecurity', icon: <Shield className="h-6 w-6" /> },
    { name: 'System Admin', icon: <Server className="h-6 w-6" /> },
    { name: 'Networking', icon: <Network className="h-6 w-6" /> },
    { name: 'Tableau (Foundational)', icon: <Code className="h-6 w-6" /> },
    { name: 'Design & Photo Editing', icon: <Eye className="h-6 w-6" /> },
    { name: 'Microsoft 365/Office', icon: <UserCog className="h-6 w-6" /> },
    { name: 'Cursor 2.0', icon: <Terminal className="h-6 w-6" /> },
];

const projects = [
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
    title: 'TEXT FILES ARCHIVING PROGRAM (High-level language programming)',
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
    title: 'DETECTING FAKE NEWS WITH PYTHON',
    link: 'https://github.com/MS0C54073/store-locator.git',
  },
  {
    title: 'STORE-LOCATOR',
    link: 'https://github.com/MS0C54073/store-locator',
  },
];

const experiences = [
    {
        title: "AI Content Evaluation Specialist (Project-Based)",
        company: "Invisible Technologies & Outlier",
        duration: "Aug 2024 – Sep 2025",
        details: [
            "Evaluated AI-generated content, including code, text, images, and videos, providing clear, human-readable summaries.",
            "Solved coding problems and ensured all technical outputs were functional, efficient, and reliable.",
            "Developed test cases and verification methods to confirm content quality and accuracy.",
            "Provided actionable feedback to improve AI content generation processes."
        ]
    },
    {
        title: "IT Support Volunteer / Technical Assistant",
        company: "Embassy of the Republic of Zambia in Moscow, Russia",
        duration: "May 2025 – Jul 2025",
        details: [
            "Maintained and managed embassy IT systems.",
            "Provided Technical Support to ensure seamless digital operations."
        ]
    },
    {
        title: "AI Training Methods Researcher (Internship)",
        company: "Novosibirsk State Technical University",
        duration: "2022 – 2024",
        details: [
          "Tested new training algorithms specifically for Spiking Neural Networks (SNNs).",
          "Conducted experiments to evaluate the performance of various SNN training approaches.",
          "Managed and preprocessed datasets for training and evaluating SNN models."
        ]
    },
    {
        title: "System Administrator Intern",
        company: "Pensions and Insurance Authority",
        duration: "May 2022 – Oct 2022",
        details: [
            "Assisted in maintaining, securing, and optimizing the Authority’s IT infrastructure and websites.",
            "Contributed to the maintenance and development of the Authority’s official website to improve functionality and accessibility.",
            "Monitored system performance and resolved software, hardware, and network issues to ensure reliable operations.",
            "Provided ICT support and user training to staff, enhancing technical efficiency and digital literacy.",
            "Supported data backup, system updates."
        ]
    },
     {
      title: "Customer Care Assistant",
      company: "VITALITE Group",
      duration: "2021 (Temporal Contract)",
      details: [
        "Delivered professional customer support by responding promptly to inquiries and resolving complaints.",
        "Communicated with customers across multiple channels, ensuring a positive and empathetic experience.",
        "Processed orders, forms, and applications while maintaining accurate records of transactions and feedback.",
        "Collaborated with colleagues to coordinate effective customer service solutions."
      ]
    },
    {
        title: "IT Intern / Trainee (Software Development & Networking Support)",
        company: "Kursk State University",
        duration: "May 2019 – Jul 2021",
        details: [
            "Participated in university-organized summer and winter trainee programs in partnership with various IT companies.",
            "Assisted in networking support, system setup, and maintenance of lab environments.",
            "Built, tested, and optimized software applications using C++, Python, and C#.",
            "Utilized automated debugging tools and performance optimization techniques to enhance application efficiency.",
            "Collaborated with industry professionals and mentors, gaining hands-on experience in real-world software development and IT support environments."
        ]
    },
    {
      title: "IT Support Freelancer",
      company: "Hybrid",
      duration: "2017 – Present",
      details: [
        "Providing remote or on-site technical assistance to individuals or businesses.",
        "Resolving hardware, software, and network issues via phone, email, or chat.",
        "Documenting solutions for clients."
      ]
    },
    {
        title: "Customer Care Associate",
        company: "Tech Mahindra - outsourcing (Airtel Zambia PLC) services",
        duration: "Aug 2015 - Oct 2016",
        details: [
            "Ensured Customer Satisfaction through consistent standards of service excellence through implementation of continuous improvement initiatives.",
            "Provided excellent customer relationship management by resolving customer queries, selling, retention and relationship building.",
            "Promoted Airtel brand image by managing service delivery aligned to customer needs and business objectives.",
            "Adhered to good work ethics."
        ]
    },
    {
        title: "Internet Cafe Operator",
        company: "AbduTech InterNet Cafe",
        duration: "Dec 2013 - Aug 2015",
        details: [
            "Assisted customers with PC software including Microsoft Office, Adobe suites, Windows operating system installation, and other essential programs.",
            "Provided services such as encoding, printing, photocopying, typing, and downloading.",
            "Troubleshooted various computer applications, hardware, and software issues.",
            "Provided excellent customer care and maintained store records and inventories."
        ]
    }
];

const education = [
     {
        degree: "Master's of Science, Informatics and Computer Engineering",
        university: "Novosibirsk State Technical University",
        duration: "Sep 2022 - Jul 2024",
        note: "Awaiting Official Translation and Certification in Zambia."
    },
    {
        degree: "Bachelor's of Science, Software and Administration of Information Systems",
        university: "Kursk State University | Kursk, Russia",
        duration: "Sep 2017 - Jul 2021",
    },
    {
        degree: "Diploma of Professional Retraining, Management in the Digital Economy",
        university: "Novosibirsk State Technical University",
        duration: "Sep 2023 - Dec 2023",
        note: "Awaiting Official Translation and Certification in Zambia."
    },
    {
        degree: "Diploma of Professional Retraining, Technological Entrepreneurship and Innovation Management",
        university: "Novosibirsk State Technical University",
        duration: "Sep 2023 - Dec 2023",
        note: "Awaiting Official Translation and Certification in Zambia."
    },
    {
        degree: "Diploma of Professional Retraining, Development of Digital Twins",
        university: "Novosibirsk State Technical University",
        duration: "Sep 2023 - Dec 2023",
        note: "Awaiting Official Translation and Certification in Zambia."
    },
    {
        degree: "Diploma of Professional Retraining, Management of High Tech Programs and Projects",
        university: "Pskov State University",
        duration: "Sep 2023 - Dec 2023",
        note: "Awaiting Official Translation and Certification in Zambia."
    },
    {
        degree: "Russian language and preparatory program, Russian language and Culture",
        university: "Belgorod State University",
        duration: "Oct 2016 - Jul 2017",
    },
    {
        degree: "General Certificate in Education (ECZ), O-Levels",
        university: "Arakan Boys Secondary School",
        duration: "2011 - 2013",
    },
];

const awards = [
    {
        title: "WINNER of 'International Olympiad of the Financial University for Youth (Master's Degree - 2023-2024)'",
        issuer: "Financial University",
        date: "2024",
    },
];

const certifications = [
    { title: 'Introduction to Cybersecurity', issuer: 'SMART ZAMBIA INSTITUTE (Cisco Networking Academy)', date: 'Jul 2025', skills: ['Cybersecurity'] },
    { title: 'AI Agents and Agentic AI in Python: Powered by Generative AI', issuer: 'Vanderbilt University', date: 'Aug 2025', credentialId: 'K42YL24QMRT3' },
    { title: 'Automate Cybersecurity Tasks with Python', issuer: 'Google', date: 'Aug 2023', credentialId: 'C7XRV7CQNCQM', skills: ['PEP 8 style guide'] },
    { title: 'Assets, Threats, and Vulnerabilities', issuer: 'Google', date: 'Aug 2023', credentialId: 'VX5TA2Q2S67K' },
    { title: 'Connect and Protect: Networks and Network Security', issuer: 'Google', date: 'Aug 2023', credentialId: 'QTMMW72GVFNR' },
    { title: 'Google Cybersecurity', issuer: 'Google', date: 'Aug 2023', credentialId: 'ZQRFL5JFN79Z', skills: ['SQL', 'SIEM', 'IDS', 'Linux', 'Python'] },
    { title: 'Introduction to Artificial Intelligence (AI)', issuer: 'IBM', date: 'Aug 2023', credentialId: 'ZQRFL5JFN79Z' },
    { title: 'Introduction to Cloud Computing', issuer: 'IBM', date: 'Aug 2023', credentialId: '6V7R3J56LE33' },
    { title: 'Key Technologies for Business', issuer: 'IBM', date: 'Aug 2023', credentialId: 'ED6HPWDG6QVB' },
    { title: 'Play It Safe: Manage Security Risks', issuer: 'Google', date: 'Aug 2023', credentialId: 'SM23C5AREJRM' },
    { title: 'Put It to Work: Prepare for Cybersecurity Jobs', issuer: 'Google', date: 'Aug 2023', credentialId: 'LSZUYQUMHPP8' },
    { title: 'Sound the Alarm: Detection and Response', issuer: 'Google', date: 'Aug 2023', credentialId: 'DBENMJKEDA46' },
    { title: 'Tools of the Trade: Linux and SQL', issuer: 'Google', date: 'Aug 2023', credentialId: 'PMN4CB7GLMC7' },
    { title: 'Cybersecurity Compliance Framework & System Administration', issuer: 'IBM', date: 'Jun 2022', credentialId: 'SARK6MHGJE2W' },
    { title: 'Cybersecurity Roles, Processes & Operating System Security', issuer: 'IBM', date: 'Jun 2022', credentialId: '9SSFKD6DLP7N' },
    { title: 'IT Fundamentals for Cybersecurity', issuer: 'IBM', date: 'Jun 2022', credentialId: 'BDSXYEGVZUWK', skills: ['Networking', 'Databases', 'Cybersecurity', 'OS Security', 'Cyber Attacks'] },
    { title: 'Introduction to Cybersecurity Tools & Cyber Attacks', issuer: 'Coursera', date: 'Jun 2022' },
    { title: 'Network Security & Database Vulnerabilities', issuer: 'IBM', date: 'Jun 2022', credentialId: 'NTDBPW657286' },
    { title: 'Foundations of Digital Marketing and E-commerce', issuer: 'Google', date: 'May 2022', credentialId: 'F7MG9YAXM94Y' },
    { title: 'Foundations of Project Management', issuer: 'Google', date: 'May 2022', credentialId: 'KBKA6QSQRLGV' },
    { title: 'Crash Course on Python', issuer: 'Google', date: 'Feb 2022', credentialId: '739MZ344RHQ2' },
    { title: 'Exploratory Data Analysis for Machine Learning', issuer: 'IBM', date: 'Feb 2022', credentialId: '65JUNKQNLLNE' },
    { title: 'Foundations of User Experience (UX) Design', issuer: 'Google', date: 'Feb 2022', credentialId: 'LQUUB69CBRJU' },
    { title: 'Foundations: Data, Data, Everywhere', issuer: 'Google', date: 'Feb 2022', credentialId: 'J5KRN8LFPNPK' },
    { title: 'Introduction to Cybersecurity Tools & Cyber Attacks', issuer: 'IBM', date: 'Feb 2022', credentialId: 'RJR6MQHGE65M' },
    { title: 'C++ (Basic) Certificate', issuer: 'HackerRank', date: 'Sep 2020', credentialId: 'DEA4F08FE541' },
    { title: 'Python (Basic) Certificate', issuer: 'HackerRank', date: 'Aug 2020', credentialId: '6E56080D33F3' },
    { title: 'EF SET English Certificate', issuer: 'EF SET', date: 'Sep 2024' },
    { title: 'Teacher Of English To Speakers Of Other Languages (TEFL)', issuer: 'Teacher Record', date: 'Sep 2023', credentialId: 'TR2672252278' },
    { title: 'Teach English Now! Foundational Principles', issuer: 'Arizona State University (via Coursera)', date: 'Sep 2024' },
];

const references = [
    {
        name: "Innocent Mukupa",
        title: "ICT Manager",
        company: "Pensions & Insurance Authority",
        email: "Innocent.mukupa@pia.org.zm",
        phone: "+260-211-251401 | +260-211-251405 | Fax: +260-211-251492"
    },
    {
        name: "Prof. Aaron B. Zyambo",
        title: "CEO & Lead Consultant",
        company: "Mega Vision Logistics Int'l Ltd",
        email: "abzyambo@yahoo.com",
        phone: "+260 97 9793999"
    },
    {
        name: "Mwansa Kapoka",
        title: "Team Leader",
        company: "TechMahindra Limited Zambia",
        email: "mwansa.kapoka@sc.com",
        phone: "+260 978980443"
    },
    {
        name: "Allan Mwimbu",
        title: "Supervior | First Secretary Political",
        company: "Embassy of the Republic of Zambia in Moscow, Russia",
        email: null,
        phone: "+79855159011"
    },
    {
        name: "Ann Chibinga",
        title: "Team Leader",
        company: "VITALITE Zambia",
        email: "ann.chibinga@vitalitegroup.com",
        phone: "(+260) 777407124"
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
            
            // 1. Save to Firestore
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

            // 2. Call API route to send email
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
                console.warn("Firestore save succeeded, but email notification failed.", result.message);
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
            if (typeof window !== "undefined") {
                if (process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
                    const analytics = getAnalytics(app);
                    logEvent(analytics, 'cv_generated', { type: outputType });
                } else {
                    console.warn('Firebase Analytics is disabled. CV generation event will not be logged.');
                }
            }
            
            const cvData = {
                name: "Musonda Salimu",
                jobTitle: "IT Professional | Software Developer | AI | Tutor",
                contact: {
                    email: "musondasalim@gmail.com",
                    phone1: "+260966882901",
                    phone2: "+260979287496",
                    github: "github.com/MS0C54073",
                    portfolio: "https://tinyurl.com/muzoslim",
                },
                summary: "A results-driven IT professional with a dynamic educational background in IT, Technological Entrepreneurship and Innovation Management, Management in the Digital Economy, Development of Digital Twins, and Management of High Tech Programs and Projects. This diverse expertise is applied to software development, system administration, and AI, with a special focus on securely connecting large language models to data and conceptualizing advanced AI assistants.",
                skills: [
                    "Languages: Python, JavaScript, TypeScript, C++, C#, PHP, SQL",
                    "Frameworks: React, Next.js, Node.js/Express, Django, Laravel, .NET",
                    "Mobile: Flutter",
                    "Databases: PostgreSQL (Supabase), MongoDB, Firebase",
                    "AI & Automation: AI Development (Genkit, Firebase Studio), Data Automation (n8n, Google AI Studio | Gemini API)",
                    "Ops & Security: SysAdmin, Networking, Cybersecurity (SIEM, IDS), Cloud (GCP, Firebase)",
                    "Tools: Docker, Git, Tableau (Foundational), Cursor 2.0",
                    "Business: Project Management, Microsoft 365/Office",
                    "Creative: Design & Media (Photoshop, Premiere Pro, Canva)",
                ],
                experience: [
                    {
                        title: "AI Content Evaluation Specialist (Project-Based)",
                        company: "Invisible Technologies & Outlier",
                        duration: "Aug 2024 – Sep 2025",
                        details: [
                            "Evaluated AI-generated content, including code, text, images, and videos, providing clear, human-readable summaries.",
                            "Solved coding problems and ensured all technical outputs were functional, efficient, and reliable.",
                            "Developed test cases and verification methods to confirm content quality and accuracy.",
                            "Provided actionable feedback to improve AI content generation processes."
                        ]
                    },
                     {
                        title: "IT Support Volunteer / Technical Assistant",
                        company: "Embassy of the Republic of Zambia in Moscow, Russia",
                        duration: "May 2025 – Jul 2025",
                        details: [
                           "Maintained and managed embassy IT systems.",
                           "Provided Technical Support to ensure seamless digital operations."
                        ]
                    },
                    {
                        title: "AI Training Methods Researcher (Internship)",
                        company: "Novosibirsk State Technical University",
                        duration: "2022 – 2024",
                        details: [
                          "Tested new training algorithms specifically for Spiking Neural Networks (SNNs).",
                          "Conducted experiments to evaluate the performance of various SNN training approaches.",
                          "Managed and preprocessed datasets for training and evaluating SNN models."
                        ]
                    },
                    {
                        title: "System Administrator Intern",
                        company: "Pensions and Insurance Authority",
                        duration: "May 2022 – Oct 2022",
                        details: [
                            "Assisted in maintaining, securing, and optimizing the Authority’s IT infrastructure and websites.",
                            "Contributed to the maintenance and development of the Authority’s official website to improve functionality and accessibility.",
                            "Monitored system performance and resolved software, hardware, and network issues to ensure reliable operations.",
                            "Provided ICT support and user training to staff, enhancing technical efficiency and digital literacy.",
                            "Supported data backup, system updates."
                        ]
                    },
                     {
                      title: "Customer Care Assistant",
                      company: "VITALITE Group",
                      duration: "2021 (Temporal Contract)",
                      details: [
                        "Delivered professional customer support by responding promptly to inquiries and resolving complaints.",
                        "Communicated with customers across multiple channels, ensuring a positive and empathetic experience.",
                        "Processed orders, forms, and applications while maintaining accurate records of transactions and feedback.",
                        "Collaborated with colleagues to coordinate effective customer service solutions."
                      ]
                    },
                    {
                        title: "IT Intern / Trainee (Software Development & Networking Support)",
                        company: "Kursk State University",
                        duration: "May 2019 – Jul 2021",
                        details: [
                           "Participated in university-organized summer and winter trainee programs in partnership with various IT companies.",
                           "Assisted in networking support, system setup, and maintenance of lab environments.",
                           "Built, tested, and optimized software applications using C++, Python, and C#.",
                           "Utilized automated debugging tools and performance optimization techniques to enhance application efficiency.",
                           "Collaborated with industry professionals and mentors, gaining hands-on experience in real-world software development and IT support environments."
                        ]
                    },
                    {
                      title: "IT Support Freelancer",
                      company: "Hybrid",
                      duration: "2017 – Present",
                      details: [
                        "Providing remote or on-site technical assistance to individuals or businesses.",
                        "Resolving hardware, software, and network issues via phone, email, or chat.",
                        "Documenting solutions for clients."
                      ]
                    },
                    {
                        title: "Customer Care Associate",
                        company: "Tech Mahindra - outsourcing (Airtel Zambia PLC) services",
                        duration: "Aug 2015 - Oct 2016",
                        details: [
                            "Ensured Customer Satisfaction through consistent standards of service excellence through implementation of continuous improvement initiatives.",
                            "Provided excellent customer relationship management by resolving customer queries, selling, retention and relationship building.",
                            "Promoted Airtel brand image by managing service delivery aligned to customer needs and business objectives.",
                            "Adhered to good work ethics."
                        ]
                    },
                    {
                        title: "Internet Cafe Operator",
                        company: "AbduTech InterNet Cafe",
                        duration: "Dec 2013 - Aug 2015",
                        details: [
                            "Assisted customers with PC software including Microsoft Office, Adobe suites, Windows operating system installation, and other essential programs.",
                            "Provided services such as encoding, printing, photocopying, typing, and downloading.",
                            "Troubleshooted various computer applications, hardware, and software issues.",
                            "Provided excellent customer care and maintained store records and inventories."
                        ]
                    },
                ].sort((a, b) => new Date(b.duration.split(' – ')[1] === 'Present' ? Date.now() : b.duration.split(' – ')[1] || 0).getTime() - new Date(a.duration.split(' – ')[1] === 'Present' ? Date.now() : a.duration.split(' – ')[1] || 0).getTime()),
                education: [
                    {
                        degree: "Master's of Science, Informatics and Computer Engineering",
                        university: "Novosibirsk State Technical University",
                        duration: "Sep 2022 - Jul 2024",
                        details: "Awaiting Official Translation and Certification in Zambia."
                    },
                    {
                        degree: "Bachelor's of Science, Software and Administration of Information Systems",
                        university: "Kursk State University, Russia",
                        duration: "Sep 2017 - Jul 2021",
                    },
                     {
                        degree: "Multiple Diplomas of Professional Retraining",
                        university: "Novosibirsk & Pskov State Universities",
                        duration: "2023",
                        details: "Awaiting Official Translation and Certification in Zambia. Specializations in Digital Economy Management, Technological Entrepreneurship, Digital Twins, and High-Tech Project Management."
                    },
                    {
                        degree: "Russian Language and Preparatory Program",
                        university: "Belgorod State University",
                        duration: "Oct 2016 - Jul 2017",
                    },
                    {
                        degree: "General Certificate in Education (O-Levels)",
                        university: "Arakan Boys Secondary School",
                        duration: "2011 - 2013",
                    },
                ],
                certifications: [
                    {
                        title: "AI Agents and Agentic AI in Python: Powered by Generative AI",
                        issuer: "Vanderbilt University", type: "Specialization",
                        date: "Completed Aug 2025",
                        courses: ["AI Agents and Agentic AI Architecture in Python", "AI Agents and Agentic AI with Python & Generative AI"]
                    },
                    { title: "Prompt Engineering for ChatGPT", issuer: "Vanderbilt University", type: "Course", date: "Completed Aug 2025" },
                    { title: "Introduction to Cybersecurity", issuer: "SMART ZAMBIA INSTITUTE (Cisco Networking Academy)", type: "Course", date: "Issued Jul 2025" },
                    {
                        title: "Google Cybersecurity Professional Certificate",
                        issuer: "Google", type: "Specialization",
                        date: "Completed Aug 2023",
                        courses: ["Automate Cybersecurity Tasks with Python", "Sound the Alarm: Detection and Response", "Put It to Work: Prepare for Cybersecurity Jobs"]
                    },
                    { title: 'Teach English Now! Foundational Principles', issuer: 'Arizona State University (via Coursera)', type: 'Course', date: 'Completed Sep 2024' },
                    { title: "Key Technologies for Business Specialization", issuer: "IBM", type: "Specialization", date: "Completed Aug 2023" },
                    {
                        title: "IT Fundamentals for Cybersecurity Specialization",
                        issuer: "IBM", type: "Specialization",
                        date: "Completed Jun 2022",
                        courses: ["Operating Systems: Overview, Administration, and Security", "Cybersecurity Compliance Framework, Standards & Regulations", "Computer Networks and Network Security"]
                    },
                    { title: "C++ (Basic) Certificate", issuer: "HackerRank", type: "Certificate", date: "Issued Sep 2020", credentialId: "DEA4F08FE541" },
                    { title: "Python (Basic) Certificate", issuer: "HackerRank", type: "Certificate", date: "Issued Aug 2020", credentialId: "6E56080D33F3" },
                    { title: 'EF SET English Certificate', issuer: 'EF SET', type: "Certificate", date: 'Issued Sep 2024' },
                    { title: 'Teacher Of English To Speakers Of Other Languages (TEFL)', issuer: 'Teacher Record', type: "Certificate", date: 'Issued Sep 2023', credentialId: 'TR2672252278' },
                ],
                references: [
                    {
                        name: "Innocent Mukupa",
                        title: "ICT Manager",
                        company: "Pensions & Insurance Authority",
                        email: "Innocent.mukupa@pia.org.zm",
                        phone: "+260-211-251401 | +260-211-251405 | Fax: +260-211-251492"
                    },
                    {
                        name: "Prof. Aaron B. Zyambo",
                        title: "CEO & Lead Consultant",
                        company: "Mega Vision Logistics Int'l Ltd",
                        email: "abzyambo@yahoo.com",
                        phone: "+260 97 9793999"
                    },
                     {
                        name: "Mwansa Kapoka",
                        title: "Team Leader",
                        company: "TechMahindra Limited Zambia",
                        email: "mwansa.kapoka@sc.com",
                        phone: "+260 978980443"
                    },
                    {
                        name: "Allan Mwimbu",
                        title: "Supervior | First Secretary Political",
                        company: "Embassy of the Republic of Zambia in Moscow, Russia",
                        email: null,
                        phone: "+79855159011"
                    },
                    {
                        name: "Ann Chibinga",
                        title: "Team Leader",
                        company: "VITALITE Zambia",
                        email: "ann.chibinga@vitalitegroup.com",
                        phone: "(+260) 777407124"
                    },
                ]
            };
            
            const doc = new jsPDF({ unit: 'px', format: 'a4' });
            doc.setFont('Helvetica', 'normal');

            const pageHeight = doc.internal.pageSize.getHeight();
            const pageWidth = doc.internal.pageSize.getWidth();
            const margin = 30;
            const contentWidth = pageWidth - margin * 2;
            const lineHeight = 1.15;
            let y = 0;

            const checkPageBreak = (heightNeeded: number) => {
                if (y + heightNeeded > pageHeight - margin) {
                    doc.addPage();
                    y = margin;
                }
            };
            
            const addSectionTitle = (title: string, yPos: number) => {
                doc.setFontSize(11);
                doc.setFont('Helvetica', 'bold');
                doc.setTextColor(37, 99, 235); // #2563EB
                doc.text(title.toUpperCase(), margin, yPos);
                const titleHeight = 11;
                const lineY = yPos + titleHeight / 2 + 1;
                doc.setDrawColor(226, 232, 240); // slate-200
                doc.setLineWidth(0.5);
                doc.line(margin + doc.getTextWidth(title) + 5, lineY, pageWidth - margin, lineY);
                return yPos + titleHeight + 4; // Return new y position
            };

            // --- Header ---
            y = margin;
            
            doc.setFontSize(24);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(cvData.name, margin, y + 5);
            y += 20;
            
            doc.setFontSize(11);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(82, 82, 91); // zinc-600
            doc.text(cvData.jobTitle, margin, y + 5);
            y += 15;

            doc.setFontSize(9);
            const contactLine = `${cvData.contact.email}  •  ${cvData.contact.phone1}  •  ${cvData.contact.phone2}`;
            doc.text(contactLine, margin, y + 5);
            y += 12;
            const socialLine = `GitHub: ${cvData.contact.github}  •  Portfolio: ${cvData.contact.portfolio}`;
            doc.text(socialLine, margin, y + 5);
            y += 5;
            
            // --- Summary ---
            y = addSectionTitle("Summary", y + 15);
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(51, 65, 85); // slate-700
            const summaryLines = doc.splitTextToSize(cvData.summary, contentWidth);
            doc.text(summaryLines, margin, y);
            y += summaryLines.length * 9 * lineHeight;

            // --- Core Competencies ---
            y = addSectionTitle("Core Competencies", y);
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            
            const skillsString = cvData.skills.map(skill => `• ${skill}`).join('  ');
            const skillsLines = doc.splitTextToSize(skillsString, contentWidth);
            
            checkPageBreak(skillsLines.length * 9 * lineHeight);
            doc.text(skillsLines, margin, y);
            y += (skillsLines.length * 9 * lineHeight) + 4;


            // --- Work Experience ---
            y = addSectionTitle("Work Experience", y);
            cvData.experience.forEach(exp => {
                checkPageBreak(40);
                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(exp.title, margin, y);

                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(82, 82, 91);
                doc.text(exp.duration, pageWidth - margin, y, { align: 'right' });
                y += 10 * lineHeight;

                doc.setFontSize(9);
                doc.setFont('Helvetica', 'italic');
                doc.text(exp.company, margin, y);
                y += 10;
                
                doc.setFontSize(9);
                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(51, 65, 85);
                exp.details.forEach(detail => {
                    const detailLines = doc.splitTextToSize(`•  ${detail}`, contentWidth - 10);
                    checkPageBreak(detailLines.length * 9 * lineHeight + 2);
                    doc.text(detailLines, margin + 5, y);
                    y += detailLines.length * 9 * lineHeight;
                });
                y += 6;
            });

            // --- Education ---
            y = addSectionTitle("Education", y);
            cvData.education.forEach(edu => {
                checkPageBreak(edu.details ? 30 : 20);
                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(edu.degree, margin, y);

                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(82, 82, 91);
                doc.text(edu.duration, pageWidth - margin, y, { align: 'right' });
                y += 10 * lineHeight;

                doc.setFontSize(9);
                doc.setFont('Helvetica', 'italic');
                doc.text(edu.university, margin, y);
                y += 10;

                if (edu.details) {
                    doc.setFontSize(8);
                    doc.setFont('Helvetica', 'normal');
                    const detailLines = doc.splitTextToSize(edu.details, contentWidth - 5);
                    checkPageBreak(detailLines.length * 8 * lineHeight);
                    doc.text(detailLines, margin + 5, y);
                    y += detailLines.length * 8 * lineHeight;
                }
                y += 4;
            });

            // --- Licenses & Certifications ---
            checkPageBreak(50); // check for space before starting the section
            y = addSectionTitle("Licenses & Certifications", y);
            cvData.certifications.forEach(cert => {
                const requiredHeight = (cert.courses ? 28 : 18) + (cert.credentialId ? 8 : 0);
                checkPageBreak(requiredHeight);

                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.setTextColor(0, 0, 0);
                doc.text(cert.title, margin, y);
                y += 10 * lineHeight;

                doc.setFontSize(9);
                doc.setFont('Helvetica', 'normal');
                doc.setTextColor(82, 82, 91);
                const issuerLine = `${cert.issuer} · ${cert.type}`;
                doc.text(issuerLine, margin, y);
                doc.text(cert.date, pageWidth - margin, y, { align: 'right' });
                y += 10;

                if (cert.courses) {
                    doc.setFontSize(8);
                    doc.setFont('Helvetica', 'italic');
                    const coursesText = `Relevant Coursework: ${cert.courses.join(', ')}`;
                    const courseLines = doc.splitTextToSize(coursesText, contentWidth);
                    checkPageBreak(courseLines.length * 8 * lineHeight);
                    doc.text(courseLines, margin, y);
                    y += courseLines.length * 8 * lineHeight;
                }
                
                if (cert.credentialId) {
                    doc.setFontSize(8);
                    doc.setFont('Helvetica', 'italic');
                    doc.text(`Credential ID: ${cert.credentialId}`, margin, y);
                    y += 8;
                }
                y += 4;
            });
            
             // --- References ---
            doc.addPage();
            y = margin;
            y = addSectionTitle("References", y);
            cvData.references.forEach(ref => {
                checkPageBreak(30);
                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.text(ref.name, margin, y);
                y += 10;
                
                doc.setFontSize(9);
                doc.setFont('Helvetica', 'normal');
                doc.text(`${ref.title}, ${ref.company}`, margin, y);
                y += 9;

                if (ref.email) {
                    doc.text(`Email: ${ref.email}`, margin, y);
                    y += 9;
                }
                 if (ref.phone) {
                    doc.text(`Phone: ${ref.phone}`, margin, y);
                    y += 9;
                }
                y += 8;
            });


            if (outputType === 'preview') {
                doc.output('dataurlnewwindow');
            } else {
                doc.save('MuzoSaliCV.pdf');
            }
        } catch (error) {
            console.error("Error generating PDF:", error);
            toast({
                variant: 'destructive',
                title: 'PDF Generation Failed',
                description: 'There was an error creating the CV. Please try again.',
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
            alt="Muzo's Profile Picture"
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
            <Button onClick={() => generateCv('download')} size="lg" variant="outline" className="hover:bg-accent hover:text-accent-foreground" disabled={isGenerating}>
                  {isGenerating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Download className="mr-2 h-5 w-5" />}
                  <TranslatedText text="Download CV" />
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 border-t">
            <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="About Me"/></h2>
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
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="Hobbies & Interests"/></h2>
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
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="Technical Skills" /></h2>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {skills.map(skill => (
              <div key={skill.name} className="flex flex-col items-center text-center gap-2">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-md text-primary flex-shrink-0">
                  {skill.icon}
                </div>
                <p className="font-semibold text-foreground text-sm leading-tight px-1 h-14 flex items-center justify-center">
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
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {(showAllProjects ? projects : projects.slice(0, initialProjectsToShow)).map((project, index) => {
              if (project.demo) {
                return (
                  <Card key={index} className="bg-card/50 hover:bg-accent/20 hover:border-primary transition-all duration-300 h-full flex flex-col">
                    <CardHeader>
                      <CardTitle className="text-accent group-hover:text-primary transition-colors">
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
                              <a href={project.demo} target="_blank" rel="noopener noreferrer">
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
                  <Card className="bg-card/50 hover:bg-accent/20 hover:border-primary transition-all duration-300 h-full">
                    <CardHeader>
                      <CardTitle className="text-accent group-hover:text-primary transition-colors">
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
          {!showAllProjects && projects.length > initialProjectsToShow && (
              <div className="text-center mt-8">
                  <Button variant="secondary" onClick={() => setShowAllProjects(true)}>
                      <TranslatedText text="View All Projects" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
          <div className="max-w-4xl mx-auto mt-8">
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
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="Work Experience" /></h2>
          <div className="max-w-3xl mx-auto">
            <Accordion 
              type="multiple"
              className="w-full"
              value={openAccordionItems}
              onValueChange={setOpenAccordionItems}
            >
              {(showAllExperience ? experiences : experiences.slice(0, initialExperienceToShow)).map((exp, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="text-left">
                      <h3 className="text-xl font-bold text-accent"><TranslatedText text={exp.title}/></h3>
                      <p className="font-semibold text-foreground">{exp.company}</p>
                      <p className="text-sm text-muted-foreground">{exp.duration}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                      {exp.details.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            {!showAllExperience && experiences.length > initialExperienceToShow && (
                <div className="text-center mt-8">
                    <Button 
                        variant="secondary" 
                        onClick={() => {
                            setShowAllExperience(true);
                            setOpenAccordionItems(experiences.map((_, index) => `item-${index}`));
                        }}
                    >
                        <TranslatedText text="View All Experience" />
                        <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            )}
          </div>
        </section>
        
        {/* Education Section */}
        <section id="education" className="py-20 border-t bg-muted/50 rounded-lg">
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="Education" /></h2>
          <div className="max-w-3xl mx-auto relative pl-8">
            <div className="absolute left-0 top-0 h-full w-0.5 bg-border"></div>
            {(showAllEducation ? education : education.slice(0, initialEducationToShow)).map((edu, index) => (
              <div key={index} className="mb-12 relative">
                <div className="absolute left-[-34px] top-1.5 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                <p className="text-sm text-muted-foreground">{edu.duration}</p>
                <h3 className="text-xl font-bold text-accent">{edu.degree}</h3>
                <p className="font-semibold text-foreground">{edu.university}</p>
                {edu.note && (
                  <p className="text-sm text-muted-foreground italic mt-1">{edu.note}</p>
                )}
              </div>
            ))}
          </div>
          {!showAllEducation && education.length > initialEducationToShow && (
              <div className="text-center mt-8">
                  <Button variant="secondary" onClick={() => setShowAllEducation(true)}>
                      <TranslatedText text="View All Education" />
                      <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
              </div>
          )}
        </section>

        {/* Awards Section */}
        <section id="awards" className="py-20 border-t">
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="Awards & Achievements"/></h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
              {awards.map((award, index) => (
                  <Card key={index} className="bg-card/50">
                      <CardHeader>
                          <div className="flex items-start gap-4">
                              <Award className="h-8 w-8 text-accent flex-shrink-0 mt-1" />
                              <div>
                                  <CardTitle className="text-lg text-accent">{award.title}</CardTitle>
                                  <CardDescription className="mt-1">
                                      <TranslatedText text="Awarded by "/> <strong>{award.issuer}</strong> - {award.date}
                                  </CardDescription>
                              </div>
                          </div>
                      </CardHeader>
                  </Card>
              ))}
          </div>
        </section>
        
        {/* Certifications Section */}
        <section id="certifications" className="py-20 border-t">
          <div className="text-center mb-12">
              <Button asChild size="lg" className="text-3xl font-bold h-auto py-3 px-6">
                  <Link href="https://www.coursera.org/user/d5bf15915278f56a6f96c3b5195c6d11" target="_blank">
                      <TranslatedText text="Licenses & Certifications" />
                      <ArrowRight className="ml-3 h-6 w-6" />
                  </Link>
              </Button>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {certifications.slice(0, showAllCerts ? certifications.length : initialCertsToShow).map((cert, index) => (
                  <Card key={index} className="bg-card/50">
                      <CardHeader>
                          <CardTitle className="text-lg text-accent">{cert.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                          <p className="text-sm text-muted-foreground">
                              <TranslatedText text="Issued by "/> <strong>{cert.issuer}</strong> - {cert.date}
                          </p>
                          {cert.credentialId && (
                              <p className="text-xs text-muted-foreground mt-1">
                                  <TranslatedText text="Credential ID: "/> {cert.credentialId}
                              </p>
                          )}
                          {cert.skills && (
                              <div className="mt-2">
                                  <h4 className="text-xs font-semibold text-foreground mb-1"><TranslatedText text="Skills:"/></h4>
                                  <div className="flex flex-wrap gap-1">
                                      {cert.skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                                  </div>
                              </div>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
          {!showAllCerts && certifications.length > initialCertsToShow && (
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
          <h2 className="text-3xl font-bold text-center mb-12"><TranslatedText text="References"/></h2>
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {references.map((ref, index) => (
                  <Card key={index} className="flex flex-col bg-card/80">
                      <CardHeader>
                          <CardTitle className="text-xl text-primary">{ref.name}</CardTitle>
                          <CardDescription>
                              {ref.title} at {ref.company}
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

        {/* Contact Section */}
        <section id="contact" className="py-20 border-t">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold"><TranslatedText text="Let's Connect" /></h2>
            <p className="text-muted-foreground mt-4 mb-8">
              <TranslatedText text="I'm always open to discussing new projects, creative ideas, or opportunities to be part of an ambitious vision. Feel free to reach out." />
            </p>
            <div className="flex flex-col items-center gap-4 mb-8">
              <Button asChild size="lg">
                <a href="mailto:musondasalim@gmail.com">musondasalim@gmail.com</a>
              </Button>
              <div className="flex flex-col sm:flex-row gap-x-6 gap-y-2 text-muted-foreground">
                <a href="tel:+260966882901" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  <span>+260966882901</span>
                </a>
                <a href="tel:+260979287496" className="flex items-center gap-2 hover:text-primary">
                  <Phone className="h-4 w-4" />
                  <span>+260979287496</span>
                </a>
              </div>
            </div>
            <div className="flex space-x-6 justify-center">
              <SocialIcons className="flex space-x-4 justify-center" />
            </div>

            <div className="mt-12">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                <TranslatedText text="My Location" />
              </h3>
              <div className="aspect-video w-full rounded-lg overflow-hidden border shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d246306.66573356066!2d28.1402289658392!3d-15.424626159670605!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1940f513a806e22f%3A0x153b817e06553805!2sLusaka%2C%20Zambia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map of Lusaka, Zambia"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section id="services" className="py-20 border-t">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold"><TranslatedText text="Let's Build Your Vision" /></h2>
            <p className="text-muted-foreground mt-4 mb-8">
              <TranslatedText text="Have an idea for a website or mobile app? I can help you build a functional prototype to bring your vision to life. Fill out the form below with your project details to get started." />
            </p>
          </div>
          <Card className="max-w-xl mx-auto p-6 bg-card/80 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit(onOrderSubmit)}>
                <div className="mb-4">
                  <Label htmlFor="order-name" className="block text-foreground text-sm font-bold mb-2"><TranslatedText text="Name:" /></Label>
                  <Input type="text" id="order-name" {...register("name")} className="shadow appearance-none border rounded w-full py-2 px-3 bg-background/70 text-foreground leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary" />
                  {errors.name && <p className="text-destructive text-xs italic mt-1"><TranslatedText text={errors.name.message || ""} /></p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="order-email" className="block text-foreground text-sm font-bold mb-2"><TranslatedText text="Email:" /></Label>
                      <Input type="email" id="order-email" {...register("email")} className="shadow appearance-none border rounded w-full py-2 px-3 bg-background/70 text-foreground leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary" />
                      {errors.email && <p className="text-destructive text-xs italic mt-1"><TranslatedText text={errors.email.message || ""} /></p>}
                    </div>
                    <div>
                      <Label htmlFor="order-phone" className="block text-foreground text-sm font-bold mb-2"><TranslatedText text="Phone:" /></Label>
                      <Input type="tel" id="order-phone" {...register("phone")} className="shadow appearance-none border rounded w-full py-2 px-3 bg-background/70 text-foreground leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary" />
                      {errors.phone && <p className="text-destructive text-xs italic mt-1"><TranslatedText text={errors.phone.message || ""} /></p>}
                    </div>
                </div>
                <div className="mb-4">
                  <Label htmlFor="order-details" className="block text-foreground text-sm font-bold mb-2"><TranslatedText text="Project Details:" /></Label>
                  <Textarea id="order-details" rows={4} {...register("details")} className="shadow appearance-none border rounded w-full py-2 px-3 bg-background/70 text-foreground leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-primary"></Textarea>
                  {errors.details && <p className="text-destructive text-xs italic mt-1"><TranslatedText text={errors.details.message || ""} /></p>}
                </div>
                <div className="mb-6">
                  <Label htmlFor="order-attachment" className="block text-foreground text-sm font-bold mb-2"><TranslatedText text="Attach File (Optional):" /></Label>
                  <Input type="file" id="order-attachment" {...register("attachment")} className="shadow appearance-none border rounded w-full py-2 px-3 bg-background/70 text-foreground leading-tight focus:outline-none focus:shadow-outline file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 focus:ring-2 focus:ring-primary" />
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={orderStatus === 'submitting' || orderStatus === 'success'}
                    className={cn(
                      'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors min-w-[160px] justify-center',
                      orderStatus === 'submitting' && 'opacity-50 cursor-not-allowed',
                      orderStatus === 'success'
                        ? 'bg-button-success text-button-success-foreground hover:bg-button-success/90'
                        : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    )}
                  >
                    {orderStatus === 'submitting' ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <TranslatedText text="Submitting..." />
                      </>
                    ) : orderStatus === 'success' ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        <TranslatedText text="Submitted!" />
                      </>
                    ) : (
                      <TranslatedText text="Submit" />
                    )}
                  </Button>
                </div>
              </form>
          </Card>
        </section>
        
        <footer className="text-center py-6 mt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
                <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
            </p>
        </footer>
      </div>
  );
}
