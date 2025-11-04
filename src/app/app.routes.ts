import { Routes } from '@angular/router';
import { SigInComponent } from './features/user/sig-in/sig-in.component';
import { AsesorComponent } from './features/asesor/asesor.component';
import { AdminComponent } from './features/admin/admin.component';
import { PacientesComponent } from './features/asesor/pacientes/pacientes.component';
import { HistorialComponent } from './features/asesor/historial/historial.component';
import { ReceptorComponent } from './features/receptor/receptor.component';
import { PantallaComponent } from './features/pantalla/pantalla.component';

export const routes: Routes = [
  { path: '', redirectTo: 'sig-in', pathMatch: 'full' },
  { path: 'sig-in', component: SigInComponent, title: 'SITRA' },
  { path: 'receptor', component: ReceptorComponent, title: 'Receptor' },
  { 
    path: 'asesor', 
    component: AsesorComponent, 
    title: 'Asesor',
    children: [
      { path: '', redirectTo: 'pacientes', pathMatch: 'full' },
      { path: 'pacientes', component: PacientesComponent },
      { path: 'historial', component: HistorialComponent }
    ]
  },
  {path:'pantalla', component:PantallaComponent,title:'Pantalla'},
  { path: 'admin', component: AdminComponent, title: 'Admin' }
];
