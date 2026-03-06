import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { FeaturedArchivesComponent } from '../../components/featured-archives/featured-archives';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us';
import { ServicesComponent } from '../../components/services/services';
import { TestimonialsComponent } from '../../components/testimonials/testimonials';
import { AboutComponent } from '../../components/about/about';
import { GalleryModalComponent } from '../../components/gallery-modal/gallery-modal';
import { FilmsComponent } from '../../components/films/films';
import { InquiryComponent } from '../../components/inquiry/inquiry';
import { FooterComponent } from '../../components/footer/footer';
import { BeforeAfterSlider } from '../../components/before-after-slider/before-after-slider';
import { Archive } from '../../services/firebase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturedArchivesComponent,
    WhyChooseUsComponent,
    ServicesComponent,
    BeforeAfterSlider,
    TestimonialsComponent,
    AboutComponent,
    FilmsComponent,
    InquiryComponent,
    FooterComponent,
    GalleryModalComponent,
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  selectedArchive: Archive | null = null;

  ngOnInit() { }

  openGallery(archive: Archive) {
    this.selectedArchive = archive;
  }

  closeGallery() {
    this.selectedArchive = null;
  }
}
