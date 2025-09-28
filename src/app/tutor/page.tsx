

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { jsPDF } from 'jspdf';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Check, Loader2, Mail, Send, Bot, Code, Globe, BrainCircuit, Smartphone, Database, Server, Shield, Terminal, Eye, Download } from 'lucide-react';
import TranslatedText from '@/app/components/translated-text';
import { SocialIcons } from '@/components/social-icons';
import { englishMaterials, type Material } from './teaching-materials';


const requestSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'A valid email is required' }),
  phone: z.string().optional(),
  details: z.string().min(10, { message: 'Please provide some details about your learning needs.' }),
  attachment: z.any().optional(),
});
type RequestFormData = z.infer<typeof requestSchema>;

const experiences = [
    { title: 'Specialized English Teacher', details: 'Focused on Business English, IT English, and Aviation English, tailoring lessons to individual student needs.' },
    { title: 'Programming Teacher', details: 'Conducted lessons in English for Roblox Studio, Python, Unity, and Figma, integrating technology and creativity.' },
    { title: 'Online English Tutor', details: 'Extensive experience teaching different age groups and developing personalized learning plans.' },
    { title: 'EF Education First & CME', details: 'Taught English to children and teenagers, planned lessons, provided assessments, and organized engaging extracurriculars.' },
    { title: 'Oxford Linguistic Centre', details: 'Led English Summer Programs, creating safe and fun language immersion experiences.' },
    { title: 'FillCamp', details: 'Conducted group English lessons and supervised educational activities for children.' },
];

const offerings = [
    'One-on-one online tutoring',
    'Flexible scheduling to fit your life',
    'Customized learning programs (conversation, grammar, test prep, business English)',
    'Patient, supportive, and student-focused approach',
];

const programmingOfferings = [
    { title: 'Python', icon: <Code className="h-5 w-5 mr-2 text-primary" />, description: 'Master the fundamentals of Python, one of the most popular and versatile programming languages.' },
    { title: 'Web Development', icon: <Globe className="h-5 w-5 mr-2 text-primary" />, description: 'Build modern websites and web applications using technologies like Next.js and React.' },
    { title: 'Agent Development', icon: <BrainCircuit className="h-5 w-5 mr-2 text-primary" />, description: 'Learn to create intelligent AI agents and chatbots with modern frameworks.' },
    { title: 'App Development', icon: <Smartphone className="h-5 w-5 mr-2 text-primary" />, description: 'Create mobile applications for iOS and Android.' },
    { title: 'Roblox Studio', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Learn to create your own games and experiences on the Roblox platform.' },
    { title: 'Unity', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Dive into game development with Unity, a powerful engine for creating 2D and 3D games.' },
    { title: 'Figma', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Develop skills in UI/UX design using Figma, a leading tool for interface design and prototyping.' },
    { title: 'Databases', icon: <Database className="h-5 w-5 mr-2 text-primary" />, description: 'Understand how to design, use, and manage SQL and NoSQL databases.' },
    { title: 'IT Support', icon: <Server className="h-5 w-5 mr-2 text-primary" />, description: 'Gain practical skills for troubleshooting hardware, software, and network issues.' },
    { title: 'Introduction to Cybersecurity', icon: <Shield className="h-5 w-5 mr-2 text-primary" />, description: 'Learn the basic principles of protecting systems and data from cyber threats.' },
    { title: 'Linux', icon: <Terminal className="h-5 w-5 mr-2 text-primary" />, description: 'Get comfortable with the Linux command line and operating system fundamentals.' },
];

const tutorCertifications = [
    { title: 'Teacher Of English To Speakers Of Other Languages (TEFL)', issuer: 'Teacher Record', date: 'Issued Sep 2023', credentialId: 'TR2672252278' },
    { title: 'EF SET English Certificate', issuer: 'EF SET', date: 'Issued Sep 2024', credentialId: null },
    { title: 'Teach English Now! Foundational Principles', issuer: 'Arizona State University (via Coursera)', date: 'Completed Sep 2024', credentialId: null },
];

const MaterialsAccordion = ({ materials }: { materials: Material[] }) => {
    if (!materials || materials.length === 0) {
        return null;
    }

    return (
        <Accordion type="multiple" className="w-full">
            {materials.map((material, index) => (
                <AccordionItem value={`${material.title}-${index}`} key={`${material.title}-${index}`}>
                    <AccordionTrigger>{material.title}</AccordionTrigger>
                    <AccordionContent className="pl-4">
                        {material.children && material.children.length > 0 ? (
                            <MaterialsAccordion materials={material.children} />
                        ) : (
                            <p className="text-muted-foreground italic">End of section.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
};


export default function TutorPage() {
  const { toast } = useToast();
  const [requestStatus, setRequestStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [isGenerating, setIsGenerating] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });
  
  const generateTutorCv = (outputType: 'preview' | 'download') => {
        setIsGenerating(true);
        try {
            const cvData = {
                name: "Musonda Salimu",
                jobTitle: "English & Technology Tutor | TEFL Certified",
                contact: {
                    email: "musondasalim@gmail.com",
                    phone1: "+260 977 288 260",
                    phone2: "+260 979 287 496",
                    linkedin: "linkedin.com/in/musonda-salimu-a4a0b31b9",
                },
                summary: "A patient and adaptable TEFL-certified educator with a Master's degree and over 6 years of experience teaching English and technology online. Proven ability to create customized learning plans for a diverse range of learners, from children to adults. Specializes in Business English (Market Leader series), General English (Life series), and exam preparation. Fosters a supportive environment that builds student confidence and achieves learning objectives.",
                skills: [
                    "English Language Teaching (TEFL)", "Curriculum & Lesson Planning", "Student Assessment & Feedback",
                    "Python Programming", "Web Development (HTML, CSS, JS)", "Roblox & Unity Game Design",
                    "One-on-One & Group Tutoring", "Online Teaching Platforms", "Communication & Interpersonal Skills"
                ],
                experience: [
                    { title: 'Specialized English Teacher', company: 'Online', duration: '2021 – Present', details: 'Focused on Business English, IT English, and Aviation English, tailoring lessons to individual student needs.' },
                    { title: 'Programming Teacher', company: 'Online', duration: '2021 – Present', details: 'Conducted lessons in English for Roblox Studio, Python, Unity, and Figma, integrating technology and creativity.' },
                    { title: 'Online English Tutor', company: 'Multiple Platforms', duration: '2020 – Present', details: 'Extensive experience teaching different age groups and developing personalized learning plans.' },
                    { title: 'EF Education First & CME', company: 'St. Petersburg, Russia', duration: '2019 – 2020', details: 'Taught English to children and teenagers, planned lessons, provided assessments, and organized engaging extracurriculars.' },
                    { title: 'Oxford Linguistic Centre', company: 'Kursk, Russia', duration: 'Summer 2019', details: 'Led English Summer Programs, creating safe and fun language immersion experiences.' },
                    { title: 'FillCamp', company: 'Kursk, Russia', duration: 'Summer 2018', details: 'Conducted group English lessons and supervised educational activities for children.' },
                ],
                education: [
                    { degree: "MSc, Informatics and Computer Engineering", university: "Novosibirsk State Technical University", duration: "2022 - 2024" },
                    { degree: "BSc, Software and Administration of Information Systems", university: "Kursk State University", duration: "2017 - 2021" },
                ],
                certifications: [
                    { title: 'Teacher Of English To Speakers Of Other Languages (TEFL)', issuer: 'Teacher Record', date: 'Issued Sep 2023', credentialId: 'TR2672252278' },
                    { title: 'EF SET English Certificate', issuer: 'EF SET', date: 'Issued Sep 2024' },
                    { title: 'Teach English Now! Foundational Principles', issuer: 'Arizona State University (via Coursera)', date: 'Completed Sep 2024' },
                ]
            };

            const doc = new jsPDF({ unit: 'px', format: 'a4' });
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
                doc.setTextColor(37, 99, 235);
                doc.text(title.toUpperCase(), margin, yPos);
                const titleHeight = 11;
                const lineY = yPos + titleHeight / 2 + 1;
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.5);
                doc.line(margin + doc.getTextWidth(title) + 5, lineY, pageWidth - margin, lineY);
                return yPos + titleHeight + 4;
            };

            // --- Header ---
            y = margin;
            doc.setFontSize(24);
            doc.setFont('Helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            doc.text(cvData.name, margin, y);
            y += 20;
            
            doc.setFontSize(11);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(82, 82, 91);
            doc.text(cvData.jobTitle, margin, y);
            y += 15;

            doc.setFontSize(9);
            doc.text(`${cvData.contact.email}  •  ${cvData.contact.phone1}  •  ${cvData.contact.linkedin}`, margin, y);
            y += 5;
            
            // --- Summary ---
            y = addSectionTitle("Professional Summary", y + 15);
            doc.setFontSize(9);
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(51, 65, 85);
            const summaryLines = doc.splitTextToSize(cvData.summary, contentWidth);
            doc.text(summaryLines, margin, y);
            y += summaryLines.length * 9 * lineHeight;

            // --- Core Competencies ---
            y = addSectionTitle("Skills & Competencies", y);
            doc.setFontSize(9);
            const colWidth = contentWidth / 3;
            const skillsPerCol = Math.ceil(cvData.skills.length / 3);
            let maxSkillY = y;
            for (let i = 0; i < 3; i++) {
                const colSkills = cvData.skills.slice(i * skillsPerCol, (i + 1) * skillsPerCol);
                let currentY = y;
                colSkills.forEach(skill => {
                    checkPageBreak(9 * lineHeight);
                    doc.text(`•  ${skill}`, margin + i * colWidth, currentY);
                    currentY += 9 * lineHeight;
                });
                maxSkillY = Math.max(maxSkillY, currentY);
            }
            y = maxSkillY;

            // --- Teaching Experience ---
            y = addSectionTitle("Teaching Experience", y);
            cvData.experience.forEach(exp => {
                checkPageBreak(30);
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
                y += 12;
            });
            
            // --- Certifications ---
            y = addSectionTitle("Certifications", y);
            cvData.certifications.forEach(cert => {
                checkPageBreak(25);
                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.text(cert.title, margin, y);
                y += 10 * lineHeight;
                doc.setFontSize(9);
                doc.setFont('Helvetica', 'normal');
                doc.text(`${cert.issuer}  •  ${cert.date}`, margin, y);
                 if (cert.credentialId) {
                    y += 9 * lineHeight;
                    doc.text(`Credential ID: ${cert.credentialId}`, margin, y);
                }
                y += 12;
            });

             // --- Education ---
            y = addSectionTitle("Education", y);
            cvData.education.forEach(edu => {
                checkPageBreak(20);
                doc.setFontSize(10);
                doc.setFont('Helvetica', 'bold');
                doc.text(edu.degree, margin, y);
                doc.setFont('Helvetica', 'normal');
                doc.text(edu.duration, pageWidth - margin, y, { align: 'right' });
                y += 10 * lineHeight;
                doc.setFontSize(9);
                doc.setFont('Helvetica', 'italic');
                doc.text(edu.university, margin, y);
                y += 12;
            });

            if (outputType === 'preview') {
                doc.output('dataurlnewwindow');
            } else {
                doc.save('Musonda_Salimu_Tutor_CV.pdf');
            }

        } catch (error) {
            console.error("Error generating Tutor CV PDF:", error);
            toast({
                variant: 'destructive',
                title: 'PDF Generation Failed',
                description: 'There was an error creating the CV. Please try again.',
            });
        } finally {
            setIsGenerating(false);
        }
    };

  const onSubmit: SubmitHandler<RequestFormData> = async (data) => {
    setRequestStatus('submitting');
    try {
      const file = data.attachment?.[0];
      let attachmentUrl = null;
      let attachmentName = null;

      if (file) {
        attachmentName = file.name;
        const storageRef = ref(storage, `tutoring-requests/${Date.now()}_${attachmentName}`);
        await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(storageRef);
      }

      const functions = getFunctions(app);
      const processOrder = httpsCallable(functions, 'processOrder');
      
      const payload = {
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        details: `TUTORING REQUEST: ${data.details}`,
        attachmentName,
        attachmentUrl,
      };
      
      await processOrder(payload);

      toast({
        variant: 'success',
        title: 'Request Sent!',
        description: "Thank you for your interest! I'll get back to you shortly to discuss your learning journey.",
      });
      setRequestStatus('success');
      reset();
    } catch (error) {
      console.error("Error submitting tutoring request: ", error);
      toast({
        variant: 'destructive',
        title: 'Submission Failed',
        description: 'An unexpected error occurred. Please try again or contact me directly via email.',
      });
      setRequestStatus('error');
    } finally {
        setTimeout(() => setRequestStatus('idle'), 5000);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 md:px-6 lg:px-8 min-h-screen flex flex-col">
      <header className="mb-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <TranslatedText text="Back to Home" />
          </Link>
        </Button>
        <div className="flex items-center space-x-3">
          <BookOpen className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold text-primary">
            <TranslatedText text="English & Tech Tutoring" />
          </h1>
        </div>
        <p className="text-muted-foreground mt-2 text-lg">
            <TranslatedText text="Personalized online lessons for children, teenagers, and adults." />
        </p>
      </header>

      <main className="flex-grow">
      
        <section className="mb-12">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle><TranslatedText text="About My Teaching"/></CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">
                        <TranslatedText text="As a patient and adaptable TEFL-certified educator with over 6 years of experience, I specialize in creating customized online learning experiences. I have a passion for teaching both English and technology to a diverse range of learners, from young children to professionals. My expertise covers General English (using the Life series), Business English (Market Leader series), and comprehensive exam preparation for Cambridge exams. I am experienced in teaching all age groups, including children, teenagers, and adults, and I'm committed to building a supportive and confident learning environment for every student."/>
                    </p>
                </CardContent>
            </Card>
        </section>

        <section className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            <Card className="shadow-lg h-full">
              <CardHeader className="p-0">
                  <Image
                    src="https://drive.google.com/uc?id=1dteuS0zoNLTLo_oVjkFlPPW5CCyn2Wd9"
                    alt="Online Tutoring Session"
                    width={800}
                    height={400}
                    data-ai-hint="online tutoring"
                    className="rounded-t-lg w-full h-auto object-cover"
                  />
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="mb-4"><TranslatedText text="My Experience Includes" /></CardTitle>
                <div className="space-y-4">
                  {experiences.map((exp, index) => (
                    <div key={index}>
                        <h4 className="font-semibold text-accent">{exp.title}</h4>
                        <p className="text-sm text-muted-foreground">{exp.details}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle><TranslatedText text="What I Offer" /></CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside space-y-2">
                    {offerings.map((offer, index) => (
                        <li key={index} className="text-muted-foreground">{offer}</li>
                    ))}
                </ul>
                <div className="mt-6 pt-6 border-t">
                    <CardTitle className="mb-4 text-lg"><TranslatedText text="Download My Tutoring CV"/></CardTitle>
                     <div className="flex flex-col gap-3">
                         <Button onClick={() => generateTutorCv('preview')} variant="outline" disabled={isGenerating}>
                             {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                             <TranslatedText text="Preview CV" />
                         </Button>
                         <Button onClick={() => generateTutorCv('download')} disabled={isGenerating}>
                             {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                             <TranslatedText text="Download CV" />
                         </Button>
                    </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="certifications" className="py-20 border-t mt-12">
            <h2 className="text-3xl font-bold text-center mb-12">
                <TranslatedText text="Teaching Certifications" />
            </h2>
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorCertifications.map((cert, index) => (
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
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>

        <section id="materials" className="py-20 border-t mt-12">
            <h2 className="text-3xl font-bold text-center mb-12">
                <TranslatedText text="Teaching Areas & Materials" />
            </h2>
            <Tabs defaultValue="english" className="w-full max-w-4xl mx-auto">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="english">English</TabsTrigger>
                    <TabsTrigger value="programming">Programming</TabsTrigger>
                </TabsList>
                <TabsContent value="english">
                    <Card>
                        <CardHeader>
                            <CardTitle><TranslatedText text="English Teaching Materials" /></CardTitle>
                            <CardDescription>
                                <TranslatedText text="A selection of the books and resources I use, tailored to different levels and needs." />
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MaterialsAccordion materials={englishMaterials} />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="programming">
                    <Card>
                        <CardHeader>
                            <CardTitle><TranslatedText text="Programming & Tech Courses" /></CardTitle>
                            <CardDescription>
                                <TranslatedText text="Introduction to programming and technology concepts, taught in English." />
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {programmingOfferings.map(p => (
                                <div key={p.title} className="flex items-start">
                                    {p.icon}
                                    <div>
                                        <h4 className="font-semibold">{p.title}</h4>
                                        <p className="text-sm text-muted-foreground">{p.description}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </section>

        <section id="contact-tutor" className="py-20 border-t mt-12">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold"><TranslatedText text="Start Your Learning Journey" /></h2>
            <p className="text-muted-foreground mt-4 mb-8">
              <TranslatedText text="Contact me today to schedule your first lesson. Fill out the form below, and I'll get back to you to discuss your goals and create a customized learning plan." />
            </p>
          </div>
          <Card className="max-w-xl mx-auto p-6 bg-card/80 backdrop-blur-sm shadow-xl">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <Label htmlFor="tutor-name"><TranslatedText text="Your Name" /></Label>
                  <Input id="tutor-name" {...register("name")} />
                  {errors.name && <p className="text-destructive text-xs italic mt-1">{errors.name.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="tutor-email"><TranslatedText text="Email Address" /></Label>
                        <Input id="tutor-email" type="email" {...register("email")} />
                        {errors.email && <p className="text-destructive text-xs italic mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                        <Label htmlFor="tutor-phone"><TranslatedText text="Phone (Optional)" /></Label>
                        <Input id="tutor-phone" type="tel" {...register("phone")} />
                    </div>
                </div>
                <div className="mb-6">
                  <Label htmlFor="tutor-details"><TranslatedText text="What would you like to learn?" /></Label>
                  <Textarea id="tutor-details" {...register("details")} placeholder="e.g., Business English, Python basics for my child, conversational practice..." />
                  {errors.details && <p className="text-destructive text-xs italic mt-1">{errors.details.message}</p>}
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    type="submit"
                    disabled={requestStatus === 'submitting' || requestStatus === 'success'}
                    className={cn(
                      'font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors min-w-[160px] justify-center',
                      requestStatus === 'submitting' && 'opacity-50 cursor-not-allowed',
                      requestStatus === 'success'
                        ? 'bg-button-success text-button-success-foreground hover:bg-button-success/90'
                        : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    )}
                  >
                    {requestStatus === 'submitting' ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> <TranslatedText text="Sending..." /></>
                    ) : requestStatus === 'success' ? (
                      <><Check className="mr-2 h-4 w-4" /> <TranslatedText text="Sent!" /></>
                    ) : (
                      <><Send className="mr-2 h-4 w-4" /> <TranslatedText text="Send Request" /></>
                    )}
                  </Button>
                </div>
              </form>
          </Card>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-border mt-12">
        <div className="flex flex-col items-center gap-4">
            <SocialIcons className="flex space-x-4 justify-center" />
            <p className="text-sm text-muted-foreground">
                <TranslatedText text="© 2025 Musonda Salimu. All Rights Reserved." />
            </p>
        </div>
      </footer>
    </div>
  );
}

    