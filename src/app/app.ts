import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './components/loader/loader';
import { LoaderService } from './services/loader';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent],
  template: `
    <app-loader *ngIf="showLoader" (loaderDone)="onLoaderDone()"></app-loader>
    <router-outlet *ngIf="!showLoader"></router-outlet>
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
