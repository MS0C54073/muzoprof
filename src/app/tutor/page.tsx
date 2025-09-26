
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, storage } from '@/lib/firebase-client';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Check, Loader2, Mail, Send, Bot, Code } from 'lucide-react';
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
    { title: 'Roblox Studio', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Learn to create your own games and experiences on the Roblox platform.' },
    { title: 'Python', icon: <Code className="h-5 w-5 mr-2 text-primary" />, description: 'Master the fundamentals of Python, one of the most popular and versatile programming languages.' },
    { title: 'Unity', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Dive into game development with Unity, a powerful engine for creating 2D and 3D games.' },
    { title: 'Figma', icon: <Bot className="h-5 w-5 mr-2 text-primary" />, description: 'Develop skills in UI/UX design using Figma, a leading tool for interface design and prototyping.' },
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RequestFormData>({
    resolver: zodResolver(requestSchema),
  });

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
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="materials" className="py-20 border-t mt-20">
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
                        <CardContent className="space-y-4">
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

    