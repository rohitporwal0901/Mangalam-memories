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

    stats: { value: string; label: string; large?: boolean }[] = [
        { value: '15+', label: 'Years Experience' },
        { value: '12+', label: 'Destinations' },
        { value: '100%', label: 'Client Creative Satisfaction' },
        { value: '1M +', label: 'Moments Captured', large: true },
    ];

    private gridEl: Element | null = null;
    private storyEl: Element | null = null;
    private observer: IntersectionObserver | null = null;

    ngOnInit() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (entry.target === this.gridEl) this.gridVisible = true;
                        if (entry.target === this.storyEl) this.storyVisible = true;
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
}
