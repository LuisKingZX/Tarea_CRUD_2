import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ICategory, IProduct } from "../../../interfaces";

@Component({
  selector: "app-producto-form",
  templateUrl: "./producto-form.component.html",
  styleUrls: ["./producto-form.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class ProductosFormComponent {
    public fb: FormBuilder = new FormBuilder();
    @Input() form!: FormGroup;
    @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
    @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
    
    callSave() {
    let item: IProduct = {
        nombre: this.form.controls["nombre"].value,
        descripcion: this.form.controls["descripcion"].value,
        precio: this.form.controls["precio"].value,
        cantidadStock: this.form.controls["cantidadStock"].value,
        categoria: {id: Number(this.form.controls["categoria"].value)
}

    }
    if (this.form.controls["id"].value) {
        item.id = this.form.controls["id"].value;
    }
    if (item.id) {
        this.callUpdateMethod.emit(item);
    } else {
        this.callSaveMethod.emit(item);
    }
    }
}