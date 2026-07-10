import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);
  registered = true;
}

/** @deprecated Use registerGsap */
export const registerGsapPlugins = registerGsap;

export { gsap, ScrollTrigger, MotionPathPlugin };
