import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Archive } from '../../services/firebase';

@Component({
  selector: 'app-pre-wedding-shoots',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pre-wedding-shoots.html',
  styleUrls: ['./pre-wedding-shoots.scss']
})
export class PreweddingShootsComponent implements OnInit {
  @Output() openGallery = new EventEmitter<Archive>();

  shoots: Archive[] = [];
  loading = true;
  activeIndex = 0;

  private fallback: Archive[] = [
    {
      id: 'pre-1',
      coupleNames: 'Rohan & Sakshi',
      location: 'Udaipur, Rajasthan',
      description: 'Morning romance at the City Palace',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
      ],
      order: 1, active: true, featured: true, isPrewedding: true
    },
    {
      id: 'pre-2',
      coupleNames: 'Aditya & Neha',
      location: 'Goa Beaches',
      description: 'Sunset stroll along the Arabian Sea',
      coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      photos: [
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=800&q=80'
      ],
      order: 2, active: true, featured: true, isPrewedding: true
    }
  ];

  constructor(private fb: FirebaseService) { }

  ngOnInit() {
    this.fb.getPreweddings().subscribe({
      next: data => {
        this.shoots = data.length ? data : this.fallback;
        this.loading = false;
      },
      error: () => {
        this.shoots = this.fallback;
        this.loading = false;
      }
    });
  }

  prev() {
    if (this.shoots.length <= 1) return;
    this.activeIndex = (this.activeIndex - 1 + this.shoots.length) % this.shoots.length;
  }

  next() {
    if (this.shoots.length <= 1) return;
    this.activeIndex = (this.activeIndex + 1) % this.shoots.length;
  }

  goTo(i: number) {
    this.activeIndex = i;
  }

  onViewGallery(archive: Archive) {
    this.openGallery.emit(archive);
  }

  get activeShoot(): Archive {
    return this.shoots[this.activeIndex];
  }
}
