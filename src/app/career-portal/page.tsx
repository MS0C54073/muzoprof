
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateCareerPortal } from '@/ai/flows/generate-career-portal-flow';
import type { CareerPortalOutput } from '@/ai/flows/generate-career-portal.types';
import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ArrowLeft, Loader2, UploadCloud, BrainCircuit, Linkedin, Github, Globe, Mail, Phone, Briefcase, GraduationCap, Code, Sparkles, AlertTriangle } from 'lucide-react';
import { SocialIcons } from '@/components/social-icons';
import { Badge } from '@/components/ui/badge';

const uploadSchema = z.object({
    resume: z.any()
        .refine((files) => files?.length === 1, 'Resume PDF is required.')
        .refine((files) => files?.[0]?.type === 'application/pdf', 'Only PDF files are accepted.')
        .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, 'File size must be less than 5MB.'),
});
type UploadFormData = z.infer<typeof uploadSchema>;

// Helper function to read a file as a Data URI
const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};


const RenderPortal = ({ data }: { data: CareerPortalOutput }) => (
    <Card className="shadow-lg mt-8">
        <CardHeader className="text-center p-8 bg-muted/30">
            <CardTitle className="text-4xl font-bold text-primary">{data.name}</CardTitle>
            <CardDescription className="text-xl text-muted-foreground">{data.title}</CardDescription>
            <div className="flex justify-center gap-4 mt-4">
                {data.contact.email && <Button variant="ghost" size="icon" asChild><a href={`mailto:${data.contact.email}`}><Mail /></a></Button>}
                {data.contact.phone && <Button variant="ghost" size="icon" asChild><a href={`tel:${data.contact.phone}`}><Phone /></a></Button>}
                {data.contact.linkedin && <Button variant="ghost" size="icon" asChild><a href={data.contact.linkedin} target="_blank"><Linkedin /></a></Button>}
                {data.contact.github && <Button variant="ghost" size="icon" asChild><a href={data.contact.github} target="_blank"><Github /></a></Button>}
                {data.contact.website && <Button variant="ghost" size="icon" asChild><a href={data.contact.website} target="_blank"><Globe /></a></Button>}
            </div>
        </CardHeader>
        <CardContent className="p-8 space-y-10">
            <section>
                <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2"><Sparkles /> Summary</h3>
                <p className="text-muted-foreground">{data.summary}</p>
            </section>

            {data.skills?.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2"><Code /> Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
                    </div>
                </section>
            )}

            {data.experience?.length > 0 && (
                 <section>
                    <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2"><Briefcase /> Experience</h3>
                    <div className="space-y-6 relative pl-4 border-l-2 border-primary/20">
                        {data.experience.map((job, i) => (
                            <div key={i} className="pl-4">
                                <span className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-primary"></span>
                                <p className="text-sm text-muted-foreground">{job.duration}</p>
                                <h4 className="text-lg font-semibold">{job.title}</h4>
                                <p className="text-md text-muted-foreground font-medium">{job.company}</p>
                                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                                    {job.details.map((detail, j) => <li key={j}>{detail}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.education?.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-accent mb-4 flex items-center gap-2"><GraduationCap /> Education</h3>
                     <div className="space-y-4">
                        {data.education.map((edu, i) => (
                            <div key={i}>
                                <p className="text-sm text-muted-foreground">{edu.duration}</p>
                                <h4 className="text-lg font-semibold">{edu.degree}</h4>
                                <p className="text-md text-muted-foreground font-medium">{edu.university}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {data.projects?.length > 0 && (
                <section>
                    <h3 className="text-2xl font-bold text-accent mb-4">Projects</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.projects.map((proj, i) => (
                             <Card key={i} className="bg-muted/30">
                                <CardHeader>
                                    <CardTitle className="text-md">{proj.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{proj.description}</p>
                                    {proj.link && <Button variant="link" asChild className="p-0 h-auto mt-2"><a href={proj.link} target="_blank">View Project</a></Button>}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            )}
        </CardContent>
    </Card>
);

export default function CareerPortalPage() {
    const { toast } = useToast();
    const [portalData, setPortalData] = useState<CareerPortalOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors } } = useForm<UploadFormData>({
        resolver: zodResolver(uploadSchema),
    });

    const onSubmit: SubmitHandler<UploadFormData> = async (data) => {
        setLoading(true);
        setError(null);
        setPortalData(null);
        try {
            const file = data.resume[0];
            const resumePdfDataUri = await fileToDataUri(file);
            
            const result = await generateCareerPortal({ resumePdfDataUri });
            setPortalData(result);
            toast({
                variant: 'success',
                title: 'Portal Generated!',
                description: 'Your personal career portal has been created below.',
            });
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
            setError(`Failed to generate career portal: ${errorMessage}`);
             toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: errorMessage,
            });
        } finally {
            setLoading(false);
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
                    <BrainCircuit className="h-10 w-10 text-primary" />
                    <h1 className="text-4xl font-bold text-primary">
                        <TranslatedText text="AI Career Portal Generator" />
                    </h1>
                </div>
                <p className="text-muted-foreground mt-2 text-lg">
                    <TranslatedText text="Upload your PDF resume and let AI create a personal career landing page for you." />
                </p>
            </header>

            <main className="flex-grow">
                <Card className="shadow-lg max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle><TranslatedText text="Upload Your Resume" /></CardTitle>
                        <CardDescription>
                            <TranslatedText text="Your resume is only used for generating the portal and is not stored on our servers." />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label htmlFor="resume-upload"><TranslatedText text="Resume PDF (Max 5MB)" /></Label>
                                <Input id="resume-upload" type="file" accept="application/pdf" {...register("resume")} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"/>
                                {errors.resume && <p className="text-destructive text-xs italic mt-1">{errors.resume.message as string}</p>}
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        <TranslatedText text="Generating..." />
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud className="mr-2 h-4 w-4" />
                                        <TranslatedText text="Generate Portal" />
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="max-w-4xl mx-auto mt-8">
                     {error && (
                        <Card className="bg-destructive/10 border-destructive text-destructive-foreground">
                            <CardHeader className="flex-row items-center gap-4">
                                <AlertTriangle />
                                <CardTitle>Generation Failed</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>{error}</p>
                            </CardContent>
                        </Card>
                    )}
                    {portalData && <RenderPortal data={portalData} />}
                </div>

            </main>

            <footer className="text-center py-6 mt-8 border-t border-border">
                <div className="flex flex-col items-center gap-4">
                    <SocialIcons className="flex space-x-4 justify-center" />
                    <p className="text-sm text-muted-foreground">
                        <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
                    </p>
                </div>
            </footer>
        </div>
    );
}
