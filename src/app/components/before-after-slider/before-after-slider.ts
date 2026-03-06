import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-before-after-slider',
  standalone: true,
  imports: [],
  templateUrl: './before-after-slider.html',
  styleUrls: ['./before-after-slider.scss'],
})
export class BeforeAfterSlider {
  sliderValue = 50;
  isDragging = false;

  // Simulate an unedited photo via high-quality dark wedding photo vs edited lighter photo
  beforeImage = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
  afterImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';

  @ViewChild('container') containerRef!: ElementRef;

  startDrag(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.updateSlider(event);
  }

  @HostListener('window:mouseup')
  @HostListener('window:touchend')
  stopDrag() {
    this.isDragging = false;
  }

  @HostListener('window:mousemove', ['$event'])
  @HostListener('window:touchmove', ['$event'])
  onDrag(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.updateSlider(event);
  }

  private updateSlider(event: MouseEvent | TouchEvent) {
    if (!this.containerRef) return;

    // Get clientX from either MouseEvent or TouchEvent
    const clientX = 'touches' in event
      ? event.touches[0].clientX
      : (event as MouseEvent).clientX;

    const rect = this.containerRef.nativeElement.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;

    // Clamp between 0 and 100
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    this.sliderValue = percentage;
  }
}
