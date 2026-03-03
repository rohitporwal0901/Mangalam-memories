import { Injectable, inject } from '@angular/core';
import {
  Auth, signInWithEmailAndPassword,
  signOut, user
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = user(this.auth);

  isLoggedIn(): Observable<boolean> {
    return this.user$.pipe(
      take(1),
      map(u => {
        if (!u) { this.router.navigate(['/admin/login']); return false; }
        return true;
      })
    );
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth)).subscribe(() => this.router.navigate(['/admin/login']));
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }
}
