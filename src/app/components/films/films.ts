import { Component, OnInit } from '@angular/core';
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
export class FilmsComponent implements OnInit {
  films: Film[] = [];
  loading = true;
  activeId: string | null = null;

  private fallback: Film[] = [
    {
      title: 'Priya & Arjun Wedding Film',
      coupleNames: 'Priya & Arjun',
      location: 'Udaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 1, active: true
    },
    {
      title: 'Meera & Rohit Wedding Film',
      coupleNames: 'Meera & Rohit',
      location: 'Jaipur, Rajasthan',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 2, active: true
    },
    {
      title: 'Ananya & Karthik Wedding Film',
      coupleNames: 'Ananya & Karthik',
      location: 'Mysore, Karnataka',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      order: 3, active: true
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
      },
      error: () => {
        this.films = this.fallback;
        this.loading = false;
      }
    });
  }

  getEmbedUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      this.fb.getYouTubeEmbedUrl(url)
    );
  }

  getThumbnail(url: string): string {
    return this.fb.getYouTubeThumbnail(url);
  }

  playFilm(film: Film) {
    this.activeId = film.id ?? film.coupleNames;
  }

  isPlaying(film: Film): boolean {
    return this.activeId === (film.id ?? film.coupleNames);
  }
}
