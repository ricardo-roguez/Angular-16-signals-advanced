import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, SettableSignal, Signal } from '@angular/core';
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
  
  private invoicesInDoneSignabble = computed(() => this.invoiceListArray().filter((item) => item.status === 'DONE'));
  
  invoiceListArray: SettableSignal<Invoice[]>;
  finishedCount!: Signal<number>;
  totalAmount!: Signal<number>;

  ngOnInit() {
    this.activatedRoute.params
      .pipe(
        map(data => data.id),
        switchMap((id) => this.invoiceService.getInvoicesByClient(id)),
        tap((data) => this.invoiceListArray = data)
      )
      .subscribe()

    this.finishedCount = computed(() => this.invoicesInDoneSignabble().length);
    this.totalAmount = computed(() => this.invoicesInDoneSignabble().reduce((accumulator, invoice) =>  accumulator + invoice.amount, 0))
  }

  backToClientList(): void {
    this.route.navigate(['/'])
  }
}
