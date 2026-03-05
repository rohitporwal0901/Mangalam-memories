import { Injectable, inject } from '@angular/core';
import {
  Auth, signInWithEmailAndPassword,
  signOut, user
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { from, Observable, of, throwError } from 'rxjs';

const DUMMY_ADMIN_EMAIL = 'admin@gmail.com';
const DUMMY_ADMIN_PASSWORD = 'password';
const DUMMY_AUTH_KEY = 'mm_admin_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);

  isLoggedIn(): Observable<boolean> {
    // Check dummy session first
    if (localStorage.getItem(DUMMY_AUTH_KEY) === '1') {
      return of(true);
    }
    return this.user$.pipe(
      take(1),
      map(u => {
        if (!u) { this.router.navigate(['/admin/login']); return false; }
        return true;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    // ── Dummy bypass ──────────────────────────────────────────
    if (
      email.trim().toLowerCase() === DUMMY_ADMIN_EMAIL &&
      password === DUMMY_ADMIN_PASSWORD
    ) {
      localStorage.setItem(DUMMY_AUTH_KEY, '1');
      return of({ user: { email: DUMMY_ADMIN_EMAIL } });
    }

    // ── Real Firebase Auth ─────────────────────────────────────
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    // Clear dummy session
    localStorage.removeItem(DUMMY_AUTH_KEY);
    return from(signOut(this.auth)).subscribe({
      next: () => this.router.navigate(['/admin/login']),
      error: () => this.router.navigate(['/admin/login'])   // still navigate on error
    });
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  get isDummySession(): boolean {
    return localStorage.getItem(DUMMY_AUTH_KEY) === '1';
  }
}
