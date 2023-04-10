import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  Input,
} from '@angular/core';
import { INVOICE_STATUS } from '../../enum/invoice-status.enum';
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
  @Input() item: Invoice;

  readonly INVOICE_STATUS = INVOICE_STATUS;
  private invoiceService = inject(InvoiceService);

  changeToDone(): void {
    this.item.status = INVOICE_STATUS.DONE;
    this.updateData();
  }

  changeToPending(): void {
    this.item.status = INVOICE_STATUS.PENDING;
    this.updateData();
  }

  private updateData(): void {
    this.invoiceService.invoiceItem.set(this.item);

    this.invoiceService.invoiceList.update((list: Invoice[]) => {
      return list.map(item => item.invoiceId === this.item.invoiceId ? this.item : item );
    });
  }
}
