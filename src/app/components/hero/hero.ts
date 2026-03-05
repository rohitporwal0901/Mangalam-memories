import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, ViewChild, NgZone
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

  @ViewChild('strip') stripRef!: ElementRef<HTMLDivElement>;

  isLoaded = false;
  activeCardIndex = 2;

  /** Curated Indian wedding portrait photos — all verified URLs */
  photoStrip: PhotoCard[] = [
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      alt: 'Bride walking aisle'
    },
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
      alt: 'Bride portrait outdoor'
    },
    {
      url: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=600&q=80',
      alt: 'Indian wedding dancer'
    },
    {
      url: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80',
      alt: 'Bridal jewellery gold'
    },
    {
      url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80',
      alt: 'Wedding celebration'
    },
    {
      url: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=600&q=80',
      alt: 'Ocean wedding couple'
    },
    {
      url: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?w=600&q=80',
      alt: 'Bridal portrait garden'
    },
    {
      url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80',
      alt: 'Flowers bouquet bride'
    },
    {
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
      alt: 'Ring exchange ceremony'
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
      alt: 'Couple first dance'
    },
    {
      url: 'https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=600&q=80',
      alt: 'Mandap ceremony decor'
    },
  ];

  private sub!: Subscription;
  private autoScrollTimer: any;

  constructor(
    private fb: FirebaseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) { }

  ngOnInit() {
    // Load any firebase photos first, then show
    this.sub = this.fb.getHeroSlides().subscribe({
      next: (data) => {
        // If firebase has portrait photos, merge them
        const firebasePhotos = data
          .filter(s => s.active && s.imageUrl)
          .map(s => ({ url: s.imageUrl, alt: s.title || 'Wedding photo' }));

        if (firebasePhotos.length >= 3) {
          this.photoStrip = firebasePhotos;
        }
        this.init();
      },
      error: () => this.init()
    });
  }

  private init() {
    this.isLoaded = true;
    this.cdr.markForCheck();
    this.startAutoScroll();
  }

  setActive(i: number) {
    this.activeCardIndex = i;
  }

  /** Auto-scroll the strip slowly left → right → reset */
  private startAutoScroll() {
    this.zone.runOutsideAngular(() => {
      let direction = 1;
      this.autoScrollTimer = setInterval(() => {
        const el = this.stripRef?.nativeElement;
        if (!el) return;
        el.scrollLeft += direction * 1.5;
        if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 5) direction = -1;
        if (el.scrollLeft <= 0) direction = 1;
      }, 20);
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.autoScrollTimer) clearInterval(this.autoScrollTimer);
  }
}
