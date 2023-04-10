import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES_NAME } from '../../app-routing.module';

@Component({
  selector: 'app-client-list',
  standalone: true,
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent {
  private route = inject(Router);

  goToClient(clientId: number): void {
    this.route.navigate([`/${ROUTES_NAME.CLIENT}/${clientId}`]);
  }
}