import 'zone.js/dist/zone';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [InvoiceListComponent, CommonModule],
  template: `
    <h1>Testing Signals!</h1>
    <div class='main-component'>
      <app-invoice-list />
    </div>
  `,
})
export class App {}

bootstrapApplication(App);
