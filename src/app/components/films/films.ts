import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FirebaseService, Film } from '../../services/firebase';

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './films.html',
  styleUrls: ['./films.scss']
})
export class FilmsComponent implements OnInit, OnDestroy {

  films: Film[] = [];
  loading = true;
  activeIndex = 0;          /* current slide index */
  playingIndex: number | null = null;

  private autoTimer: any;

  private fallback: Film[] = [
    {
      title: 'A Royal Rajasthani Affair',
      coupleNames: 'Priya & Arjun',
      location: 'Udaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      order: 1, active: true
    },
    {
      title: 'Love in the Pink City',
      coupleNames: 'Meera & Rohit',
      location: 'Jaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      order: 2, active: true
    },
    {
      title: 'Southern Splendour',
      coupleNames: 'Ananya & Karthik',
      location: 'Mysore, Karnataka',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      order: 3, active: true
    },
    {
      title: 'Waves & Vows',
      coupleNames: 'Shreya & Vikram',
      location: 'Goa',
      youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
      order: 4, active: true
    },
  ];

  constructor(
    private fb: FirebaseService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.fb.getFilms().subscribe({
      next: data => {
        this.films = data.length ? data : this.fallback;
        this.loading = false;
        this.startAutoPlay();
      },
      error: () => {
        this.films = this.fallback;
        this.loading = false;
        this.startAutoPlay();
      }
    });
  }

  /* ── Slider navigation ── */
  prev() {
    this.stopAutoPlay();
    this.playingIndex = null;
    this.activeIndex = (this.activeIndex - 1 + this.films.length) % this.films.length;
    this.startAutoPlay();
  }

  next() {
    this.stopAutoPlay();
    this.playingIndex = null;
    this.activeIndex = (this.activeIndex + 1) % this.films.length;
    this.startAutoPlay();
  }

  goTo(i: number) {
    this.stopAutoPlay();
    this.playingIndex = null;
    this.activeIndex = i;
    this.startAutoPlay();
  }

  private startAutoPlay() {
    this.autoTimer = setInterval(() => {
      if (this.playingIndex === null) {
        this.activeIndex = (this.activeIndex + 1) % this.films.length;
      }
    }, 5000);
  }

  private stopAutoPlay() {
    if (this.autoTimer) clearInterval(this.autoTimer);
  }

  /* ── Video helpers ── */
  playFilm(i: number) {
    this.stopAutoPlay();
    this.playingIndex = i;
  }

  isPlaying(i: number) { return this.playingIndex === i; }

  getEmbedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.fb.getYouTubeEmbedUrl(url) + '&autoplay=1'
    );
  }

  getThumbnail(url: string): string {
    return this.fb.getYouTubeThumbnail(url);
  }

  get activeFilm(): Film { return this.films[this.activeIndex] ?? this.films[0]; }

  ngOnDestroy() { this.stopAutoPlay(); }
}
