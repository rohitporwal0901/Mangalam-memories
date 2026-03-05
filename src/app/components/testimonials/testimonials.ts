import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService, Testimonial } from '../../services/firebase';

@Component({
    selector: 'app-testimonials',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './testimonials.html',
    styleUrls: ['./testimonials.scss']
})
export class TestimonialsComponent implements OnInit, OnDestroy {

    testimonials: Testimonial[] = [];
    loading = true;
    activeIndex = 0;
    private autoTimer: any;

    private fallback: Testimonial[] = [
        {
            coupleNames: 'Priya & Arjun Sharma',
            location: 'Destination Wedding, Udaipur',
            quote: 'Mangalam Memories captured our wedding with such artistry and emotion. Every time we watch our film, we relive the magic of that day. They are truly artists who understand the depth of love.',
            rating: 5, order: 1, active: true
        },
        {
            coupleNames: 'Meera & Rohit Kapoor',
            location: 'Royal Wedding, Jaipur',
            quote: 'The team was incredibly professional and warm. They blended into our ceremony so naturally, yet captured every candid moment with perfection. Our gallery is beyond anything we imagined.',
            rating: 5, order: 2, active: true
        },
        {
            coupleNames: 'Ananya & Karthik Nair',
            location: 'Traditional Wedding, Mysore',
            quote: 'From our first call to the final delivery, the Mangalam Memories team made us feel so special. The attention to detail in our wedding film brought us to tears. Highly recommended!',
            rating: 5, order: 3, active: true
        },
        {
            coupleNames: 'Kavita & Rahul Verma',
            location: 'Beachside Wedding, Goa',
            quote: 'We were blown away by the pre-wedding shoot. They chose the most beautiful locations and the final photos looked like they were straight out of a magazine. Absolutely stunning work!',
            rating: 5, order: 4, active: true
        },
        {
            coupleNames: 'Divya & Sameer Gupta',
            location: 'Grand Celebration, Mumbai',
            quote: 'The best decision we made for our wedding was hiring Mangalam Memories. They understood our vision completely and delivered photographs that will be treasured for generations.',
            rating: 5, order: 5, active: true
        },
    ];

    constructor(private fb: FirebaseService) { }

    ngOnInit() {
        this.fb.getTestimonials().subscribe({
            next: data => {
                this.testimonials = data.length ? data : this.fallback;
                this.loading = false;
                this.startAutoPlay();
            },
            error: () => {
                this.testimonials = this.fallback;
                this.loading = false;
                this.startAutoPlay();
            }
        });
    }

    prev() {
        this.stopAutoPlay();
        this.activeIndex = (this.activeIndex - 1 + this.testimonials.length) % this.testimonials.length;
        this.startAutoPlay();
    }

    next() {
        this.stopAutoPlay();
        this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
        this.startAutoPlay();
    }

    get active(): Testimonial { return this.testimonials[this.activeIndex]; }

    stars(n: number) { return Array(n).fill(0); }

    private startAutoPlay() {
        this.autoTimer = setInterval(() => {
            this.activeIndex = (this.activeIndex + 1) % this.testimonials.length;
        }, 6000);
    }

    private stopAutoPlay() {
        if (this.autoTimer) clearInterval(this.autoTimer);
    }

    ngOnDestroy() { this.stopAutoPlay(); }
}
