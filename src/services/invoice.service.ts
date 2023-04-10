import { HttpClient } from '@angular/common/http';
import { effect, Injectable, WritableSignal, Signal, signal, inject } from '@angular/core';
import { map, Observable, of, tap, } from 'rxjs';
import { Invoice } from '../interfaces/invoice';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  readonly localStorageItemName = 'invoice-list';
  readonly invoiceListUrl = 'assets/invoice-list.json';
  readonly invoiceList: WritableSignal<Invoice[] | null> = signal(null);
  readonly invoiceItem: WritableSignal<Invoice | null> = signal(null);

  private clientId: number;
  private httpClient = inject(HttpClient);

  constructor() {
    this.listenItemEffects();
    this.listenItemListEffects();
  }

  getInvoicesByClient(clientId: number): Observable<Invoice[]> {
    this.clientId = clientId;
    const itemsStr = localStorage.getItem(`${this.localStorageItemName}-${this.clientId}`);

    if (itemsStr) {
      this.invoiceList.set(JSON.parse(itemsStr));
      return of(JSON.parse(itemsStr));
    } else {
      return this.httpClient.get(this.invoiceListUrl)
        .pipe(tap((data: Invoice[]) => this.invoiceList.set(data)));
    }
  }
  
  private listenItemEffects(): void {
    effect(() => {
      if (this.invoiceItem() === null) {
        return;
      }
      
      console.log('Guardando item en la base de datos...', this.invoiceItem());
    });
  }

  private listenItemListEffects(): void {
    effect(() => {
      if (this.invoiceList() === null) {
        return;
      }
      console.log('Guardando listado en localStorage...');
      localStorage.setItem(`${this.localStorageItemName}-${this.clientId}`, JSON.stringify(this.invoiceList()));
    });
  }
}
