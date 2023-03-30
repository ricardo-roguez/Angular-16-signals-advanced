import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, Signal } from '@angular/core';
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
  private invoiceService = inject(InvoiceService);
  private invoicesInDoneSignabble = computed(() =>  this.invoiceListArray().filter((item) => item.status === 'DONE'));
  
  invoiceListArray = this.invoiceService.invoiceList;
  finishedCount!: Signal<number>;
  totalAmount!: Signal<number>;

  ngOnInit() {
    this.finishedCount = computed(() => this.invoicesInDoneSignabble().length);
    this.totalAmount = computed(() => this.invoicesInDoneSignabble().reduce((accumulator, invoice) =>  accumulator + invoice.amount, 0))
  }
}
