import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader';
import { LoaderService } from './services/loader';
import { WhatsAppCardComponent } from './components/whatsapp-card/whatsapp-card';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent, WhatsAppCardComponent],
  template: `
    <app-loader *ngIf="showLoader" (loaderDone)="onLoaderDone()"></app-loader>
    <router-outlet></router-outlet>
    <app-whatsapp-card></app-whatsapp-card>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class App implements OnInit {
  showLoader = true;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.show();
  }

  onLoaderDone() {
    this.showLoader = false;
    this.loaderService.hide();
  }
}
