'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import TranslatedText from '@/app/components/translated-text';
import { ArrowLeft, Calculator, Download, GraduationCap, Mail, Send } from 'lucide-react';
import { WhatsappIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

// --- Configuration Object for easy editing ---
const serviceConfig = {
  vatRate: 0.16, // 16%
  currencies: {
    USD: { name: 'US Dollar', symbol: '$', rate: 1 },
    ZMW: { name: 'Zambian Kwacha', symbol: 'K', rate: 19.77 }, // Example rate, updatable
  },
  services: {
    lesson_enrollment: {
      name: 'Lesson Enrollment (Single Session)',
      baseRate: 10,
      unit: 'hour',
      features: [
        { id: 'group_session', name: 'Group Session Discount (per person)', price: -2 },
        { id: 'exam_prep', name: 'Intensive Exam Preparation', price: 3 },
      ],
      lessonTypes: [
        { id: 'general_english', name: 'General English', price: 0 },
        { id: 'business_english', name: 'Business English', price: 5 },
        { id: 'it_english', name: 'IT English', price: 5 },
        { id: 'python_programming', name: 'Python Programming', price: 7 },
        { id: 'web_dev_intro', name: 'Web Development (Intro)', price: 7 },
      ],
    },
     lesson_packages: {
      name: 'Monthly Lesson Package',
      baseRate: 80, // Base for 1 month (2 lessons/week * 4 weeks * $10/hr)
      unit: 'month',
      features: [
        { id: 'add_1_hour', name: 'Add 1 extra lesson-hour per week', price: 40 },
        { id: 'add_2_hours', name: 'Add 2 extra lesson-hours per week', price: 80 },
      ],
      lessonTypes: [
        { id: 'general_english_pack', name: 'General English', price: 0 },
        { id: 'business_english_pack', name: 'Business English', price: 15 },
        { id: 'it_english_pack', name: 'IT English', price: 15 },
        { id: 'python_programming_pack', name: 'Python Programming', price: 25 },
        { id: 'web_dev_intro_pack', name: 'Web Development (Intro)', price: 25 },
      ],
    },
    landing_page: {
      name: 'Landing Page',
      baseRate: 200,
      unit: 'project',
      features: [
        { id: 'copywriting', name: 'Professional Copywriting', price: 100 },
        { id: 'lead_capture_form', name: 'Lead Capture Form Integration', price: 50 },
        { id: 'analytics_setup', name: 'Analytics & Tracking Setup', price: 75 },
      ],
    },
    web_development: {
      name: 'Web Development',
      baseRate: 450,
      unit: 'project',
      features: [
        { id: 'ui_design', name: 'UI/UX Design', price: 150 },
        { id: 'ai_automation', name: 'AI automation(Bots, Workflows e.t.c)', price: 200 },
        { id: 'cms', name: 'CMS Integration', price: 180 },
        { id: 'ecommerce', name: 'E-commerce Functionality', price: 300 },
      ],
    },
    software_development: {
      name: 'Software Development',
      baseRate: 600,
      unit: 'project',
      features: [
        { id: 'api_dev', name: 'Custom API Development', price: 250 },
        { id: 'db_design', name: 'Database Architecture', price: 200 },
        { id: 'third_party_integration', name: 'Third-party Integrations', price: 200 },
      ],
    },
    mobile_app_development: {
      name: 'Mobile App Development (Cross-Platform)',
      baseRate: 900,
      unit: 'project',
      features: [
        { id: 'platform_ios', name: 'iOS App', price: 250 },
        { id: 'platform_android', name: 'Android App', price: 250 },
        { id: 'platform_web', name: 'Web App (PWA)', price: 400 },
        { id: 'push_notifications', name: 'Push Notifications', price: 150 },
        { id: 'in_app_purchases', name: 'In-App Purchases', price: 200 },
      ],
    },
    prototypes: {
      name: 'Prototypes (Web, Mobile, System Demos)',
      baseRate: 250,
      unit: 'prototype',
      features: [
        { id: 'interactive_mockup', name: 'Interactive Mockup', price: 100 },
        { id: 'basic_backend', name: 'Basic Backend Logic', price: 150 },
      ],
    },
    full_systems: {
      name: 'Full Systems (End-to-End Solutions)',
      baseRate: 2500,
      unit: 'system',
      features: [
        { id: 'cloud_hosting', name: 'Cloud Hosting Setup', price: 200 },
        { id: 'ci_cd', name: 'CI/CD Pipeline', price: 300 },
        { id: 'ongoing_support', name: 'Ongoing Support Contract', price: 600 },
      ],
    },
     ai_ml: {
      name: 'AI & Machine Learning',
      baseRate: 700,
      unit: 'project',
      features: [
        { id: 'data_preprocessing', name: 'Data Preprocessing & Cleaning', price: 200 },
        { id: 'model_training', name: 'Custom Model Training', price: 350 },
        { id: 'api_deployment', name: 'Model API Deployment', price: 250 },
      ],
    },
    data_analytics: {
      name: 'Data Analytics & BI',
      baseRate: 500,
      unit: 'project',
      features: [
        { id: 'dashboard_dev', name: 'Interactive Dashboard Dev', price: 250 },
        { id: 'data_warehousing', name: 'Data Warehousing', price: 400 },
        { id: 'etl_pipelines', name: 'ETL Pipelines', price: 300 },
      ],
    },
     ui_ux_design: {
      name: 'UI/UX Design',
      baseRate: 300,
      unit: 'project',
      features: [
        { id: 'wireframing', name: 'Wireframing', price: 100 },
        { id: 'high_fidelity_mockups', name: 'High-Fidelity Mockups', price: 200 },
        { id: 'design_system', name: 'Design System Creation', price: 250 },
      ],
    },
    seo_marketing: {
      name: 'SEO & Digital Marketing',
      baseRate: 200,
      unit: 'month',
      features: [
        { id: 'keyword_research', name: 'Keyword Research', price: 75 },
        { id: 'on_page_seo', name: 'On-Page SEO', price: 100 },
        { id: 'content_strategy', name: 'Content Strategy', price: 120 },
      ],
    },
    it_support: {
      name: 'IT Support / Maintenance',
      baseRate: 30,
      unit: 'hour',
      features: [],
    },
    consulting_training: {
      name: 'Consulting & Training',
      baseRate: 45,
      unit: 'hour',
      features: [],
    },
    other: {
      name: 'Other (Custom)',
      baseRate: 35,
      unit: 'hour',
      features: [],
    },
  },
  slaTiers: {
    // For projects & monthly services
    standard: { name: 'Standard', multiplier: 1, description: 'Flexible timeline (1-6 months for full projects)' },
    priority: { name: 'Priority', multiplier: 1.5, description: 'Accelerated delivery (1-4 weeks for prototypes)' },
    after_hours: { name: 'After-Hours', multiplier: 2, description: 'Urgent support & critical fixes (24-72 hours)' },
  },
};
// --- End Configuration ---

type ServiceId = keyof typeof serviceConfig.services;
type SlaId = keyof typeof serviceConfig.slaTiers;
type CurrencyId = keyof typeof serviceConfig.currencies;

export default function ItServiceCalculatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Hydration state to prevent mismatch errors
  const [mounted, setMounted] = useState(false);

  const [selectedService, setSelectedService] = useState<ServiceId>('web_development');
  const [quantity, setQuantity] = useState(1);
  const [customServiceName, setCustomServiceName] = useState('');
  const [customFeatures, setCustomFeatures] = useState('');
  const [selectedSla, setSelectedSla] = useState<SlaId>('standard');
  const [selectedFeatures, setSelectedFeatures] = useState<Record<string, boolean>>({});
  const [selectedLessonType, setSelectedLessonType] = useState<string>('');
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyId>('USD');
  const [totalCost, setTotalCost] = useState({ subtotal: 0, vat: 0, total: 0 });

  const currentService = serviceConfig.services[selectedService] as (typeof serviceConfig.services)[ServiceId] & { lessonTypes?: any[] };
  const currencyInfo = serviceConfig.currencies[selectedCurrency];

  const isLessonService = useMemo(() => 
    selectedService === 'lesson_enrollment' || selectedService === 'lesson_packages', 
  [selectedService]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Helper to ensure consistent rendering during hydration
  const safeT = (key: string) => mounted ? t(key) : key;

  useEffect(() => {
    const currencyRate = serviceConfig.currencies[selectedCurrency].rate;
    const slaMultiplier = isLessonService ? 1 : serviceConfig.slaTiers[selectedSla].multiplier;
    
    // All base prices are in USD, so we calculate in USD first
    const baseForQuantityUSD = currentService.baseRate * quantity;

    const featuresCostUSD = (currentService.features || []).reduce((acc, feature) => {
      if (selectedFeatures[feature.id]) {
        return acc + feature.price;
      }
      return acc;
    }, 0);

    const lessonTypeCostUSD = (currentService.lessonTypes || []).reduce((acc, lessonType) => {
        if (selectedLessonType === lessonType.id) {
            return acc + lessonType.price;
        }
        return acc;
    }, 0);

    const subtotalBeforeSlaUSD = baseForQuantityUSD + featuresCostUSD + lessonTypeCostUSD;
    const finalSubtotalUSD = subtotalBeforeSlaUSD * slaMultiplier;

    // Convert to selected currency
    const finalSubtotal = finalSubtotalUSD * currencyRate;
    const vatAmount = finalSubtotal * serviceConfig.vatRate;
    const finalTotal = finalSubtotal + vatAmount;

    setTotalCost({
      subtotal: finalSubtotal,
      vat: vatAmount,
      total: finalTotal,
    });
  }, [selectedService, quantity, selectedSla, selectedFeatures, selectedLessonType, selectedCurrency, currentService, isLessonService]);

  const handleServiceChange = (value: string) => {
    const newServiceId = value as ServiceId;
    setSelectedService(newServiceId);
    setQuantity(1); // Reset quantity
    setSelectedFeatures({}); // Reset features
    setSelectedLessonType('');
    setCustomServiceName('');
    setCustomFeatures('');
    setSelectedSla('standard'); // Reset SLA
  };

  const handleFeatureChange = (featureId: string) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [featureId]: !prev[featureId],
    }));
  };
  
  const getQuoteText = (forUrl = false) => {
    const nl = forUrl ? '%0A' : '\n';
    const symbol = currencyInfo.symbol;
    let serviceName = currentService.name;
    if (selectedService === 'other' && customServiceName) {
      serviceName = `${customServiceName} (Custom)`;
    }

    const featureLines = (currentService.features || [])
      .filter(f => selectedFeatures[f.id])
      .map(f => `- ${f.name}`)
      .join(nl);
      
    const lessonType = (currentService.lessonTypes || []).find(l => l.id === selectedLessonType);
    const lessonTypeLine = lessonType ? `${nl}Lesson Type: ${lessonType.name}` : '';

    const customFeatureLines = selectedService === 'other' && customFeatures ? `${nl}Custom Requirements:${nl}${customFeatures}` : '';
    
    const slaTier = serviceConfig.slaTiers[selectedSla];
    const priorityLine = !isLessonService ? `Priority: ${slaTier.name}` : '';

    return [
      `*Quote Summary*`,
      `Service: ${serviceName}`,
      `Quantity: ${quantity} ${currentService.unit}(s)`,
      ...(featureLines ? [`Features:${nl}${featureLines}`] : []),
      lessonTypeLine,
      customFeatureLines,
      priorityLine,
      `Currency: ${selectedCurrency}`,
      `------------------`,
      `Subtotal: ${symbol}${totalCost.subtotal.toFixed(2)}`,
      `VAT (16%): ${symbol}${totalCost.vat.toFixed(2)}`,
      `*Total: ${symbol}${totalCost.total.toFixed(2)}*`,
    ].join(nl);
  };
  
  const generatePdfQuote = () => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const symbol = currencyInfo.symbol;
        let y = 20;

        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('IT Service Quote', pageWidth / 2, y, { align: 'center' });
        y += 15;
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 15, y);
        doc.text(`Currency: ${selectedCurrency}`, pageWidth - 15, y, { align: 'right' });
        y += 15;

        doc.setLineWidth(0.5);
        doc.line(15, y, pageWidth - 15, y);
        y += 10;

        const addLine = (label: string, value: string) => {
          doc.setFont('helvetica', 'bold');
          doc.text(label, 15, y);
          doc.setFont('helvetica', 'normal');
          doc.text(value, 70, y);
          y += 8;
        };
        
        let serviceName = currentService.name;
        if (selectedService === 'other' && customServiceName) {
          serviceName = `${customServiceName} (Custom)`;
        }

        addLine('Service:', serviceName);
        addLine('Quantity:', `${quantity} ${currentService.unit}(s)`);
        if (!isLessonService) {
          addLine('Priority Level:', serviceConfig.slaTiers[selectedSla].name);
        }
        y += 5;

        const lessonType = (currentService.lessonTypes || []).find(l => l.id === selectedLessonType);
        if (lessonType) {
            doc.setFont('helvetica', 'bold');
            doc.text('Lesson Type:', 15, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            doc.text(`- ${lessonType.name}`, 20, y);
            y += 6;
            y+= 4;
        }

        const selectedFeatureList = (currentService.features || []).filter(f => selectedFeatures[f.id]);
        if (selectedFeatureList.length > 0) {
            doc.setFont('helvetica', 'bold');
            doc.text('Selected Features:', 15, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            selectedFeatureList.forEach(feature => {
                doc.text(`- ${feature.name}`, 20, y);
                y += 6;
            });
            y+= 4;
        }

        if (selectedService === 'other' && customFeatures) {
            doc.setFont('helvetica', 'bold');
            doc.text('Custom Requirements:', 15, y);
            y += 8;
            doc.setFont('helvetica', 'normal');
            const splitText = doc.splitTextToSize(customFeatures, pageWidth - 35);
            doc.text(splitText, 20, y);
            y += (splitText.length * 6) + 4;
        }
        
        doc.line(15, y, pageWidth - 15, y);
        y += 10;

        const addCostLine = (label: string, value: string) => {
            doc.setFont('helvetica', 'normal');
            doc.text(label, pageWidth - 65, y, { align: 'right' });
            doc.setFont('helvetica', 'bold');
            doc.text(value, pageWidth - 15, y, { align: 'right' });
            y += 8;
        }

        addCostLine('Subtotal:', `${symbol}${totalCost.subtotal.toFixed(2)}`);
        addCostLine(`VAT (${serviceConfig.vatRate * 100}%):`, `${symbol}${totalCost.vat.toFixed(2)}`);
        y += 2;
        doc.setLineWidth(0.2);
        doc.line(pageWidth - 68, y, pageWidth - 15, y);
        y += 8;
        
        doc.setFontSize(14);
        addCostLine('Total Estimate:', `${symbol}${totalCost.total.toFixed(2)}`);
        
        doc.save(`Quote-${serviceName.replace(/\s/g, '_')}.pdf`);
    } catch(error) {
        console.error("Failed to generate PDF:", error);
        toast({
            variant: "destructive",
            title: "PDF Generation Failed",
            description: "There was an error creating the PDF. Please try again.",
        });
    }
  };

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-8 min-h-screen">
      <header className="mb-8 md:mb-12">
        <Button variant="outline" asChild className="mb-6 rounded-full shadow-sm">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            <TranslatedText text="Back to Home" />
          </Link>
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Calculator className="h-8 w-8 md:h-10 md:w-10 text-primary" />
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-primary tracking-tight">
                <TranslatedText text="Service Quotation Calculator" />
              </h1>
            </div>
             <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground hover:text-black rounded-full shadow-md font-bold">
                <a href="https://forms.gle/CteNoni4yi8XCFEx8" target="_blank" rel="noopener noreferrer">
                  <Send className="mr-2 h-4 w-4" />
                  <TranslatedText text="Tell us about your project" />
                </a>
              </Button>
              <Button asChild variant="outline" className="border-accent text-accent hover:bg-accent hover:text-black rounded-full shadow-sm font-bold">
                <a href="https://forms.gle/btbiX7F7n4JndgGy7" target="_blank" rel="noopener noreferrer">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <TranslatedText text="Enroll for Lessons" />
                </a>
              </Button>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* --- Calculator Form --- */}
        <div className="lg:col-span-3">
          <Card className="shadow-lg border-none bg-card/60 backdrop-blur-md rounded-2xl md:rounded-[2rem]">
            <CardHeader className="p-6 md:p-8">
              <CardTitle className="text-xl md:text-2xl font-black text-primary tracking-tight"><TranslatedText text="Configure Your Service" /></CardTitle>
              <CardDescription className="text-sm md:text-base"><TranslatedText text="Select a service and adjust the options to get a cost estimate." /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-6 md:p-8 pt-0">
              {/* Currency Selection */}
              <div className="space-y-4">
                 <Label className="text-base font-bold text-primary"><TranslatedText text="Currency" /></Label>
                 <RadioGroup value={selectedCurrency} onValueChange={(value) => setSelectedCurrency(value as CurrencyId)} className="flex flex-wrap gap-4">
                    {Object.entries(serviceConfig.currencies).map(([id, { name }]) => (
                      <div className="flex items-center space-x-2 bg-background/50 px-4 py-3 rounded-xl border border-primary/5" key={id}>
                        <RadioGroupItem value={id} id={`curr-${id}`} />
                        <Label htmlFor={`curr-${id}`} className="font-bold cursor-pointer">{safeT(name)}</Label>
                      </div>
                    ))}
                 </RadioGroup>
              </div>

              {/* Service Selection */}
              <div className="space-y-4">
                <Label htmlFor="service-select" className="text-base font-bold text-primary"><TranslatedText text="Service" /></Label>
                <Select value={selectedService} onValueChange={handleServiceChange}>
                  <SelectTrigger id="service-select" className="h-14 rounded-xl md:rounded-2xl border-2 bg-background/50 text-base font-medium">
                    <SelectValue placeholder={safeT("Select a service...")} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2">
                    {Object.entries(serviceConfig.services).map(([id, { name }]) => (
                      <SelectItem key={id} value={id} className="py-3 font-medium">
                         <TranslatedText text={name} />
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Service Name & Features */}
              {selectedService === 'other' && (
                <>
                    <div className="space-y-4">
                      <Label htmlFor="custom-service-name" className="text-base font-bold text-primary"><TranslatedText text="Custom Service Name" /></Label>
                      <Input
                        id="custom-service-name"
                        value={customServiceName}
                        onChange={(e) => setCustomServiceName(e.target.value)}
                        placeholder={safeT("e.g., Data Analysis Pipeline")}
                        className="h-14 rounded-xl border-2 bg-background/50"
                      />
                    </div>
                     <div className="space-y-4">
                      <Label htmlFor="custom-features" className="text-base font-bold text-primary"><TranslatedText text="Describe Your Requirements" /></Label>
                      <Textarea
                        id="custom-features"
                        value={customFeatures}
                        onChange={(e) => setCustomFeatures(e.target.value)}
                        placeholder={safeT("Please list the features you need...")}
                        rows={4}
                        className="rounded-xl border-2 bg-background/50"
                      />
                    </div>
                </>
              )}

              {/* Quantity */}
              <div className="space-y-4">
                <Label htmlFor="quantity-input" className="text-base font-bold text-primary">
                  <TranslatedText text={`Number of ${currentService.unit}s`} />
                </Label>
                <Input
                  id="quantity-input"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="h-14 rounded-xl border-2 bg-background/50 text-lg font-bold"
                />
              </div>

              {/* Lesson Type Radio Group */}
              {isLessonService && currentService.lessonTypes && currentService.lessonTypes.length > 0 && (
                 <div className="space-y-4">
                    <Label className="text-base font-bold text-primary"><TranslatedText text="Lesson Type" /></Label>
                    <RadioGroup value={selectedLessonType} onValueChange={setSelectedLessonType} className="rounded-2xl border-2 p-6 space-y-3 bg-background/30">
                        {currentService.lessonTypes.map(lesson => (
                            <div key={lesson.id} className="flex items-center space-x-3 p-2 hover:bg-primary/5 rounded-lg transition-colors">
                                <RadioGroupItem value={lesson.id} id={`lesson-${lesson.id}`} />
                                <Label htmlFor={`lesson-${lesson.id}`} className="font-bold cursor-pointer w-full text-base">
                                    <div className="flex justify-between items-center">
                                        <TranslatedText text={lesson.name} />
                                        <span className="text-primary text-sm font-black bg-primary/10 px-3 py-1 rounded-full">{(lesson.price > 0 ? '+' : '')}{currencyInfo.symbol}{(lesson.price * currencyInfo.rate).toFixed(2)}</span>
                                    </div>
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                 </div>
              )}

              {/* Features Checkboxes */}
              {currentService.features && currentService.features.length > 0 && (
                <div className="space-y-4">
                  <Label className="text-base font-bold text-primary"><TranslatedText text="Additional Features" /></Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border-2 p-6 bg-background/30">
                     {currentService.features.map(feature => (
                       <div key={feature.id} className="flex items-center space-x-3 p-3 bg-background/50 rounded-xl hover:bg-background transition-colors border border-primary/5">
                         <Checkbox
                           id={`feature-${feature.id}`}
                           checked={!!selectedFeatures[feature.id]}
                           onCheckedChange={() => handleFeatureChange(feature.id)}
                         />
                         <Label htmlFor={`feature-${feature.id}`} className="font-bold cursor-pointer flex flex-col w-full text-sm">
                           <TranslatedText text={feature.name} />
                           <span className="text-primary font-black text-xs">{(feature.price >= 0 ? '+' : '')}{currencyInfo.symbol}{(feature.price * currencyInfo.rate).toFixed(2)}</span>
                         </Label>
                       </div>
                     ))}
                  </div>
                </div>
              )}
              
              {/* SLA Tiers */}
              {!isLessonService && (
                <div className="space-y-4">
                  <Label className="text-base font-bold text-primary"><TranslatedText text="Priority / Service Level" /></Label>
                  <RadioGroup value={selectedSla} onValueChange={(value) => setSelectedSla(value as SlaId)} className="rounded-2xl border-2 p-6 space-y-4 bg-background/30">
                    {Object.entries(serviceConfig.slaTiers).map(([id, { name, description, multiplier }]) => (
                      <div key={id} className="flex items-start space-x-3 p-3 hover:bg-primary/5 rounded-xl transition-colors">
                        <RadioGroupItem value={id} id={`sla-${id}`} className="mt-1" />
                        <Label htmlFor={`sla-${id}`} className="font-bold cursor-pointer w-full">
                          <div className="flex justify-between items-center">
                            <TranslatedText text={name} />
                            <span className="text-primary font-black text-xs bg-primary/10 px-3 py-1 rounded-full">({multiplier}x cost)</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 font-medium"><TranslatedText text={description} /></p>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Quote Summary --- */}
        <div className="lg:col-span-2">
          <Card className="shadow-2xl border-none bg-primary text-primary-foreground rounded-2xl md:rounded-[2rem] lg:sticky lg:top-24 overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Calculator className="h-32 w-32 rotate-12" />
            </div>
            <CardHeader className="p-8 pb-4 relative z-10">
              <CardTitle className="text-2xl font-black tracking-tight"><TranslatedText text="Estimated Quote" /></CardTitle>
              <CardDescription className="text-primary-foreground/70 font-medium"><TranslatedText text="This is an estimate. Final pricing may vary." /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-8 relative z-10">
              <div className="flex justify-between text-lg font-bold border-b border-primary-foreground/10 pb-4">
                <span className="opacity-80"><TranslatedText text="Subtotal" /></span>
                <span>{currencyInfo.symbol}{totalCost.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-b border-primary-foreground/10 pb-4">
                <span className="opacity-80"><TranslatedText text={`VAT (${serviceConfig.vatRate * 100}%)`} /></span>
                <span>{currencyInfo.symbol}{totalCost.vat.toFixed(2)}</span>
              </div>
              <div className="flex flex-col pt-4">
                <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-1"><TranslatedText text="Total Estimate" /></span>
                <div className="text-4xl md:text-5xl font-black tracking-tighter">
                  {currencyInfo.symbol}{totalCost.total.toFixed(2)}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 p-8 pt-0 relative z-10">
              <Button onClick={generatePdfQuote} className="w-full h-16 rounded-full bg-white text-primary hover:bg-accent hover:text-white transition-all font-black text-lg shadow-xl">
                <Download className="mr-2 h-6 w-6" /> <TranslatedText text="Download Quote (PDF)" />
              </Button>
              <div className="flex w-full gap-3">
                <Button asChild variant="outline" className="flex-1 h-14 rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white font-bold">
                  <a href={`https://wa.me/?text=${getQuoteText(true)}`} target="_blank" rel="noopener noreferrer">
                    <WhatsappIcon className="mr-2 h-5 w-5" /> <TranslatedText text="Share" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="flex-1 h-14 rounded-full border-2 border-white/20 bg-white/10 hover:bg-white/20 transition-all text-white font-bold">
                  <a href={`mailto:?subject=IT Service Quote&body=${getQuoteText(true)}`}>
                    <Mail className="mr-2 h-5 w-5" /> <TranslatedText text="Email" />
                  </a>
                </Button>
              </div>
              <p className="text-xs font-bold text-center mt-6 px-4 opacity-70 leading-relaxed italic">
                <TranslatedText text="For more specific requirements or questions, please feel free to reach out directly on WhatsApp!" />
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
