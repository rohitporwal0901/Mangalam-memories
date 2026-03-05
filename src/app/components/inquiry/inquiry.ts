import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase';

@Component({
  selector: 'app-inquiry',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inquiry.html',
  styleUrls: ['./inquiry.scss']
})
export class InquiryComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  submitting = false;
  submitted = false;
  error = '';

  headerVisible = false;
  contentVisible = false;

  private observer: IntersectionObserver | null = null;

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      partnerName: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[+]?[0-9\s\-]{8,15}$/)]],
      weddingDate: ['', Validators.required],
      venue: [''],
      services: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (el.classList.contains('section-header')) this.headerVisible = true;
          if (el.classList.contains('inquiry-inner')) this.contentVisible = true;
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document.querySelectorAll('#contact .section-header, #contact .inquiry-inner')
        .forEach(el => this.observer!.observe(el));
    }, 100);
  }

  f(field: string) { return this.form.get(field)!; }

  async submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting = true;
    this.error = '';
    try {
      await this.firebaseSvc.addInquiry(this.form.value).toPromise();
      this.submitted = true;
      this.submitting = false;
    } catch (e) {
      this.error = 'Something went wrong. Please try again.';
      this.submitting = false;
    }
  }

  reset() { this.submitted = false; this.form.reset(); }

  ngOnDestroy() { this.observer?.disconnect(); }
}
