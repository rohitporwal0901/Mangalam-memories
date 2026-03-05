import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Film } from '../../services/firebase';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
  activeIndex = 0;
  playingIndex: number | null = null;

  private autoTimer: any;

  private fallback: Film[] = [
    {
      title: 'A Royal Rajasthani Affair',
      coupleNames: 'Priya & Arjun',
      location: 'Udaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/mqdefault.jpg',
      order: 1, active: true
    },
    {
      title: 'Love in the Pink City',
      coupleNames: 'Meera & Rohit',
      location: 'Jaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=IJq0yyWug-Q',
      thumbnailUrl: 'https://i.ytimg.com/vi/IJq0yyWug-Q/mqdefault.jpg',
      order: 2, active: true
    },
    {
      title: 'A Grand Bangalore Wedding',
      coupleNames: 'Ananya & Karthik',
      location: 'Bengaluru, Karnataka',
      youtubeUrl: 'https://www.youtube.com/watch?v=XEbGRSWWDfI',
      thumbnailUrl: 'https://i.ytimg.com/vi/XEbGRSWWDfI/mqdefault.jpg',
      order: 3, active: true
    },
    {
      title: 'Waves & Vows',
      coupleNames: 'Shreya & Vikram',
      location: 'Goa',
      youtubeUrl: 'https://www.youtube.com/watch?v=yb6dABvHcU4',
      thumbnailUrl: 'https://i.ytimg.com/vi/yb6dABvHcU4/mqdefault.jpg',
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
    if (i === this.activeIndex && this.playingIndex === null) return;
    this.stopAutoPlay();
    this.playingIndex = null;
    this.activeIndex = i;
    this.startAutoPlay();
  }

  private startAutoPlay() {
    this.stopAutoPlay();
    this.autoTimer = setInterval(() => {
      if (this.playingIndex === null) {
        this.activeIndex = (this.activeIndex + 1) % this.films.length;
      }
    }, 6000);
  }

  private stopAutoPlay() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  playFilm(i: number) {
    this.stopAutoPlay();
    this.playingIndex = i;
  }

  stopFilm() {
    this.playingIndex = null;
    this.startAutoPlay();
  }

  isPlaying(i: number) { return this.playingIndex === i; }

  getEmbedUrl(url: string): SafeResourceUrl {
    const base = this.fb.getYouTubeEmbedUrl(url);
    return this.sanitizer.bypassSecurityTrustResourceUrl(base + '&autoplay=1&rel=0&modestbranding=1');
  }

  /** Use pre-embedded thumbnail URL if available, else compute from URL */
  getThumbnail(film: Film): string {
    if (film.thumbnailUrl) return film.thumbnailUrl;
    return this.fb.getYouTubeThumbnail(film.youtubeUrl);
  }

  get activeFilm(): Film { return this.films[this.activeIndex] ?? this.films[0]; }

  ngOnDestroy() { this.stopAutoPlay(); }
}
