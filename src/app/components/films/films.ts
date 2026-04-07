import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Film } from '../../services/firebase';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

export interface ViewFilm extends Film {
  safeUrl?: SafeResourceUrl;
  thumbImg?: string;
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
  playingIndex: number | null = null;

  private autoTimer: any;

  private fallback: Film[] = [
    {
      title: 'A Royal Rajasthani Affair',
      coupleNames: 'Priya & Arjun',
      location: 'Udaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=2Vv-BfVoq4g',
      thumbnailUrl: 'https://i.ytimg.com/vi/2Vv-BfVoq4g/maxresdefault.jpg',
      order: 1, active: true
    },
    {
      title: 'Love in the Pink City',
      coupleNames: 'Meera & Rohit',
      location: 'Jaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=IJq0yyWug-Q',
      thumbnailUrl: 'https://i.ytimg.com/vi/IJq0yyWug-Q/maxresdefault.jpg',
      order: 2, active: true
    },
    {
      title: 'A Grand Bangalore Wedding',
      coupleNames: 'Ananya & Karthik',
      location: 'Bengaluru, Karnataka',
      youtubeUrl: 'https://www.youtube.com/watch?v=XEbGRSWWDfI',
      thumbnailUrl: 'https://i.ytimg.com/vi/XEbGRSWWDfI/maxresdefault.jpg',
      order: 3, active: true
    },
    {
      title: 'Waves & Vows',
      coupleNames: 'Shreya & Vikram',
      location: 'Goa',
      youtubeUrl: 'https://www.youtube.com/watch?v=yb6dABvHcU4',
      thumbnailUrl: 'https://i.ytimg.com/vi/yb6dABvHcU4/maxresdefault.jpg',
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
        const rawFilms = data.length ? data : this.fallback;
        this.films = this.mapFilms(rawFilms);
        this.loading = false;
        this.startAutoPlay();
      },
      error: () => {
        this.films = this.mapFilms(this.fallback);
        this.loading = false;
        this.startAutoPlay();
      }
    });
  }

  private mapFilms(rawFilms: Film[]): ViewFilm[] {
    return rawFilms.map(f => {
      let id = '';
      if (f.youtubeUrl) {
        const match = f.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*[a-z]\/))([\w\-]{11})/);
        if (match && match[1]) id = match[1];
      }
      return {
        ...f,
        safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&controls=1&showinfo=0&iv_load_policy=3&disablekb=1`),
        thumbImg: f.thumbnailUrl || (id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : '')
      };
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
      if (this.playingIndex === null && this.films.length > 0) {
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

  get activeFilm(): ViewFilm { return this.films[this.activeIndex] ?? this.films[0]; }

  ngOnDestroy() { this.stopAutoPlay(); }
}
