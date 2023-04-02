import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
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
    this.invoiceService.invoiceItem.set({ ...this.item, status: 'DONE' });
  }

  changeToPending(): void {
    this.invoiceService.invoiceItem.set({ ...this.item, status: 'PENDING' });
  }
}
