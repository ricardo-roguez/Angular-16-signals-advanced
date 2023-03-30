import { effect, Injectable, SettableSignal, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Invoice } from '../interfaces/invoice';
import { FAKE_INVOICE_LIST } from '../mocks/invoice.list.mocks';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly localStorageItemName = 'invoice-list';
  private clientId: number;

  invoiceList: SettableSignal<Invoice[] | null> = signal(null);
  invoiceItem: SettableSignal<Invoice | null> = signal(null);

  constructor() {
    this.listenItemEffects();
    this.listenItemListEffects();
  }

  getInvoicesByClient(clientId: number): Observable<SettableSignal<Invoice[]>> {
    this.clientId = clientId;
    const itemsFromStorage = this.getItemsFromStorage();
    this.invoiceList.set(itemsFromStorage);
    return of(this.invoiceList);
  }

  getItemsFromStorage(): Invoice[] {
    const itemsStr = localStorage.getItem(`${this.localStorageItemName}-${this.clientId}`);
    return itemsStr ? JSON.parse(itemsStr) : FAKE_INVOICE_LIST;
  }

  private listenItemEffects(): void {
    effect(() => {
      if (this.invoiceItem() === null) {
        return;
      }
      
      console.log('Guardando item en la base de datos...', this.invoiceItem());
      this.invoiceList.update((list) => list);
    });
  }

  private listenItemListEffects(): void {
    effect(() => {
      if(this.invoiceList() === null) {
        return;
      }

      localStorage.setItem(`${this.localStorageItemName}-${this.clientId}`, JSON.stringify(this.invoiceList()));
    });
  }
}
