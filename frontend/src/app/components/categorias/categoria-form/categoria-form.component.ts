import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ICategory } from "../../../interfaces";

@Component({
  selector: "app-categoria-form",
  templateUrl: "./categoria-form.component.html",
  styleUrls: ["./categoria-form.component.scss"],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ]
})
export class CategoriaFormComponent {
  public fb: FormBuilder = new FormBuilder();
  @Input() form!: FormGroup;
  @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  callSave() {
    let item: ICategory = {
      nombre: this.form.controls["nombre"].value,
      descripcion: this.form.controls["descripcion"].value
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