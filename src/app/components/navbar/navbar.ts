import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class NavbarComponent implements OnInit {
  scrolled = false;
  menuOpen = false;
  scrollY = 0;

  navLinks = [
    { label: 'Home', fragment: 'home' },
    { label: 'Archives', fragment: 'archives' },
    { label: 'Films', fragment: 'films' },
    { label: 'Services', fragment: 'services' },
    { label: 'Contact', fragment: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY = window.scrollY;
    this.scrolled = window.scrollY > 80;
  }

  ngOnInit() { this.onScroll(); }

  scrollTo(fragment: string) {
    const el = document.getElementById(fragment);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.menuOpen = false;
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }
}
