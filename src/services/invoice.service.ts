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

  private clientId: number;
  private httpClient = inject(HttpClient);

  constructor() {
    this.listenEffects();
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

  private listenEffects(): void {
    effect(() => {
      if (this.invoiceList() === null) {
        return;
      }
      console.log('Guardando listado en localStorage...');
      localStorage.setItem(`${this.localStorageItemName}-${this.clientId}`, JSON.stringify(this.invoiceList()));
    });
  }
}
