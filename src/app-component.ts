import { Component } from "@angular/core";

@Component({
  selector: 'my-app',
  template: `
    <div class='main-component'>
      <h1>Manager de Facturas</h1>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}