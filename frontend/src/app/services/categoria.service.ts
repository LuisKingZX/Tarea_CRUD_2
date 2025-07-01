import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, IResponse, ISearch } from '../interfaces';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends BaseService<ICategory> {
  protected override source: string = 'categorias';
  private categoriaListSignal = signal<ICategory[]>([]);
  get categorias$() {
    return this.categoriaListSignal;
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
      next: (response: IResponse<ICategory[]>) => {
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from({ length: this.search.totalPages ? this.search.totalPages : 0 }, (_, i) => i + 1);
        this.categoriaListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('error', err);
      }
    });
  }

  save(item: ICategory) {
    this.add(item).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the categorie', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  update(item: ICategory) {
    this.edit(item.id, item).subscribe({
      next: (response: IResponse<ICategory>) => {
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        this.alertService.displayAlert('error', 'An error occurred adding the categorie', 'center', 'top', ['error-snackbar']);
        console.error('error', err);
      }
    });
  }

  delete(item: ICategory) {
    this.del(item.id).subscribe({
      next: (response: IResponse<ICategory>) => {
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
