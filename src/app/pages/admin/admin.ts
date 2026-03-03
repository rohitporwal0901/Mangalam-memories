import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService, Archive, Film, HeroSlide, InquiryForm } from '../../services/firebase';
import { AuthService } from '../../services/auth';

type Tab = 'hero' | 'archives' | 'films' | 'inquiries';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin implements OnInit {
  private fire = inject(FirebaseService);
  public auth = inject(AuthService);
  private fbg = inject(FormBuilder);

  activeTab: Tab = 'hero';

  heroSlides: HeroSlide[] = [];
  archives: Archive[] = [];
  films: Film[] = [];
  inquiries: InquiryForm[] = [];

  showHeroForm = false;
  showArchiveForm = false;
  showFilmForm = false;

  saving = false;
  message = '';

  heroForm = this.fbg.group({
    imageUrl: ['', Validators.required],
    title: ['', Validators.required],
    subtitle: [''],
    order: [1],
    active: [true],
  });

  archiveForm = this.fbg.group({
    coupleNames: ['', Validators.required],
    location: ['', Validators.required],
    description: [''],
    coverImage: ['', Validators.required],
    photos: [''],
    order: [1],
    active: [true],
    featured: [true],
  });

  filmForm = this.fbg.group({
    title: ['', Validators.required],
    coupleNames: ['', Validators.required],
    location: [''],
    youtubeUrl: ['', Validators.required],
    order: [1],
    active: [true],
  });

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.fire.getHeroSlides().subscribe(d => this.heroSlides = d);
    this.fire.getArchives().subscribe(d => this.archives = d);
    this.fire.getAllFilms().subscribe(d => this.films = d);
    this.fire.getInquiries().subscribe(d => this.inquiries = d);
  }

  /* ── Hero ──────────────────────── */
  saveHero() {
    if (this.heroForm.invalid) return;
    this.saving = true;
    this.fire.addHeroSlide(this.heroForm.value as HeroSlide).subscribe(() => {
      this.saving = false; this.showHeroForm = false;
      this.heroForm.reset({ order: 1, active: true });
      this.notify('Hero slide added!');
    });
  }

  deleteHero(id: string) {
    if (!confirm('Delete this slide?')) return;
    this.fire.deleteHeroSlide(id).subscribe(() => this.notify('Deleted'));
  }

  toggleHero(slide: HeroSlide) {
    if (!slide.id) return;
    this.fire.updateHeroSlide(slide.id, { active: !slide.active }).subscribe();
  }

  /* ── Archives ──────────────────── */
  saveArchive() {
    if (this.archiveForm.invalid) return;
    this.saving = true;
    const val = this.archiveForm.value;
    const photos = (val.photos as string || '').split(',').map(s => s.trim()).filter(Boolean);

    this.fire.addArchive({ ...val, photos } as Archive).subscribe(() => {
      this.saving = false; this.showArchiveForm = false;
      this.archiveForm.reset({ order: 1, active: true, featured: true });
      this.notify('Archive added!');
    });
  }

  deleteArchive(id: string) {
    if (!confirm('Delete this archive?')) return;
    this.fire.deleteArchive(id).subscribe(() => this.notify('Deleted'));
  }

  toggleArchive(a: Archive) {
    if (!a.id) return;
    this.fire.updateArchive(a.id, { active: !a.active, featured: !a.active }).subscribe();
  }

  /* ── Films ─────────────────────── */
  saveFilm() {
    if (this.filmForm.invalid) return;
    this.saving = true;
    this.fire.addFilm(this.filmForm.value as Film).subscribe(() => {
      this.saving = false; this.showFilmForm = false;
      this.filmForm.reset({ order: 1, active: true });
      this.notify('Film added!');
    });
  }

  deleteFilm(id: string) {
    if (!confirm('Delete this film?')) return;
    this.fire.deleteFilm(id).subscribe(() => this.notify('Deleted'));
  }

  /* ── Inquiries ─────────────────── */
  markRead(inq: InquiryForm) {
    if (!inq.id) return;
    this.fire.updateInquiryStatus(inq.id, 'read').subscribe();
  }

  setTab(tab: Tab) { this.activeTab = tab; }

  notify(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }

  logout() { this.auth.logout(); }

  get newInquiries() { return this.inquiries.filter(i => i.status === 'new').length; }
}
