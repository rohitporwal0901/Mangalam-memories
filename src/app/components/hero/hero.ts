import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { Subscription } from 'rxjs';

interface PhotoCard {
  url: string;
  alt: string;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent implements OnInit, OnDestroy {

  isLoaded = false;
  activeCardIndex = 2;

  /** Curated Indian wedding portrait photos — all verified URLs */
  photoStrip: PhotoCard[] = [
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', alt: 'Wedding ceremony' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80', alt: 'Bride portrait' },
    { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80', alt: 'Indian wedding' },
    { url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', alt: 'Bridal jewellery' },
    { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80', alt: 'Wedding celebration' },
    { url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80', alt: 'Couple outdoor' },
    { url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80', alt: 'Bridal portrait' },
    { url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80', alt: 'Flower bouquet' },
    { url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80', alt: 'Ring exchange' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', alt: 'First dance' },
    { url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80', alt: 'Mandap decor' },
  ];

  private sub!: Subscription;

  constructor(
    private fb: FirebaseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    // Show immediately — don't wait for Firebase
    setTimeout(() => {
      this.isLoaded = true;
      this.cdr.markForCheck();
    }, 100);

    // Optionally load Firebase photos in background
    this.sub = this.fb.getHeroSlides().subscribe({
      next: (data) => {
        const fp = data
          .filter(s => s.active && s.imageUrl)
          .map(s => ({ url: s.imageUrl, alt: s.title || 'Wedding photo' }));
        if (fp.length >= 5) {
          this.photoStrip = fp;
          this.cdr.markForCheck();
        }
      },
      error: () => { /* keep default photos */ }
    });
  }

  setActive(i: number) {
    this.activeCardIndex = i;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
