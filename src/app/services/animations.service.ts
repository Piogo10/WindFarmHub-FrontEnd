import { Injectable } from '@angular/core';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() { }

  scaleAnimation(elementId: string, scaleTo: number, duration: number) {
    gsap.to(elementId, { duration: duration, scale: scaleTo });
  }
}
