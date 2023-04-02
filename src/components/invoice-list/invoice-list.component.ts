import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap } from 'rxjs';
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
export class InvoiceListComponent implements OnInit {
  private route = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private invoiceService = inject(InvoiceService);

  invoicesInDone: Signal<Invoice[]> = signal([]);
  invoiceList: Signal<Invoice[]> = signal([]);
  totalAmount: Signal<number> = signal(0);

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map(data => data.id),
        switchMap((id) => this.invoiceService.getInvoicesByClient(id)),
        tap((data) => this.invoiceList = data),
        tap(() => this.initSignals())
      )
      .subscribe()   
  }

  backToClientList(): void {
    this.route.navigate(['/'])
  }

  private initSignals() {
    this.invoicesInDone = computed(() => this.invoiceList().filter((item) => item.status === 'DONE'));
    this.totalAmount = computed(() => this.invoicesInDone().reduce((accumulator, invoice) =>  accumulator + invoice.amount, 0));
  }
}
