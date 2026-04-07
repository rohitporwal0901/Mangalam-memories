import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FirebaseService, Archive, Film, HeroSlide, InquiryForm, Testimonial, BeforeAfter } from '../../services/firebase';
import { AuthService } from '../../services/auth';

type Tab = 'hero' | 'archives' | 'films' | 'inquiries' | 'testimonials' | 'beforeafter';

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
  testimonials: Testimonial[] = [];
  beforeAfters: BeforeAfter[] = [];

  showHeroForm = false;
  showArchiveForm = false;
  showFilmForm = false;
  showTestimonialForm = false;
  showBeforeAfterForm = false;

  saving = false;
  message = '';

  // ── Upload state ──────────────────────────────
  heroUploading = false;
  heroUploadProgress = 0;
  heroPreviewUrl = '';
  heroUploadError = '';

  archiveCoverUploading = false;
  archiveCoverProgress = 0;
  archiveCoverPreviewUrl = '';
  archiveCoverUploadError = '';

  archivePhotosUploading = false;
  archivePhotosPreviewUrls: string[] = [];

  beforeUploading = false;
  beforePreviewUrl = '';
  beforeUploadError = '';

  afterUploading = false;
  afterPreviewUrl = '';
  afterUploadError = '';

  heroForm = this.fbg.group({
    imageUrl: ['', Validators.required],
    title: ['', Validators.required],
    subtitle: [''],
    order: [1],
    active: [true],
  });

  beforeAfterForm = this.fbg.group({
    title: ['', Validators.required],
    beforeImage: ['', Validators.required],
    afterImage: ['', Validators.required],
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
    isPrewedding: [false],
  });

  filmForm = this.fbg.group({
    title: ['', Validators.required],
    coupleNames: ['', Validators.required],
    location: [''],
    youtubeUrl: ['', Validators.required],
    order: [1],
    active: [true],
  });

  testimonialForm = this.fbg.group({
    coupleNames: ['', Validators.required],
    location: ['', Validators.required],
    quote: ['', Validators.required],
    rating: [5],
    order: [1],
    active: [true],
  });

  ngOnInit() { this.loadAll(); }

  loadAll() {
    this.fire.getHeroSlides().subscribe(d => this.heroSlides = d);
    this.fire.getArchives().subscribe(d => this.archives = d);
    this.fire.getAllFilms().subscribe(d => this.films = d);
    this.fire.getInquiries().subscribe(d => this.inquiries = d);
    this.fire.getAllTestimonials().subscribe(d => this.testimonials = d);
    this.fire.getBeforeAfters().subscribe(d => this.beforeAfters = d);
  }

  /* ── Hero Image Upload ──────────────────── */
  async onHeroImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.heroUploadError = 'Only image files allowed (JPG, PNG, WebP)';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.heroUploadError = 'File size must be under 10MB';
      return;
    }

    this.heroUploading = true;
    this.heroUploadError = '';
    this.heroUploadProgress = 0;

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => this.heroPreviewUrl = e.target?.result as string;
    reader.readAsDataURL(file);

    try {
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const path = `hero-slides/${timestamp}_${file.name}`;
      this.heroUploadProgress = 30;
      const downloadUrl = await this.fire.uploadImage(file, path);
      this.heroUploadProgress = 100;
      this.heroForm.patchValue({ imageUrl: downloadUrl });
      this.heroPreviewUrl = downloadUrl;
      this.message = '✓ Image uploaded to Firebase Storage!';
      setTimeout(() => this.message = '', 3000);
    } catch (err: any) {
      this.heroUploadError = 'Upload failed: ' + (err?.message || 'Unknown error');
    } finally {
      this.heroUploading = false;
    }
  }

  /* ── Archive Cover Upload ───────────────── */
  async onArchiveCoverSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.archiveCoverUploadError = 'Only image files allowed';
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      this.archiveCoverUploadError = 'File size must be under 10MB';
      return;
    }

    this.archiveCoverUploading = true;
    this.archiveCoverUploadError = '';
    this.archiveCoverProgress = 0;

    const reader = new FileReader();
    reader.onload = (e) => this.archiveCoverPreviewUrl = e.target?.result as string;
    reader.readAsDataURL(file);

    try {
      const path = `archives/covers/${Date.now()}_${file.name}`;
      this.archiveCoverProgress = 30;
      const downloadUrl = await this.fire.uploadImage(file, path);
      this.archiveCoverProgress = 100;
      this.archiveForm.patchValue({ coverImage: downloadUrl });
      this.archiveCoverPreviewUrl = downloadUrl;
      this.message = '✓ Cover image uploaded!';
      setTimeout(() => this.message = '', 3000);
    } catch (err: any) {
      this.archiveCoverUploadError = 'Upload failed: ' + (err?.message || 'Unknown error');
    } finally {
      this.archiveCoverUploading = false;
    }
  }

  /* ── Archive Gallery Photos Upload ─────── */
  async onArchivePhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    this.archivePhotosUploading = true;
    this.archivePhotosPreviewUrls = [];
    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        const path = `archives/photos/${Date.now()}_${i}_${file.name}`;
        const url = await this.fire.uploadImage(file, path);
        uploadedUrls.push(url);
        this.archivePhotosPreviewUrls = [...uploadedUrls];
      }

      // Append to existing photos
      const existing = (this.archiveForm.value.photos as string || '').trim();
      const newPhotoStr = [...(existing ? existing.split(',').map(s => s.trim()).filter(Boolean) : []), ...uploadedUrls].join(', ');
      this.archiveForm.patchValue({ photos: newPhotoStr });
      this.message = `✓ ${uploadedUrls.length} photo(s) uploaded!`;
      setTimeout(() => this.message = '', 3000);
    } catch (err: any) {
      this.message = 'Some uploads failed';
    } finally {
      this.archivePhotosUploading = false;
    }
  }

  /* ── Hero ──────────────────────────── */
  saveHero() {
    if (this.heroForm.invalid) return;
    this.saving = true;
    this.fire.addHeroSlide(this.heroForm.value as HeroSlide).subscribe(() => {
      this.saving = false; this.showHeroForm = false;
      this.heroForm.reset({ order: 1, active: true });
      this.heroPreviewUrl = '';
      this.heroUploadProgress = 0;
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

  /* ── Archives ──────────────────────── */
  saveArchive() {
    if (this.archiveForm.invalid) return;
    this.saving = true;
    const val = this.archiveForm.value;
    const photos = (val.photos as string || '').split(',').map(s => s.trim()).filter(Boolean);

    this.fire.addArchive({ ...val, photos } as Archive).subscribe(() => {
      this.saving = false; this.showArchiveForm = false;
      this.archiveForm.reset({ order: 1, active: true, featured: true, isPrewedding: false });
      this.archiveCoverPreviewUrl = '';
      this.archivePhotosPreviewUrls = [];
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

  /* ── Films ─────────────────────────── */
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

  toggleFilm(film: Film) {
    if (!film.id) return;
    this.fire.updateFilm(film.id, { active: !film.active }).subscribe();
  }

  /* ── Inquiries ─────────────────────── */
  markRead(inq: InquiryForm) {
    if (!inq.id) return;
    this.fire.updateInquiryStatus(inq.id, 'read').subscribe();
  }

  /* ── Testimonials ──────────────────── */
  saveTestimonial() {
    if (this.testimonialForm.invalid) return;
    this.saving = true;
    const val = this.testimonialForm.value;
    this.fire.addTestimonial({
      coupleNames: val.coupleNames!,
      location: val.location!,
      quote: val.quote!,
      rating: val.rating ?? 5,
      order: val.order ?? 1,
      active: val.active ?? true,
    }).subscribe(() => {
      this.saving = false; this.showTestimonialForm = false;
      this.testimonialForm.reset({ rating: 5, order: 1, active: true });
      this.notify('Testimonial added!');
    });
  }

  deleteTestimonial(id: string) {
    if (!confirm('Delete this testimonial?')) return;
    this.fire.deleteTestimonial(id).subscribe(() => this.notify('Deleted'));
  }

  toggleTestimonial(t: Testimonial) {
    if (!t.id) return;
    this.fire.updateTestimonial(t.id, { active: !t.active }).subscribe();
  }

  /* ── Before & After Uploads ──────────────── */
  async onBeforeImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.beforeUploading = true;
    this.beforeUploadError = '';
    const reader = new FileReader();
    reader.onload = e => this.beforePreviewUrl = e.target?.result as string;
    reader.readAsDataURL(file);
    try {
      const url = await this.fire.uploadImage(file, `before-after/before_${Date.now()}_${file.name}`);
      this.beforeAfterForm.patchValue({ beforeImage: url });
      this.beforePreviewUrl = url;
    } catch (err: any) {
      this.beforeUploadError = 'Upload failed: ' + err?.message;
    } finally {
      this.beforeUploading = false;
    }
  }

  async onAfterImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.afterUploading = true;
    this.afterUploadError = '';
    const reader = new FileReader();
    reader.onload = e => this.afterPreviewUrl = e.target?.result as string;
    reader.readAsDataURL(file);
    try {
      const url = await this.fire.uploadImage(file, `before-after/after_${Date.now()}_${file.name}`);
      this.beforeAfterForm.patchValue({ afterImage: url });
      this.afterPreviewUrl = url;
    } catch (err: any) {
      this.afterUploadError = 'Upload failed: ' + err?.message;
    } finally {
      this.afterUploading = false;
    }
  }

  saveBeforeAfter() {
    if (this.beforeAfterForm.invalid) return;
    this.saving = true;
    const val = this.beforeAfterForm.value;
    this.fire.addBeforeAfter({
      title: val.title!,
      beforeImage: val.beforeImage!,
      afterImage: val.afterImage!,
      order: val.order ?? 1,
      active: val.active ?? true,
    }).subscribe(() => {
      this.saving = false; this.showBeforeAfterForm = false;
      this.beforeAfterForm.reset({ order: 1, active: true });
      this.beforePreviewUrl = '';
      this.afterPreviewUrl = '';
      this.notify('Before & After added!');
    });
  }

  deleteBeforeAfter(id: string) {
    if (!confirm('Delete this before/after slide?')) return;
    this.fire.deleteBeforeAfter(id).subscribe(() => this.notify('Deleted'));
  }

  toggleBeforeAfter(slide: BeforeAfter) {
    if (!slide.id) return;
    this.fire.updateBeforeAfter(slide.id, { active: !slide.active }).subscribe();
  }

  setTab(tab: Tab) { this.activeTab = tab; }

  notify(msg: string) {
    this.message = msg;
    setTimeout(() => this.message = '', 3000);
  }

  getYouTubeThumb(url: string) {
    return this.fire.getYouTubeThumbnail(url);
  }

  logout() { this.auth.logout(); }

  get newInquiries() { return this.inquiries.filter(i => i.status === 'new').length; }
}
