import {
  Component, Input, Output, EventEmitter, OnInit,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Archive } from '../../services/firebase';

@Component({
  selector: 'app-gallery-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery-modal.html',
  styleUrls: ['./gallery-modal.scss']
})
export class GalleryModalComponent implements OnInit {
  @Input() archive!: Archive;
  @Output() close = new EventEmitter<void>();

  lightboxIndex: number | null = null;
  visible = false;

  ngOnInit() {
    setTimeout(() => this.visible = true, 10);
    document.body.style.overflow = 'hidden';
  }

  openLightbox(i: number) { this.lightboxIndex = i; }
  closeLightbox() { this.lightboxIndex = null; }

  prevPhoto() {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex - 1 + this.archive.photos.length) % this.archive.photos.length;
  }

  nextPhoto() {
    if (this.lightboxIndex === null) return;
    this.lightboxIndex = (this.lightboxIndex + 1) % this.archive.photos.length;
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (this.lightboxIndex !== null) this.closeLightbox();
      else this.onClose();
    }
    if (e.key === 'ArrowRight') this.nextPhoto();
    if (e.key === 'ArrowLeft') this.prevPhoto();
  }

  onClose() {
    this.visible = false;
    document.body.style.overflow = '';
    setTimeout(() => this.close.emit(), 400);
  }
}
