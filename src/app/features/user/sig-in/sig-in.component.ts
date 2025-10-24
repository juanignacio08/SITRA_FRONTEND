import { Component, OnInit, AfterViewInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

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

  @ViewChild('loginContainer') container!: ElementRef;
  @ViewChild('wave1') wave1!: ElementRef;
  @ViewChild('wave2') wave2!: ElementRef;

  waves = [
    { el: null as any, x: 50, y: 50, vx: 2, vy: 2 },
    { el: null as any, x: 100, y: 100, vx: 3, vy: 1.5 }
  ];

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
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
      this.waves.forEach(w => {
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

  const { email, password } = this.loginForm.value;

  // ✅ Validación simple
  if (email === 'receptor@gmail.com' && password === '123456') {
    console.log('Inicio de sesión exitoso ✅');
    this.router.navigate(['/receptor']); // Redirige al receptor
  } 
   else if (email === 'asesor@gmail.com' && password === '123456') {
    console.log('Inicio de sesión como MÉDICO ✅');
    this.router.navigate(['/asesor']);
  }
  else if (email === 'admin@gmail.com' && password === '123456') {
    console.log('Inicio de sesión como MÉDICO ✅');
    this.router.navigate(['/admin']);
  }
  else {
    console.log('Credenciales incorrectas ❌');
    alert('DNI o contraseña incorrectos');
  }
  
}

}
