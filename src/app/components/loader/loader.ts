import {
  Component, OnInit, Output, EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';

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

  // Fullscreen grid images — high quality Indian wedding photos
  gridImages = [
    'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=600&q=70',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=70',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=70',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=70',
    'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?w=600&q=70',
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=70',
    'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=70',
    'https://images.unsplash.com/photo-1560258018-c7db7645254e?w=600&q=70',
    'https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?w=600&q=70',
  ];

  ngOnInit() {
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
