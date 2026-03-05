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
  headerVisible = false;
  visibleItems: Set<number> = new Set();

  private fallback: Archive[] = [
    {
      coupleNames: 'Priya & Arjun', location: 'Udaipur, Rajasthan',
      description: 'A royal celebration at Lake Pichola palace',
      coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      ],
      order: 1, active: true, featured: true
    },
    {
      coupleNames: 'Meera & Rohit', location: 'Jaipur, Rajasthan',
      description: 'A vibrant Rajasthani palace celebration',
      coverImage: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529636444745-588f0a0d0d34?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      ],
      order: 2, active: true, featured: true
    },
    {
      coupleNames: 'Ananya & Karthik', location: 'Mysore, Karnataka',
      description: 'A traditional South Indian ceremony at the palace',
      coverImage: 'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1591604466107-ec97de577aff?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578923931302-cbb86a2bd8ae?auto=format&fit=crop&w=800&q=80',
      ],
      order: 3, active: true, featured: true
    },
    {
      coupleNames: 'Shreya & Vikram', location: 'Goa',
      description: 'An intimate beachside ceremony at sunset',
      coverImage: 'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1578923931302-cbb86a2bd8ae?auto=format&fit=crop&w=800&q=80',
      ],
      order: 4, active: true, featured: true
    },
    {
      coupleNames: 'Naina & Dev', location: 'Delhi',
      description: 'A grand Mughal-inspired celebration in Old Delhi',
      coverImage: 'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1509927083803-4bd519298ac4?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80',
      ],
      order: 5, active: true, featured: true
    },
    {
      coupleNames: 'Kavya & Rahul', location: 'Kerala',
      description: 'A serene backwater wedding ceremony',
      coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
      photos: [
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1529543544282-ea669407fca3?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
      ],
      order: 6, active: true, featured: true
    },
  ];

  constructor(private fb: FirebaseService, private el: ElementRef) { }

  ngOnInit() {
    this.fb.getFeaturedArchives().subscribe({
      next: data => {
        console.log("data", data);

        this.archives = data.length ? data : this.fallback;
        this.loading = false;
        setTimeout(() => this.checkVisibility(), 100);
      },
      error: () => {
        this.archives = this.fallback;
        this.loading = false;
        setTimeout(() => this.checkVisibility(), 100);
      }
    });
  }

  @HostListener('window:scroll')
  checkVisibility() {
    // Header reveal
    const header = this.el.nativeElement.querySelector('.section-header');
    if (header) {
      const hRect = header.getBoundingClientRect();
      if (hRect.top < window.innerHeight - 60) this.headerVisible = true;
    }
    // Card reveals
    const items = this.el.nativeElement.querySelectorAll('.archive-card');
    items.forEach((item: Element, i: number) => {
      const rect = item.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) this.visibleItems.add(i);
    });
  }

  isVisible(i: number) { return this.visibleItems.has(i); }

  viewGallery(archive: Archive, event: Event) {
    event.stopPropagation();
    this.openGallery.emit(archive);
  }
}
