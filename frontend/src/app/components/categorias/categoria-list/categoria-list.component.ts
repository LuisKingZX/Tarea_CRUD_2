import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { ICategory } from "../../../interfaces";
import { ModalComponent } from "../../modal/modal.component";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-categoria-list",
  templateUrl: "./categoria-list.component.html",
  styleUrls: ["./categoria-list.component.scss"],
  standalone: true,
})
export class CategoriaListComponent {
   @Input() categoriaList: ICategory[] = [];
   @Output() callUpdateModalMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
   @Output() callDeleteMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
   public authService: AuthService = inject(AuthService);
   public route: ActivatedRoute = inject(ActivatedRoute);
   public areActionsAvailable: boolean = false;

   ngOnInit(): void {
    this.authService.getUserAuthorities();
    this.route.data.subscribe( data => {
      this.areActionsAvailable =  this.authService.areActionsAvailable(data['authorities'] ? data['authorities'] : []); 
    });
   }
}