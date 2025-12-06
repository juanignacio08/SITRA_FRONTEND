import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modalerror',
  imports: [],
  templateUrl: './modalerror.component.html',
  styleUrl: './modalerror.component.css'
})
export class ModalerrorComponent {
  messageDefault: string = "Ha ocurrido un error. Por favor, intente nuevamente.";

  constructor(
    private dialogRef: MatDialogRef<ModalerrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any
  ) {
    console.log(data);
    
  }

  exit() {
    const message = "usuario";
    this.dialogRef.close(message);  
  }
}
