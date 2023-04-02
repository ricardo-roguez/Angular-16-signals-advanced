import { HttpClient } from '@angular/common/http';
import { effect, Injectable, SettableSignal, Signal, signal } from '@angular/core';
import { map, Observable, of, tap, } from 'rxjs';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly localStorageItemName = 'invoice-list';
  readonly invoiceListUrl = 'assets/invoice-list.json';
  readonly invoiceList: SettableSignal<Invoice[] | null> = signal(null);

  private clientId: number;

  invoiceItem: SettableSignal<Invoice | null> = signal(null);

  constructor(private httpClient: HttpClient) {
    this.listenItemEffects();
    this.listenItemListEffects();
  }

  getInvoicesByClient(clientId: number): Observable<Signal<Invoice[]>> {
    this.clientId = clientId;
    const itemsStr = localStorage.getItem(`${this.localStorageItemName}-${this.clientId}`);

    if (itemsStr) {
      this.invoiceList.set(JSON.parse(itemsStr));
      return of(this.invoiceList);
    } else {
      return this.httpClient.get(this.invoiceListUrl)
        .pipe(
          tap((data: Invoice[]) => this.invoiceList.set(data)), 
          map(() => this.invoiceList)
        );
    }
  }
  
  private listenItemEffects(): void {
    effect(() => {
      if (this.invoiceItem() === null) {
        return;
      }
      
      console.log('Guardando item en la base de datos...', this.invoiceItem());
      
      this.invoiceList.update((list) => {
        return list.map(item => item.invoiceId === this.invoiceItem().invoiceId ? this.invoiceItem() : item );
      });
    });
  }

  private listenItemListEffects(): void {
    effect(() => {
      if (this.invoiceList() === null) {
        return;
      }
      localStorage.setItem(`${this.localStorageItemName}-${this.clientId}`, JSON.stringify(this.invoiceList()));
    });
  }
}
