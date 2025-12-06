import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/seguridad/usuario.service';

@Component({
  selector: 'app-sig-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './sig-in.component.html',
  styleUrls: ['./sig-in.component.css'],
})
export class SigInComponent implements OnInit, AfterViewInit {
  loginForm!: FormGroup;
  hide = true;

  errorMessage ?: string;
  loadSignIn: boolean = false;

  @ViewChild('loginContainer') container!: ElementRef;
  @ViewChild('wave1') wave1!: ElementRef;
  @ViewChild('wave2') wave2!: ElementRef;

  waves = [
    { el: null as any, x: 50, y: 50, vx: 2, vy: 2 },
    { el: null as any, x: 100, y: 100, vx: 3, vy: 1.5 },
  ];

  constructor(
    private fb: FormBuilder,
    private usuarioService : UsuarioService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Forzamos que Angular actualice el DOM al iniciar
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // Asignamos referencias a los elementos
    this.waves[0].el = this.wave1.nativeElement;
    this.waves[1].el = this.wave2.nativeElement;

    this.animateWaves();
  }

  animateWaves(): void {
    const containerWidth = this.container.nativeElement.offsetWidth;
    const containerHeight = this.container.nativeElement.offsetHeight;

    const move = () => {
      this.waves.forEach((w) => {
        w.x += w.vx;
        w.y += w.vy;

        // Rebote horizontal
        if (w.x <= 0 || w.x >= containerWidth - 40) w.vx *= -1;
        // Rebote vertical
        if (w.y <= 0 || w.y >= containerHeight - 40) w.vy *= -1;

        w.el.style.left = w.x + 'px';
        w.el.style.top = w.y + 'px';
      });

      requestAnimationFrame(move);
    };

    move();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      console.log('Formulario inválido');
      return;
    }

    if (this.loginForm.valid) {
      this.loadSignIn = true;
      const user = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      this.usuarioService.sigIn(user, password).subscribe({
        next: (response) => {
          this.usuarioService.setUserLoggedIn(response.data);
          if (this.usuarioService.getUserLoggedIn()?.rol.denominacion === 'Administrador') {
            this.router.navigate(['/admin']);      
            this.errorMessage = undefined;
          } else if (this.usuarioService.getUserLoggedIn()?.rol.denominacion === 'Receptor') {
            this.router.navigate(['/receptor']);
            this.errorMessage = undefined;      
          } else if (this.usuarioService.getUserLoggedIn()?.rol.denominacion === 'Asesor') {
            this.router.navigate(['/asesor']);
            this.errorMessage = undefined;
          } else {
            this.usuarioService.setUserLoggedIn(null);
            this.errorMessage = 'Usuario no autorizado.';
          }
          this.loadSignIn = false;
        }, error: (err) => {
          this.errorMessage = err.error.detail || 'Error al iniciar sesión.';
          this.loadSignIn = false;
        }
      })
    }
  }
}
