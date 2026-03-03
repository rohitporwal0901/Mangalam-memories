import {
  Component, OnInit, Output, EventEmitter,
  ElementRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Archive } from '../../services/firebase';

@Component({
  selector: 'app-featured-archives',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './featured-archives.html',
  styleUrls: ['./featured-archives.scss']
})
export class FeaturedArchivesComponent implements OnInit {
  @Output() openGallery = new EventEmitter<Archive>();

  archives: Archive[] = [];
  loading = true;
  visibleItems: Set<number> = new Set();

  private fallback: Archive[] = [
    {
      coupleNames: 'Priya & Arjun', location: 'Udaipur, Rajasthan',
      description: 'A royal celebration at the lake palace',
      coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      ],
      order: 1, active: true, featured: true
    },
    {
      coupleNames: 'Meera & Rohit', location: 'Jaipur, Rajasthan',
      description: 'A vibrant Rajasthani celebration',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      ],
      order: 2, active: true, featured: true
    },
    {
      coupleNames: 'Ananya & Karthik', location: 'Mysore, Karnataka',
      description: 'A traditional South Indian ceremony',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80',
      ],
      order: 3, active: true, featured: true
    },
    {
      coupleNames: 'Shreya & Vikram', location: 'Mumbai, Maharashtra',
      description: 'An urban love story by the sea',
      coverImage: 'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=800&q=80',
        'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
      ],
      order: 4, active: true, featured: true
    },
  ];

  constructor(private fb: FirebaseService, private el: ElementRef) { }

  ngOnInit() {
    this.fb.getFeaturedArchives().subscribe({
      next: data => {
        this.archives = data.length ? data : this.fallback;
        this.loading = false;
      },
      error: () => {
        this.archives = this.fallback;
        this.loading = false;
      }
    });
  }

  @HostListener('window:scroll')
  checkVisibility() {
    const items = this.el.nativeElement.querySelectorAll('.archive-card');
    items.forEach((item: Element, i: number) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) this.visibleItems.add(i);
    });
  }

  isVisible(i: number) { return this.visibleItems.has(i); }

  viewGallery(archive: Archive, event: Event) {
    event.stopPropagation();
    this.openGallery.emit(archive);
  }
}
