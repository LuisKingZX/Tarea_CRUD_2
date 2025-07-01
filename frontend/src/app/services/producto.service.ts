import { inject, Injectable, signal } from '@angular/core';
import { ICategory, IProduct, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends BaseService<IProduct> {
  protected override source: string = 'productos';
  private productoListSignal = signal<IProduct[]>([]);
  get productos$() {
    return this.productoListSignal;
  } 

  public search: ISearch = { 
    page: 1,
    size: 3
  }

  public totalItems: any = [];
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size})
    .subscribe({
      next: (response: IResponse<IProduct[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.productoListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

save(item: IProduct) {
  this.add(item).subscribe({
    next: (response: IResponse<IProduct>) => {
      this.alertService.displayAlert(
        'success',
        response.message,
        'center',
        'top',
        ['success-snackbar']
      );
      this.getAll();
    },
    error: (err: any) => {
      if (
        err.status === 400 &&(err.error?.message?.includes("categoría") || err.error?.message?.includes("Categoria"))) {
        this.alertService.displayAlert(
          'error', 'La categoría ingresada no existe en la base de datos.', 'center', 'top', ['error-snackbar']
        );
      } else {
        this.alertService.displayAlert(
          'error', 'Ocurrió un error al guardar el producto.', 'center', 'top', ['error-snackbar']
        );
      }
    }
  });
}

  
    update(item: IProduct) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

    delete(item: IProduct) {
    this.del(item.id).subscribe({
      next: (response: IResponse<IProduct>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the team', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }
}
