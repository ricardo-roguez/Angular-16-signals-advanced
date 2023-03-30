import { HttpClient } from '@angular/common/http';
import { effect, Injectable, SettableSignal, signal } from '@angular/core';
import { map, Observable, of, tap, } from 'rxjs';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly localStorageItemName = 'invoice-list';
  private clientId: number;

  invoiceList: SettableSignal<Invoice[] | null> = signal(null);
  invoiceItem: SettableSignal<Invoice | null> = signal(null);

  constructor(private httpClient: HttpClient) {
    this.listenItemEffects();
    this.listenItemListEffects();
  }

  getInvoicesByClient(clientId: number): Observable<SettableSignal<Invoice[]>> {
    this.clientId = clientId;
    return this.getItemsFromStorage();

  }

  getItemsFromStorage():  Observable<SettableSignal<Invoice[]>> {
    const itemsStr = localStorage.getItem(`${this.localStorageItemName}-${this.clientId}`);
    if (itemsStr) {
      this.invoiceList.set(JSON.parse(itemsStr));
      return of(this.invoiceList)
    } else {
      return this.httpClient.get('assets/invoice-list.json')
        .pipe(
          tap((data: Invoice[]) => this.invoiceList.set(data)), 
          map(() => this.invoiceList)
        )
    }
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
      localStorage.setItem(`${this.localStorageItemName}-${this.clientId}`, JSON.stringify(this.invoiceList()));
    });
  }
}
