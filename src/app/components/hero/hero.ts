import {
  Component, OnInit, OnDestroy, ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, HeroSlide } from '../../services/firebase';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements OnInit, OnDestroy {
  slides: HeroSlide[] = [];
  currentIndex = 0;
  animating = false;
  isLoaded = false;

  /* Fallback slides if Firestore is empty */
  private fallbackSlides: HeroSlide[] = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&q=80',
      title: 'Eternal Moments',
      subtitle: 'Capturing the divine beauty of Indian weddings',
      order: 1, active: true
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1920&q=80',
      title: 'Sacred Traditions',
      subtitle: 'Where every ritual becomes a timeless memory',
      order: 2, active: true
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1920&q=80',
      title: 'Love Stories',
      subtitle: 'Told through the lens of artistry and emotion',
      order: 3, active: true
    },
  ];

  private sub!: Subscription;
  private auto!: Subscription;

  constructor(
    private fb: FirebaseService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.sub = this.fb.getHeroSlides().subscribe({
      next: (data) => {
        this.slides = data.filter(s => s.active).length
          ? data.filter(s => s.active) : this.fallbackSlides;
        this.isLoaded = true;
        this.startAutoPlay();
        this.cdr.markForCheck();
      },
      error: () => {
        this.slides = this.fallbackSlides;
        this.isLoaded = true;
        this.startAutoPlay();
        this.cdr.markForCheck();
      }
    });
  }

  startAutoPlay() {
    this.auto?.unsubscribe();
    this.auto = interval(5000).subscribe(() => this.next());
  }

  go(index: number) {
    if (this.animating || index === this.currentIndex) return;
    this.animating = true;
    this.currentIndex = index;
    setTimeout(() => this.animating = false, 800);
  }

  next() { this.go((this.currentIndex + 1) % this.slides.length); }
  prev() { this.go((this.currentIndex - 1 + this.slides.length) % this.slides.length); }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    this.auto?.unsubscribe();
  }

  scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
