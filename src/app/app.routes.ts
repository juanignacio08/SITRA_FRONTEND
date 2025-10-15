import { Routes } from '@angular/router';
import { SigInComponent } from './features/user/sig-in/sig-in.component';

export const routes: Routes = [
    {path: '', redirectTo: 'sig-in', pathMatch: 'full'},
    {path: 'sig-in', component: SigInComponent, title: 'SITRA'}
];
