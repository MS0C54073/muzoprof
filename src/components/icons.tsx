import * as React from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function WhatsappIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.353-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.131.574-.072 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
  );
}

export function TelegramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );
}

export function MuzoInTechLogo({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "relative flex h-full w-full items-center justify-center transition-all duration-300 group", 
        className
      )}
      {...props}
    >
      {/* Subtle glow effect behind the logo */}
      <div className="absolute inset-0 bg-accent/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <Image
        src="https://lh3.googleusercontent.com/d/18Lfcl0Dlti3A_Tsi1BT6tXmrk7GGQ3Cr"
        alt="MuzoInTech Logo"
        width={128}
        height={128}
        className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
        priority
      />
    </div>
  );
}

export function CourseraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M11.57.01C4.85-.32 0 4.14 0 9.64c0 5.25 4.93 10.33 11.57 9.64 6.72-.7 12.43-5.8 12.43-11.43C24 2.1 18.2-.35 11.57.01zm.55 17.65c-1.33.67-2.86.95-4.57.7v-1.5c1.28.21 2.5-.05 3.46-.56 1.02-.5 1.62-1.36 1.62-2.49s-.6-1.99-1.62-2.49c-1.01-.49-2.27-.72-3.55-.52V8.4c3.12.4 5.04 2 5.04 4.48 0 2-1.25 3.4-4.02 4.3v1.47z" />
    </svg>
  );
}

export function TryHackMeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M21.143 2.857H2.857C2.383 2.857 2 3.24 2 3.714v16.572C2 20.76 2.383 21.143 2.857 21.143h18.286c.474 0 .857-.383.857-.857V3.714c0-.474-.383-.857-.857-.857zM12 17.143c-2.828 0-5.143-2.315-5.143-5.143S9.172 6.857 12 6.857c2.828 0 5.143-2.315 5.143-5.143S14.828 17.143 12 17.143zm-2.286-5.143l-3-3h3.857v3zm4.572 0l3-3h-3.857v3zm0 2.286l3 3h-3.857v-3zm-4.572 0l-3 3h3.857v-3z" />
    </svg>
  );
}
