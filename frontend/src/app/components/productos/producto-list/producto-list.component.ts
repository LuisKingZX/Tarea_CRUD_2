import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { AuthService } from "../../../services/auth.service";
import { ActivatedRoute } from "@angular/router";
import { IProduct } from "../../../interfaces";

@Component({
  selector: "app-producto-list",
  templateUrl: "./producto-list.component.html",
  styleUrls: ["./producto-list.component.scss"],
  standalone: true
})
export class ProductoListComponent {
    @Input() productoList: IProduct[] = [];
    @Output() callUpdateModalMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
    @Output() callDeleteMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
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