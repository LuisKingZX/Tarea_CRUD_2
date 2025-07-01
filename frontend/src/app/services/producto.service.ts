import { inject, Injectable, signal } from '@angular/core';
import { ICategory, IProduct, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root',
})
export class ProductoService extends BaseService<IProduct> {
  protected override source = 'productos';

  private _productosSignal = signal<IProduct[]>([]);
  get productos$() {
    return this._productosSignal;
  }

  public searchParams: ISearch = {
    page: 1,
    size: 3,
  };

  public totalPagesArray: number[] = [];

  private alertSvc = inject(AlertService);

  obtenerTodos() {
    this.findAllWithParams({ page: this.searchParams.page, size: this.searchParams.size }).subscribe({
      next: (res: IResponse<IProduct[]>) => {
        this.searchParams = { ...this.searchParams, ...res.meta };
        const totalPages = this.searchParams.totalPages ?? 0;
        this.totalPagesArray = Array.from({ length: totalPages }, (_, i) => i + 1);
        this._productosSignal.set(res.data);
      },
      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }

  guardar(producto: IProduct) {
    this.add(producto).subscribe({
      next: (res: IResponse<IProduct>) => {
        this.alertSvc.displayAlert('success', res.message, 'center', 'top', ['success-snackbar']);
        this.obtenerTodos();
      },
      error: (err) => {
        if (
            err.status === 400 &&
            (err.error?.message?.toLowerCase().includes('categoría') || err.error?.message?.toLowerCase().includes('categoria'))
        ) {
          this.alertSvc.displayAlert('error', 'La categoría ingresada no existe en la base de datos.', 'center', 'top', ['error-snackbar']);
        } else {
          this.alertSvc.displayAlert('error', 'Ocurrió un error al guardar el producto.', 'center', 'top', ['error-snackbar']);
        }
      },
    });
  }

  actualizar(producto: IProduct) {
    this.edit(producto.id, producto).subscribe({
      next: (res: IResponse<IProduct>) => {
        this.alertSvc.displayAlert('success', res.message, 'center', 'top', ['success-snackbar']);
        this.obtenerTodos();
      },
      error: (err) => {
        this.alertSvc.displayAlert('error', 'Ocurrió un error al actualizar el producto.', 'center', 'top', ['error-snackbar']);
        console.error('Error updating product:', err);
      },
    });
  }

  eliminar(producto: IProduct) {
    this.del(producto.id).subscribe({
      next: (res: IResponse<IProduct>) => {
        this.alertSvc.displayAlert('success', res.message, 'center', 'top', ['success-snackbar']);
        this.obtenerTodos();
      },
      error: (err) => {
        this.alertSvc.displayAlert('error', 'Ocurrió un error al eliminar el producto.', 'center', 'top', ['error-snackbar']);
        console.error('Error deleting product:', err);
      },
    });
  }
}

