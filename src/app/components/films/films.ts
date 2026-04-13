import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Film } from '../../services/firebase';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ViewFilm extends Film {
  safeUrl: SafeResourceUrl;
  thumbImg: string;
  videoId: string;
}

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './films.html',
  styleUrls: ['./films.scss']
})
export class FilmsComponent implements OnInit, OnDestroy {

  films: ViewFilm[] = [];
  loading = true;
  activeIndex = 0;

  private autoTimer: any;
  private readonly INTERVAL = 12000; // 12s per film video

  private fallback: Film[] = [
    {
      title: 'Pre-Wedding Film',
      coupleNames: 'Priya & Arjun',
      location: 'Udaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg',
      order: 1, active: true
    },
    {
      title: 'Wedding Highlight',
      coupleNames: 'Meera & Rohit',
      location: 'Jaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=IJq0yyWug-Q',
      thumbnailUrl: 'https://i.ytimg.com/vi/IJq0yyWug-Q/maxresdefault.jpg',
      order: 2, active: true
    },
    {
      title: 'Cinematic Wedding',
      coupleNames: 'Ananya & Karthik',
      location: 'Bengaluru, Karnataka',
      youtubeUrl: 'https://www.youtube.com/watch?v=XEbGRSWWDfI',
      thumbnailUrl: 'https://i.ytimg.com/vi/XEbGRSWWDfI/maxresdefault.jpg',
      order: 3, active: true
    },
    {
      title: 'Beach Wedding',
      coupleNames: 'Shreya & Vikram',
      location: 'Goa',
      youtubeUrl: 'https://www.youtube.com/watch?v=yb6dABvHcU4',
      thumbnailUrl: 'https://i.ytimg.com/vi/yb6dABvHcU4/maxresdefault.jpg',
      order: 4, active: true
    },
  ];

  constructor(
    private fb: FirebaseService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.fb.getFilms().subscribe({
      next: data => {
        const rawFilms = data.length ? data : this.fallback;
        this.films = this.mapFilms(rawFilms);
        this.loading = false;
        this.cdr.detectChanges();
        this.startAutoPlay();
      },
      error: () => {
        this.films = this.mapFilms(this.fallback);
        this.loading = false;
        this.cdr.detectChanges();
        this.startAutoPlay();
      }
    });
  }

  private extractId(url: string): string {
    const m = url.match(
      /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=))([\w\-]{11})/
    );
    return m?.[1] ?? '';
  }

  private mapFilms(rawFilms: Film[]): ViewFilm[] {
    return rawFilms
      .filter(f => f.active !== false)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map(f => {
        const id = f.youtubeUrl ? this.extractId(f.youtubeUrl) : '';
        // Audio ON — no mute=1. Only active iframe is rendered so no audio clash.
        const embedUrl =
          `https://www.youtube-nocookie.com/embed/${id}` +
          `?autoplay=1&controls=1&rel=0&showinfo=0` +
          `&iv_load_policy=3&modestbranding=1&fs=1&start=2`;
        return {
          ...f,
          videoId: id,
          thumbImg: f.thumbnailUrl || (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : ''),
          safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl)
        };
      });
  }

  private startAutoPlay() {
    this.stopAutoPlay();
    this.autoTimer = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.films.length;
      this.cdr.detectChanges();
    }, this.INTERVAL);
  }

  private stopAutoPlay() {
    if (this.autoTimer) {
      clearInterval(this.autoTimer);
      this.autoTimer = null;
    }
  }

  ngOnDestroy() { this.stopAutoPlay(); }
}
