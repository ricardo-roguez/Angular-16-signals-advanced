import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, Signal } from '@angular/core';
import { fromObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
import { INVOICE_STATUS } from '../../enum/invoice-status.enum';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceItemComponent } from '../invoice-item/invoice-item.component';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, InvoiceItemComponent],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css'],
})
export class InvoiceListComponent {
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);
 
  invoiceList: Signal<Invoice[]> = signal([]);
  invoicesInDone: Signal<Invoice[]> = signal([]);
  totalAmountInDone: Signal<number> = signal(0);

  constructor() {
    this.invoiceList = fromObservable(
      this.activatedRoute.params
        .pipe(
          map(params => params.id),
          switchMap((clientId: number) => this.invoiceService.getInvoicesByClient(clientId)),
          tap(() => this.initSignals())
        ));
  }

  backToClientList(): void {
    this.route.navigate(['/']);
  }

  private initSignals(): void {
    this.invoiceList = computed(() => this.invoiceService.invoiceList());
    this.invoicesInDone = computed(() => this.invoiceList().filter((item) => item.status === INVOICE_STATUS.DONE));
    this.totalAmountInDone = computed(() => this.invoicesInDone().reduce((accumulator, invoice) => accumulator + invoice.amount, 0));
  }
}
