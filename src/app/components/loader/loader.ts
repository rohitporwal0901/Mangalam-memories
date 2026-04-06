import {
  Component, OnInit, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface JumpLetter {
  char: string;
  delay: number;
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

  // Per-letter arrays with staggered animation delay
  mangalamLetters: JumpLetter[] = [];
  memoriesLetters: JumpLetter[] = [];

  // Fullscreen grid images — curated Indian wedding photos (brides, grooms, ceremonies)
  // Same source as hero.ts for visual consistency
  gridImages = [
    'https://plus.unsplash.com/premium_photo-1724762182780-000d248f9301?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1654764746225-e63f5e90facd?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587271315307-eaebc181c749?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1570212773364-e30cd076539e?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1717341829793-7dd4390e59e7?q=80&w=600&auto=format&fit=crop',
    'https://plus.unsplash.com/premium_photo-1682096067532-3e89ab323ebf?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1610047614256-023d7c028d0b?q=80&w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1668371459824-094a960a227d?q=80&w=600&auto=format&fit=crop',
  ];

  ngOnInit() {
    // Build letter arrays with staggered delays
    const boss = 'Boss';
    const photography = 'Photography';
    const baseDelay = 80;

    this.mangalamLetters = boss.split('').map((char, i) => ({
      char,
      delay: i * baseDelay
    }));

    this.memoriesLetters = photography.split('').map((char, i) => ({
      char,
      delay: (boss.length + i) * baseDelay + 60
    }));

    setTimeout(() => this.showLogo = true, 150);
    setTimeout(() => this.showText = true, 550);

    const interval = setInterval(() => {
      this.progress += Math.random() * 10 + 3;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.hiding = true;
          setTimeout(() => this.loaderDone.emit(), 1000);
        }, 400);
      }
    }, 130);
  }
}
