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

  /** Curated Indian wedding portrait photos — brides & grooms */
  photoStrip: PhotoCard[] = [
    { url: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=600&q=80', alt: 'Indian bride in red lehenga' },
    { url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80', alt: 'Bride & groom portrait' },
    { url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=600&q=80', alt: 'Indian wedding ceremony' },
    { url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=600&q=80', alt: 'Bridal portrait' },
    { url: 'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=600&q=80', alt: 'Groom in sherwani' },
    { url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80', alt: 'Wedding couple' },
    { url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80', alt: 'Grand wedding celebration' },
    { url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=600&q=80', alt: 'Couple first dance' },
    // { url: 'https://images.unsplash.com/photo-1529636444745-588f0a0d0d34?auto=format&fit=crop&w=600&q=80', alt: 'Bride portrait closeup' },
    { url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80', alt: 'Wedding venue decor' },
    // { url: 'https://images.unsplash.com/photo-1578923931302-cbb86a2bd8ae?auto=format&fit=crop&w=600&q=80', alt: 'Couple outdoor portrait' },
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
        console.log('data', data);

        const fp = data
          .filter(s => s.active && s.imageUrl)
          .map(s => ({ url: s.imageUrl, alt: s.title || 'Wedding photo' }));
        if (fp.length >= 5) {
          this.photoStrip = fp;
          console.log('this.photoStrip', this.photoStrip);

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
