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

  ngOnInit() {
    setTimeout(() => this.showLogo = true, 300);
    setTimeout(() => this.showText = true, 800);

    const interval = setInterval(() => {
      this.progress += Math.random() * 12 + 3;
      if (this.progress >= 100) {
        this.progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          this.hiding = true;
          setTimeout(() => this.loaderDone.emit(), 900);
        }, 600);
      }
    }, 150);
  }
}
