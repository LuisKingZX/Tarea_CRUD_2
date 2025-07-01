import { Component, inject, ViewChild } from "@angular/core";
import { ProductoListComponent } from "../../components/productos/producto-list/producto-list.component";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { ModalComponent } from "../../components/modal/modal.component";
import { IProduct } from "../../interfaces";
import { ProductoService } from "../../services/producto.service";
import { FormBuilder, Validators } from "@angular/forms";
import { ModalService } from "../../services/modal.service";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { ProductosFormComponent } from "../../components/productos/producto-form/producto-form.component";

@Component({
  selector: "app-productos",
  templateUrl: "./productos.component.html",
  styleUrls: ["./productos.component.scss"],
  imports: [
    ProductosFormComponent,
    ProductoListComponent,
    PaginationComponent,
    ModalComponent
  ],
  standalone: true
})
export class ProductosComponent {
categoriaList: IProduct[] = []
    public productoService: ProductoService = inject(ProductoService);
    public fb: FormBuilder = inject(FormBuilder);
    public productoForm = this.fb.group({
        id: [''],
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required],
        precio: ['', Validators.required],
        cantidadStock: ['', Validators.required],
        categoria: [[], Validators.required]
    });

    public modalService: ModalService = inject(ModalService);
    @ViewChild('editProductoModal') public editProdudctoModal: any;

    public authService: AuthService = inject(AuthService);
    public route: ActivatedRoute = inject(ActivatedRoute);
    public areActionsAvailable: boolean = false;
  
    ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
    this.areActionsAvailable =  this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []); 
    });
    }

    constructor() {
        this.productoService.getAll();
    }

    saveProducto(item: IProduct) {
      this.productoService.save(item);
    }

    updateProducto(item: IProduct) {
      this.productoService.update(item);
      this.modalService.closeAll();
      this.productoForm.reset();
    }

   openEditProductoModal(producto: IProduct) {
      console.log("openEditProductoModal", producto);
      this.productoForm.patchValue({
        id: JSON.stringify(producto.id),
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        cantidadStock: producto.cantidadStock
      });
      this.modalService.displayModal('lg', this.editProdudctoModal)
  }

  deleteProducto(producto: IProduct) {
    this.productoService.delete(producto)
  }
}