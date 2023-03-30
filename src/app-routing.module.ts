import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClientListComponent } from './components/client-list/client-list.component';
import { InvoiceListComponent } from './components/invoice-list/invoice-list.component';


const routes: Routes = [{
  path: '',
  children: [
    { path: '', component: ClientListComponent },
    { path: 'client/:id', component: InvoiceListComponent },
  ],
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }