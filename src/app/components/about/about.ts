import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-about',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './about.html',
    styleUrls: ['./about.scss']
})
export class AboutComponent implements OnInit, OnDestroy {

    gridVisible = false;
    storyVisible = false;

    stats = [
        { current: 0, target: 15, suffix: '+', label: 'Years Experience' },
        { current: 0, target: 12, suffix: '+', label: 'Destinations' },
        { current: 0, target: 100, suffix: '%', label: 'Client Creative Satisfaction' },
        { current: 0, target: 1, suffix: 'M +', label: 'Moments Captured', large: true },
    ];

    private gridEl: Element | null = null;
    private storyEl: Element | null = null;
    private observer: IntersectionObserver | null = null;
    private countersStarted = false;

    ngOnInit() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === this.gridEl) this.gridVisible = true;
                        if (entry.target === this.storyEl) {
                            this.storyVisible = true;
                            this.startCounters();
                        }
                    }
                });
            },
            { threshold: 0.15 }
        );

        // Observe elements after view init
        setTimeout(() => {
            this.gridEl = document.querySelector('.grid-side');
            this.storyEl = document.querySelector('.story-side');
            if (this.gridEl) this.observer!.observe(this.gridEl);
            if (this.storyEl) this.observer!.observe(this.storyEl);
        }, 100);
    }

    ngOnDestroy() {
        this.observer?.disconnect();
    }

    startCounters() {
        if (this.countersStarted) return;
        this.countersStarted = true;

        const duration = 2000;
        const fps = 60;
        const totalFrames = (duration / 1000) * fps;
        const frameTime = 1000 / fps;

        this.stats.forEach(stat => {
            let frame = 0;
            const timer = setInterval(() => {
                frame++;
                const progress = frame / totalFrames;

                // easeOutQuad
                const easeOut = progress * (2 - progress);

                if (frame >= totalFrames) {
                    stat.current = stat.target;
                    clearInterval(timer);
                } else {
                    stat.current = Math.floor(stat.target * easeOut);
                }
            }, frameTime);
        });
    }
}
