import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
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
export class InvoiceListComponent implements OnInit, OnDestroy {
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);
  private onDestroy$ = new Subject<void>();

  invoicesInDone: Signal<Invoice[]> = signal([]);
  invoiceList: Signal<Invoice[]> = signal([]);
  totalAmountInDone: Signal<number> = signal(0);

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map(params => params.id),
        switchMap((clientId: number) => this.invoiceService.getInvoicesByClient(clientId)),
        tap((data: Signal<Invoice[]>) => this.invoiceList = data),
        tap(() => this.initSignals()),
        takeUntil(this.onDestroy$)
      )
      .subscribe();   
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  backToClientList(): void {
    this.route.navigate(['/']);
  }

  private initSignals(): void {
    this.invoicesInDone = computed(() => this.invoiceList().filter((item) => item.status === INVOICE_STATUS.DONE));
    this.totalAmountInDone = computed(() => this.invoicesInDone().reduce((accumulator, invoice) => accumulator + invoice.amount, 0));
  }
}
