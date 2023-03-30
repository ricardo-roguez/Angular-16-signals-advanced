import { Component } from "@angular/core";

@Component({
  selector: 'my-app',
  template: `
    <h1>Manager de Facturas</h1>
    <div class='main-component'>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}