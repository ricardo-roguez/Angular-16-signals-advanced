import { effect, Injectable, SettableSignal, signal } from '@angular/core';
import { Invoice } from '../interfaces/invoice';
import { FAKE_INVOICE_LIST } from '../mocks/invoice.list.mocks';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly localStorageItemName = 'invoice-list';

  invoiceList: SettableSignal<Invoice[]>;
  invoiceItem: SettableSignal<Invoice | null> = signal(null);

  constructor() {
    const itemsFromStorage = this.getItemsFromStorage();
    this.invoiceList = signal(itemsFromStorage);
    this.listenItemEffects();
    this.listenItemListEffects();
  }

  getItemsFromStorage(): Invoice[] {
    const itemsStr = localStorage.getItem(this.localStorageItemName);
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
      localStorage.setItem(this.localStorageItemName, JSON.stringify(this.invoiceList()));
    });
  }
}
