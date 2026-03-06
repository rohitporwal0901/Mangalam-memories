import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection, collectionData,
  doc, setDoc, updateDoc, deleteDoc,
  addDoc, orderBy, query, where, getDocs
} from '@angular/fire/firestore';
import {
  Storage,
  ref, uploadBytes, getDownloadURL, deleteObject
} from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

export interface BeforeAfter {
  id?: string;
  beforeImage: string;
  afterImage: string;
  title: string;
  order: number;
  active: boolean;
  createdAt?: any;
}

export interface HeroSlide {
  id?: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  order: number;
  active: boolean;
}

export interface Archive {
  id?: string;
  coupleNames: string;
  location: string;
  description: string;
  coverImage: string;
  photos: string[];
  order: number;
  active: boolean;
  featured: boolean;
  createdAt?: any;
}

export interface Film {
  id?: string;
  title: string;
  coupleNames: string;
  location: string;
  youtubeUrl: string;
  thumbnailUrl?: string;
  order: number;
  active: boolean;
}

export interface InquiryForm {
  id?: string;
  name: string;
  partnerName?: string;
  email: string;
  phone: string;
  weddingDate: string;
  venue: string;
  services?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt?: any;
}

export interface Testimonial {
  id?: string;
  coupleNames: string;
  location: string;
  quote: string;
  rating: number;          /* 1–5 */
  order: number;
  active: boolean;
  createdAt?: any;
}

export interface SiteSettings {
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  phone: string;
  email: string;
  instagram: string;
  facebook: string;
  address: string;
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  /* ── Hero Slides ──────────────────────────── */
  getHeroSlides(): Observable<HeroSlide[]> {
    const q = query(collection(this.firestore, 'heroSlides'), orderBy('order'));
    return collectionData(q, { idField: 'id' }) as Observable<HeroSlide[]>;
  }

  addHeroSlide(slide: HeroSlide) {
    return from(addDoc(collection(this.firestore, 'heroSlides'), slide));
  }

  updateHeroSlide(id: string, data: Partial<HeroSlide>) {
    return from(updateDoc(doc(this.firestore, 'heroSlides', id), data));
  }

  deleteHeroSlide(id: string) {
    return from(deleteDoc(doc(this.firestore, 'heroSlides', id)));
  }

  /* ── Archives ─────────────────────────────── */
  getArchives(): Observable<Archive[]> {
    const q = query(collection(this.firestore, 'archives'), orderBy('order'));
    return collectionData(q, { idField: 'id' }) as Observable<Archive[]>;
  }

  getFeaturedArchives(): Observable<Archive[]> {
    const q = query(
      collection(this.firestore, 'archives'),
      where('featured', '==', true),
      where('active', '==', true),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Archive[]>;
  }

  addArchive(archive: Archive) {
    return from(addDoc(collection(this.firestore, 'archives'), archive));
  }

  updateArchive(id: string, data: Partial<Archive>) {
    return from(updateDoc(doc(this.firestore, 'archives', id), data));
  }

  deleteArchive(id: string) {
    return from(deleteDoc(doc(this.firestore, 'archives', id)));
  }

  /* ── Films ────────────────────────────────── */
  getFilms(): Observable<Film[]> {
    const q = query(
      collection(this.firestore, 'films'),
      where('active', '==', true),
    );
    return collectionData(q, { idField: 'id' }) as Observable<Film[]>;
  }

  getAllFilms(): Observable<Film[]> {
    const q = query(collection(this.firestore, 'films'), orderBy('order'));
    return collectionData(q, { idField: 'id' }) as Observable<Film[]>;
  }

  addFilm(film: Film) {
    return from(addDoc(collection(this.firestore, 'films'), film));
  }

  updateFilm(id: string, data: Partial<Film>) {
    return from(updateDoc(doc(this.firestore, 'films', id), data));
  }

  deleteFilm(id: string) {
    return from(deleteDoc(doc(this.firestore, 'films', id)));
  }

  /* ── Inquiries ────────────────────────────── */
  getInquiries(): Observable<InquiryForm[]> {
    const q = query(collection(this.firestore, 'inquiries'), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<InquiryForm[]>;
  }

  addInquiry(form: Omit<InquiryForm, 'id' | 'status' | 'createdAt'>) {
    return from(addDoc(collection(this.firestore, 'inquiries'), {
      ...form,
      status: 'new',
      createdAt: new Date()
    }));
  }

  updateInquiryStatus(id: string, status: InquiryForm['status']) {
    return from(updateDoc(doc(this.firestore, 'inquiries', id), { status }));
  }

  /* ── Testimonials ─────────────────────────── */
  getTestimonials(): Observable<Testimonial[]> {
    const q = query(
      collection(this.firestore, 'testimonials'),
      where('active', '==', true),
      orderBy('order')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Testimonial[]>;
  }

  getAllTestimonials(): Observable<Testimonial[]> {
    const q = query(collection(this.firestore, 'testimonials'), orderBy('order'));
    return collectionData(q, { idField: 'id' }) as Observable<Testimonial[]>;
  }

  addTestimonial(t: Omit<Testimonial, 'id' | 'createdAt'>) {
    return from(addDoc(collection(this.firestore, 'testimonials'), {
      ...t, createdAt: new Date()
    }));
  }

  updateTestimonial(id: string, data: Partial<Testimonial>) {
    return from(updateDoc(doc(this.firestore, 'testimonials', id), data));
  }

  deleteTestimonial(id: string) {
    return from(deleteDoc(doc(this.firestore, 'testimonials', id)));
  }

  /* ── Before & After ────────────────────────── */
  getBeforeAfters(): Observable<BeforeAfter[]> {
    const q = query(
      collection(this.firestore, 'beforeAfters'),
    );
    return collectionData(q, { idField: 'id' }) as Observable<BeforeAfter[]>;
  }

  getActiveBeforeAfters(): Observable<BeforeAfter[]> {
    const q = query(
      collection(this.firestore, 'beforeAfters'),
      where('active', '==', true),
    );
    return collectionData(q, { idField: 'id' }) as Observable<BeforeAfter[]>;
  }

  addBeforeAfter(ba: Omit<BeforeAfter, 'id' | 'createdAt'>) {
    return from(addDoc(collection(this.firestore, 'beforeAfters'), {
      ...ba, createdAt: new Date()
    }));
  }

  updateBeforeAfter(id: string, data: Partial<BeforeAfter>) {
    return from(updateDoc(doc(this.firestore, 'beforeAfters', id), data));
  }

  deleteBeforeAfter(id: string) {
    return from(deleteDoc(doc(this.firestore, 'beforeAfters', id)));
  }

  /* ── Site Settings ────────────────────────── */
  getSiteSettings(): Observable<SiteSettings[]> {
    return collectionData(collection(this.firestore, 'settings')) as Observable<SiteSettings[]>;
  }

  saveSiteSettings(settings: SiteSettings) {
    return from(setDoc(doc(this.firestore, 'settings', 'main'), settings));
  }

  /* ── Storage: Upload Image ────────────────── */
  async uploadImage(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }

  /* ── Get YouTube embed URL ────────────────── */
  getYouTubeEmbedUrl(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*[a-z]\/))([\w\-]{11})/);
    const id = match ? match[1] : '';
    return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&autoplay=0`;
  }

  getYouTubeThumbnail(url: string): string {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*[a-z]\/))([\w\-]{11})/);
    const id = match ? match[1] : '';
    // mqdefault (320×180) is always available; maxresdefault often returns 404
    return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  }
}
