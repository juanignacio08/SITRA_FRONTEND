import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Noticias } from '../../../models/reportes/noticias.model';
import { NoticiasService } from '../../../services/reportes/noticias.service';

@Component({
  selector: 'app-avisos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './avisos.component.html',
  styleUrls: ['./avisos.component.css'],
})
export class AvisosComponent implements OnInit {
  noticesList: Noticias[] = [];

  columnas = ['orden', 'aviso', 'estado', 'acciones'];

  form!: FormGroup;

  noticiasService = inject(NoticiasService);
  clickedEdit: boolean = false;
  noticiaSelect?: Noticias;

  ngOnInit(): void {
    this.form = new FormGroup({
      contenido: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
      ]),
    });

    this.reloadAvisos();
  }

  reloadAvisos() {
    this.noticiasService.getAll().subscribe({
      next: (response) => {
        this.noticesList = response.data;
      },
    });
  }

  sendForm(): void {
    if (this.form.valid) {
      const notice: Noticias = {
        noticiasId: this.noticiaSelect?.noticiasId || 1,
        contenido: this.form.value['contenido'],
        estado: 1,
      };

      if (this.noticiaSelect && this.clickedEdit) {
        this.noticiasService.update(notice).subscribe({
          next: (response) => {
            this.reloadAvisos();
            this.resetForm();
          },
          error: (err) => {
            console.error('Hubo un problema: ', err);
            this.resetForm();
          },
        });
      } else {
        this.noticiasService.save(notice).subscribe({
          next: (response) => {
            this.reloadAvisos();
            this.resetForm();
          },
          error: (err) => {
            console.error('Hubo un problema: ', err);
          },
        });
      }
    } else {
      this.form.markAllAsTouched();
    }
  }

  get f() {
    return this.form.controls;
  }

  resetForm() {
    this.form.reset({
      contenido: '',
    });
    this.clickedEdit = false;
    this.noticiaSelect = undefined;
  }

  edit(noticia: Noticias) {
    if (noticia) {
      this.clickedEdit = true;
      this.form.controls['contenido'].setValue(noticia.contenido);
      this.noticiaSelect = noticia;
    }
  }

  mostrar(noticia: Noticias) {
    if (noticia.estado === 0) {
      noticia.estado = 1;
      this.noticiasService.update(noticia).subscribe({
        next: (response) => {
          this.reloadAvisos();
          this.resetForm();
        },
        error: (err) => {
          console.error('Hubo un problema: ', err);
          this.resetForm();
        },
      });
    }
  }

  desactive(noticia: Noticias) {
    if (noticia.estado === 1) {
      noticia.estado = 0;
      this.noticiasService.update(noticia).subscribe({
        next: (response) => {
          this.reloadAvisos();
          this.resetForm();
        },
        error: (err) => {
          console.error('Hubo un problema: ', err);
          this.resetForm();
        },
      });
    }
  }

  delete(noticia: Noticias) {
    this.noticiasService.delete(noticia.noticiasId).subscribe({
      next: (response) => {
        this.reloadAvisos();
        this.resetForm();
      },
      error: (err) => {
        console.error('Hubo un problema: ', err);
        this.resetForm();
      },
    });
  }
}
