import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  SettableSignal,
} from '@angular/core';
import { Invoice } from '../../interfaces/invoice';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-item.component.html',
  styleUrls: ['./invoice-item.component.css'],
})
export class InvoiceItemComponent {
  @Input() item!: Invoice;

  private invoiceService = inject(InvoiceService);

  changeToDone(): void {
    this.item.status = 'DONE';
    this.invoiceService.invoiceItem.update(() => this.item);
  }

  changeToPending(): void {
    this.item.status = 'PENDING';
    this.invoiceService.invoiceItem.update(() => this.item);
  }
}
