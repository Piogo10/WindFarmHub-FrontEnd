import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() { }

  scaleAnimation(target: string, scale: number, duration: number) {
    gsap.to(target, { scale, duration });
  }  
}
