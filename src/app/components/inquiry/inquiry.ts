import { Component, OnInit } from '@angular/core';
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
export class InquiryComponent implements OnInit {
  form!: FormGroup;
  submitting = false;
  submitted = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      weddingDate: ['', Validators.required],
      venue: [''],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
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
}
