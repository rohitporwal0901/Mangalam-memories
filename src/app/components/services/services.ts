import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Service {
    badge: string;
    title: string;
    desc: string;
    features: string[];
    imageUrl: string;
}

@Component({
    selector: 'app-services',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './services.html',
    styleUrls: ['./services.scss']
})
export class ServicesComponent implements OnInit {

    headerVisible = false;
    visibleCards: Set<number> = new Set();

    services: Service[] = [
        {
            badge: 'PREMIUM',
            title: 'Wedding Photography',
            desc: 'Capture every precious moment of your special day with our award-winning photography team. We blend candid storytelling with artistic portraits to create a timeless collection.',
            features: [
                'Full-day candid & portrait coverage',
                'Curated fine-art image collection',
                'Private luxury online gallery',
                'Dual-photographer for seamless storytelling',
            ],
            imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'
        },
        {
            badge: 'CINEMATIC',
            title: 'Wedding Films',
            desc: 'Let us tell your love story through cinematic excellence. Our films are crafted with the same care and artistry as Bollywood productions, creating memories that move you.',
            features: [
                'Signature cinematic highlight film in 4K',
                'Full ceremony & celebration coverage',
                'Drone aerials for grand perspectives',
                'Licensed score & refined audio design',
            ],
            imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=800&q=80'
        },
        {
            badge: 'EXCLUSIVE',
            title: 'Pre-Wedding Shoots',
            desc: 'Create stunning pre-wedding memories at breathtaking locations across India. Our shoots combine adventure with romance for truly unique portraits.',
            features: [
                'Destination & location curation',
                'Styling and visual direction consultation',
                'Edited signature image collection',
                'Same-day curated previews',
            ],
            imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80'
        },
    ];

    constructor(private el: ElementRef) { }

    ngOnInit() {
        setTimeout(() => this.checkVisibility(), 200);
    }

    @HostListener('window:scroll')
    checkVisibility() {
        const header = this.el.nativeElement.querySelector('.section-header');
        if (header) {
            const r = header.getBoundingClientRect();
            if (r.top < window.innerHeight - 60) this.headerVisible = true;
        }
        const cards = this.el.nativeElement.querySelectorAll('.service-card');
        cards.forEach((c: Element, i: number) => {
            const r = c.getBoundingClientRect();
            if (r.top < window.innerHeight - 60) this.visibleCards.add(i);
        });
    }

    isVisible(i: number) { return this.visibleCards.has(i); }

    scrollToContact() {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
}
