import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
    icon: string;
    title: string;
    desc: string;
    tag?: string;
    locations?: string[];
    highlight?: boolean;
}

@Component({
    selector: 'app-why-choose-us',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './why-choose-us.html',
    styleUrls: ['./why-choose-us.scss']
})
export class WhyChooseUsComponent implements OnInit {

    headerVisible = false;
    visibleCards: Set<number> = new Set();

    features: Feature[] = [
        {
            icon: '🗺️',
            title: 'Pan-India Specialists',
            desc: 'From the palaces of Rajasthan and beaches of Goa to the hills of Himachal, we\'ve captured love stories across every corner of India. Our team travels to your destination.',
            locations: ['Rajasthan', 'Goa', 'Kerala', 'Himachal', 'Delhi NCR'],
            highlight: true
        },
        {
            icon: '🎬',
            title: 'Cinematic Excellence',
            desc: 'Professional cinema cameras, drone aerials, and precision lighting — every frame worthy of a magazine cover.',
            tag: '4K CINEMA QUALITY'
        },
        {
            icon: '👥',
            title: 'Dedicated Team',
            desc: 'A dedicated crew of lead photographers, videographers, and lighting experts working in perfect harmony on your big day.',
            tag: 'EXPERT CREW'
        },
        {
            icon: '💎',
            title: 'Luxury Deliverables',
            desc: 'Premium photo albums, cinematic wedding films, and private online galleries. Your memories presented with the elegance they deserve.',
            tag: 'PREMIUM FINISH'
        },
        {
            icon: '⭐',
            title: 'Trusted by Families',
            desc: 'Celebrated across India for capturing authentic emotions — from candid mehendi laughter to tearful vidaai moments.',
            tag: '500+ WEDDINGS'
        }
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
        const cards = this.el.nativeElement.querySelectorAll('.feature-card');
        cards.forEach((c: Element, i: number) => {
            const r = c.getBoundingClientRect();
            if (r.top < window.innerHeight - 60) this.visibleCards.add(i);
        });
    }

    isVisible(i: number) { return this.visibleCards.has(i); }
}
