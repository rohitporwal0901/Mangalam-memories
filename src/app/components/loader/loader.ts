import {
  Component, OnInit, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  style: string;
}

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrls: ['./loader.scss']
})
export class LoaderComponent implements OnInit {
  @Output() loaderDone = new EventEmitter<void>();

  progress = 0;
  hiding = false;
  showLogo = false;
  showText = false;

  // Letter-by-letter arrays
  word1 = Array.from('Mangalam');
  word2 = Array.from('Memories');
  taglineLetters = Array.from('Indian Wedding Photography');

  // Floating particles
  particles: Particle[] = [];

  ngOnInit() {
    this.generateParticles();

    setTimeout(() => this.showLogo = true, 200);
    setTimeout(() => this.showText = true, 700);

    const interval = setInterval(() => {
      this.progress += Math.random() * 10 + 2;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.hiding = true;
          setTimeout(() => this.loaderDone.emit(), 1200);
        }, 500);
      }
    }, 140);
  }

  private generateParticles(): void {
    const count = 30;
    for (let i = 0; i < count; i++) {
      const left = Math.random() * 100;
      const size = Math.random() * 2 + 1;
      const delay = Math.random() * 8;
      const duration = Math.random() * 10 + 8;
      const opacity = Math.random() * 0.5 + 0.2;

      this.particles.push({
        style: `
          left: ${left}%;
          bottom: -10px;
          width: ${size}px;
          height: ${size}px;
          opacity: ${opacity};
          animation-duration: ${duration}s;
          animation-delay: ${delay}s;
        `
      });
    }
  }
}
