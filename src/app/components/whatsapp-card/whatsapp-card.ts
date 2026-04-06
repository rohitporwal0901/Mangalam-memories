import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-whatsapp-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './whatsapp-card.html',
  styleUrls: ['./whatsapp-card.scss']
})
export class WhatsAppCardComponent implements OnInit {
  isVisible = false;
  phoneNumber = '9691752388';
  ownerImage = 'assets/images/owner.jpg'; // Path to the sketch photo in assets folder

  ngOnInit() { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Show after scrolling 20% of the page or 400px
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    this.isVisible = scrollPosition > 400;
  }

  openWhatsApp() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const message = encodeURIComponent('Hello! I clicked on your website and would like to connect.');

    if (isMobile) {
      // In mobile, just try to open the app directly
      window.location.href = `whatsapp://send?phone=91${this.phoneNumber}&text=${message}`;
    } else {
      // On desktop, use the web link
      const url = `https://wa.me/91${this.phoneNumber}?text=${message}`;
      window.open(url, '_blank');
    }
  }
}
