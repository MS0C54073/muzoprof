const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';

import { gsap } from '@/lib/gsap/register-gsap';

export function splitTextToChars(element: HTMLElement): HTMLSpanElement[] {
  const text = element.textContent?.trim() ?? '';
  element.textContent = '';
  element.setAttribute('aria-label', text);
  element.classList.add('cinema-decode-root');

  return text.split('').map((char) => {
    const span = document.createElement('span');
    span.className = 'cinema-decode-char';
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.setAttribute('aria-hidden', 'true');
    element.appendChild(span);
    return span;
  });
}

export function createDecodeTimeline(
  chars: HTMLSpanElement[],
  duration = 1.2
) {
  return gsap.fromTo(
    chars,
    {
      opacity: 0,
      y: 8,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      stagger: {
        each: duration / Math.max(chars.length, 1),
        from: 'start',
      },
      ease: 'power2.out',
      onStart: () => {
        chars.forEach((char, index) => {
          const final = char.textContent ?? '';
          if (final.trim() === '') return;
          let frame = 0;
          const scramble = window.setInterval(() => {
            frame += 1;
            if (frame > 4) {
              char.textContent = final;
              window.clearInterval(scramble);
              return;
            }
            char.textContent =
              GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? final;
          }, 40 + index * 2);
        });
      },
    }
  );
}
