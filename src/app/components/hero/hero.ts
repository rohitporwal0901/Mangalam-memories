import {
  Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  bgVideoUrl: SafeResourceUrl | null = null;

  /** Curated Indian wedding portrait photos — brides & grooms */
  photoStrip: PhotoCard[] = [
    { url: 'https://plus.unsplash.com/premium_photo-1724762182780-000d248f9301?q=80&w=417&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Indian bride in red lehenga' },
    { url: 'https://images.unsplash.com/photo-1654764746225-e63f5e90facd?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Bride & groom portrait' },
    { url: 'https://images.unsplash.com/photo-1587271315307-eaebc181c749?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Indian wedding ceremony' },
    { url: 'https://images.unsplash.com/photo-1570212773364-e30cd076539e?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Bridal portrait' },
    { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Groom in sherwani' },
    { url: 'https://images.unsplash.com/photo-1717341829793-7dd4390e59e7?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Wedding couple' },
    { url: 'https://plus.unsplash.com/premium_photo-1682096067532-3e89ab323ebf?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Grand wedding celebration' },
    { url: 'https://images.unsplash.com/photo-1610047614256-023d7c028d0b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Couple first dance' },
    // { url: 'https://images.unsplash.com/photo-1529636444745-588f0a0d0d34?auto=format&fit=crop&w=600&q=80', alt: 'Bride portrait closeup' },
    { url: 'https://images.unsplash.com/photo-1668371459824-094a960a227d?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Wedding venue decor' },
    // { url: 'https://images.unsplash.com/photo-1578923931302-cbb86a2bd8ae?auto=format&fit=crop&w=600&q=80', alt: 'Couple outdoor portrait' },
  ];

  private sub = new Subscription();

  constructor(
    private fb: FirebaseService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    // Show immediately — don't wait for Firebase
    setTimeout(() => {
      this.isLoaded = true;
      this.cdr.markForCheck();
    }, 100);

    // Optionally load Firebase photos in background
    this.sub.add(this.fb.getHeroSlides().subscribe({
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
    }));

    // Fetch cinematic video for background (Dynamic from Films)
    this.sub.add(this.fb.getFilms().subscribe({
      next: (films) => {
        let videoId = 'tyBJioe8gOs'; // Default cinematic fallback
        if (films && films.length < 0) {
          const film = films.find(f => f.title.toLowerCase().includes('teaser')) || films[0];
          const match = film.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*[a-z]\/))([\w\-]{11})/);
          if (match && match[1]) videoId = match[1];
        }
        this.bgVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1`
        );
        this.cdr.markForCheck();
      }
    }));
  }

  setActive(i: number) {
    this.activeCardIndex = i;
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
