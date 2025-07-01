import { Component, inject, ViewChild } from "@angular/core";
import { ICategory } from "../../interfaces";
import { CategoriaFormComponent } from "../../components/categorias/categoria-form/categoria-form.component";
import { CategoriaListComponent } from "../../components/categorias/categoria-list/categoria-list.component";
import { CategoriaService } from "../../services/categoria.service";
import { PaginationComponent } from "../../components/pagination/pagination.component";
import { FormBuilder, Validators } from "@angular/forms";
import { ModalService } from "../../services/modal.service";
import { ModalComponent } from "../../components/modal/modal.component";
import { AuthService } from "../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component  ({
  selector: "app-categoria",
  templateUrl: "./categorias.component.html",
  styleUrls: ["./categorias.component.scss"],
  standalone: true,
  imports: [
    CategoriaFormComponent,
    CategoriaListComponent,
    PaginationComponent,
    ModalComponent
  ]
})
export class CategoriaComponent {
    categoriaList: ICategory[] = []
    public categoriaService: CategoriaService = inject(CategoriaService);
    public fb: FormBuilder = inject(FormBuilder);
    public categoriaForm = this.fb.group({
        id: [''],
        nombre: ['', Validators.required],
        descripcion: ['', Validators.required]
    });

    public modalService: ModalService = inject(ModalService);
    @ViewChild('editCategoriaModal') public editCategoriaModal: any;

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
        this.categoriaService.getAll();
    }

    saveCategoria(item: ICategory) {
      this.categoriaService.save(item);
    }

    updateCategoria(item: ICategory) {
      this.categoriaService.update(item);
      this.modalService.closeAll();
      this.categoriaForm.reset();
    }

   openEditCategoriaModal(categoria: ICategory) {
      console.log("openEditCategoriaModal", categoria);
      this.categoriaForm.patchValue({
        id: JSON.stringify(categoria.id),
        nombre: categoria.nombre,
        descripcion: categoria.descripcion
      });
      this.modalService.displayModal('lg', this.editCategoriaModal)
  }

  deleteCategoria(categoria: ICategory) {
    this.categoriaService.delete(categoria)
  }
}