import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
    icon: string;
    title: string;
    desc: string;
    tag?: string;
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
            title: 'Pan-India Coverage',
            desc: 'From Rajasthan\'s palaces to Goa\'s beaches and Kerala\'s backwaters — we travel wherever your love story takes us.',
            tag: 'DESTINATION READY'
        },
        {
            icon: '🎬',
            title: 'Cinematic Excellence',
            desc: 'Professional cinema cameras, drone aerials, and precision lighting — every frame worthy of a magazine cover.',
            tag: '4K CINEMA'
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
            desc: 'Premium photo albums, cinematic highlight films, and private online galleries — presented with the elegance they deserve.',
            tag: 'PREMIUM FINISH'
        },
        {
            icon: '⌚',
            title: 'Timeline Guaranteed',
            desc: 'We respect your timeline. Final photos and films delivered on schedule, every time, without compromising quality.',
            tag: 'ON-TIME DELIVERY'
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
