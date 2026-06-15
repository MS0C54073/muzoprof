'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateCoverLetter } from '@/ai/flows/generate-cover-letter-flow';
import type { CoverLetterOutput } from '@/ai/flows/generate-cover-letter.types';
import TranslatedText from '@/app/components/translated-text';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Loader2, Sparkles, Copy, Check, FileText, BrainCircuit, Briefcase } from 'lucide-react';
import { SocialIcons } from '@/components/social-icons';
import { Badge } from '@/components/ui/badge';

// Consolidated profile summary synchronized with the main portfolio
const MY_PROFILE = {
    name: "Musonda Salimu",
    title: "IT Professional | Software Developer | AI Specialist",
    summary: "I am a curious and driven professional with a background in system administration, software engineering, and AI. I enjoy solving real problems across the stack, from designing system architecture and managing CI/CD workflows and Kubernetes environments, to connecting LLMs to proprietary databases and automating workflows with platforms like N8N and Supabase. I make active use of AI tools including Cursor AI, Claude, ChatGPT, and Gemini to move faster and build better, while keeping a strong focus on performance, security, and maintainability.",
    skills: ["Laravel", ".NET", "Javascript", "TypeScript", "React", "Next.js", "AI & Automation", "Kubernetes", "CI/CD", "PostgreSQL", "Supabase", "Python", "N8N", "System Admin"],
    experience: [
        {
            title: "AI Content Evaluation Specialist",
            company: "Invisible Technologies & Outlier",
            duration: "Aug 2024 – Sep 2025",
            details: ["Evaluated AI-generated content", "Solved complex coding problems", "Developed test cases"]
        },
        {
            title: "IT Support Volunteer & Technical Assistant",
            company: "Embassy of the Republic of Zambia, Moscow",
            duration: "May 2025 – Jul 2025",
            details: ["Maintained critical embassy IT infrastructure", "Provided proactive technical support"]
        }
    ]
};

const formSchema = z.object({
    jobDescription: z.string().min(50, { message: 'Please provide a more detailed job description (min 50 chars).' }),
});
type FormData = z.infer<typeof formSchema>;

export default function CoverLetterGeneratorPage() {
    const { toast } = useToast();
    const [result, setResult] = useState<CoverLetterOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        setLoading(true);
        setResult(null);
        try {
            const output = await generateCoverLetter({
                jobDescription: data.jobDescription,
                userProfile: MY_PROFILE,
            });
            setResult(output);
            toast({
                variant: 'success',
                title: 'Cover Letter Generated!',
                description: 'Aligned with your portfolio and specialist profile.',
            });
        } catch (err) {
            console.error(err);
            toast({
                variant: 'destructive',
                title: 'Generation Failed',
                description: err instanceof Error ? err.message : 'An unexpected error occurred.',
            });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({ title: "Copied to clipboard!" });
    };

    return (
        <div className="container mx-auto py-8 md:py-12 px-4 md:px-8 lg:px-12 min-h-screen flex flex-col">
            <header className="mb-8 md:mb-12">
                <Button variant="outline" asChild className="mb-6 rounded-full shadow-sm">
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <TranslatedText text="Back to Home" />
                    </Link>
                </Button>
                <div className="flex items-center space-x-3">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                        <FileText className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                    </div>
                    <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight">
                        <TranslatedText text="AI Cover Letter Specialist" />
                    </h1>
                </div>
                <p className="text-muted-foreground mt-2 text-lg">
                    <TranslatedText text="Align your specialist portfolio with any job advert to generate a powerful, targeted cover letter." />
                </p>
            </header>

            <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-grow">
                <div className="space-y-6">
                    <Card className="shadow-lg border-none bg-card/60 backdrop-blur-md rounded-[2rem]">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2"><Briefcase className="h-5 w-5 text-accent" /> <TranslatedText text="Job Advertisement" /></CardTitle>
                            <CardDescription><TranslatedText text="Paste the job requirements or description below." /></CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="job-desc" className="font-bold"><TranslatedText text="Description Text" /></Label>
                                    <Textarea 
                                        id="job-desc" 
                                        {...register("jobDescription")} 
                                        placeholder="e.g., We are looking for a Software Engineer with experience in Next.js, AI integration, and Kubernetes..."
                                        className="min-h-[300px] rounded-2xl border-2 bg-background/50 p-4 focus:ring-primary"
                                    />
                                    {errors.jobDescription && <p className="text-destructive text-xs italic font-bold">{errors.jobDescription.message}</p>}
                                </div>
                                <Button type="submit" disabled={loading} className="w-full h-14 rounded-full font-black text-lg shadow-xl bg-gradient-to-r from-primary to-accent hover:scale-[1.02] transition-transform">
                                    {loading ? (
                                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /><TranslatedText text="Aligning Portfolio..." /></>
                                    ) : (
                                        <><Sparkles className="mr-2 h-5 w-5" /><TranslatedText text="Generate Specialist Letter" /></>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5 border-none shadow-sm rounded-2xl p-6">
                        <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                            <BrainCircuit className="h-4 w-4" /> <TranslatedText text="Specialist Profile Used" />
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {MY_PROFILE.skills.map(s => <Badge key={s} variant="secondary" className="bg-background">{s}</Badge>)}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    {result ? (
                        <Card className="shadow-2xl border-none bg-card rounded-[2rem] overflow-hidden sticky top-24">
                            <CardHeader className="bg-primary text-primary-foreground p-8">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl font-black"><TranslatedText text="Generated Cover Letter" /></CardTitle>
                                        <CardDescription className="text-primary-foreground/70"><TranslatedText text="Positioned as an AI & Software Specialist." /></CardDescription>
                                    </div>
                                    <Button size="icon" variant="ghost" onClick={copyToClipboard} className="text-white hover:bg-white/20">
                                        {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 prose prose-slate dark:prose-invert max-w-none">
                                <div className="whitespace-pre-wrap font-medium text-foreground leading-relaxed">
                                    {result.coverLetter}
                                </div>
                            </CardContent>
                            <CardFooter className="bg-muted/30 p-6 border-t">
                                <div className="space-y-2">
                                    <p className="text-xs font-black uppercase text-muted-foreground tracking-tighter"><TranslatedText text="AI Reasoning & Alignment" /></p>
                                    <p className="text-sm italic text-muted-foreground">{result.reasoning}</p>
                                </div>
                            </CardFooter>
                        </Card>
                    ) : (
                        <div className="h-full min-h-[400px] border-4 border-dashed border-muted rounded-[2rem] flex flex-col items-center justify-center text-center p-12 space-y-4">
                            <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                                <FileText className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <div className="max-w-xs">
                                <h3 className="text-xl font-bold text-muted-foreground"><TranslatedText text="Ready to Generate" /></h3>
                                <p className="text-sm text-muted-foreground/60"><TranslatedText text="Paste a job advert and click generate to see your specialist cover letter here." /></p>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="text-center py-10 border-t border-border/50 mt-12">
                <div className="flex flex-col items-center gap-6">
                    <SocialIcons className="flex space-x-6 justify-center" />
                    <p className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
                        <TranslatedText text="© 2026 Musonda Salimu. All Rights Reserved." />
                    </p>
                </div>
            </footer>
        </div>
    );
}
