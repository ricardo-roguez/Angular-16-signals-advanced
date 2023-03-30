import { Component } from "@angular/core";

@Component({
  selector: 'my-app',
  template: `
    <h1>Testing Signals!</h1>
    <div class='main-component'>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {}