import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { FeaturedArchivesComponent } from '../../components/featured-archives/featured-archives';
import { GalleryModalComponent } from '../../components/gallery-modal/gallery-modal';
import { FilmsComponent } from '../../components/films/films';
import { InquiryComponent } from '../../components/inquiry/inquiry';
import { FooterComponent } from '../../components/footer/footer';
import { Archive } from '../../services/firebase';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturedArchivesComponent,
    GalleryModalComponent,
    FilmsComponent,
    InquiryComponent,
    FooterComponent,
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
