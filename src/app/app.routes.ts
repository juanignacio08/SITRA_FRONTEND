import { Routes } from '@angular/router';
import { SigInComponent } from './features/user/sig-in/sig-in.component';
import { AsesorComponent } from './features/asesor/asesor.component';
import { AdminComponent } from './features/admin/admin.component';
import { PacientesComponent } from './features/asesor/pacientes/pacientes.component';
import { HistorialComponent } from './features/asesor/historial/historial.component';
import { ReceptorComponent } from './features/receptor/receptor.component';
import { PantallaComponent } from './features/pantalla/pantalla.component';
import { Ventanilla2Component } from './features/asesor/ventanilla2/ventanilla2.component';
import { UsuarioComponent } from './features/admin/usuario/usuario.component';
import { ReporteRecComponent } from './features/admin/reporte-rec/reporte-rec.component';
import { ReporteAseComponent } from './features/admin/reporte-ase/reporte-ase.component';
import { AvisosComponent } from './features/admin/avisos/avisos.component';
import { HistorialRecComponent } from './features/receptor/historial-rec/historial-rec.component';
import { PacientesRecComponent } from './features/receptor/pacientes-rec/pacientes-rec.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sig-in', pathMatch: 'full' },
  { path: 'sig-in', component: SigInComponent, title: 'SITRA' },
  { path: 'receptor', component: ReceptorComponent, title: 'Receptor',
    children: [
      { path: '', redirectTo: 'pacientes-rec', pathMatch: 'full' },
      { path: 'pacientes-rec', component: PacientesRecComponent },
      { path: 'historial-rec', component: HistorialRecComponent },
    ]
   },

  { 
    path: 'asesor', 
    component: AsesorComponent, 
    title: 'Asesor',
    children: [
      { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
      
      { path: 'pacientes', component: PacientesComponent },
      { path: 'ventanilla2', component: Ventanilla2Component },
      { path: 'historial', component: HistorialComponent }
    ]
  },
  {path:'pantalla', component:PantallaComponent,title:'Pantalla'},
  
  { path: 'admin', component: AdminComponent, title: 'Admin',
    children: [
      { path: '', redirectTo: 'usuario', pathMatch: 'full' },
      { path: 'usuario', component: UsuarioComponent },
      { path: 'reporte-rec', component: ReporteRecComponent },
      { path: 'reporte-ase', component: ReporteAseComponent },
      { path: 'avisos', component: AvisosComponent }
    ]
   }
];
