import { Component, Input } from '@angular/core';
import { OrdenAtencion } from '../../models/turnos/ordenatencion.model';
import { ViewStatusOrderAtentionPipe } from '../../pipes/view-status-order-atention.pipe';
import { TruncatePipe } from '../../pipes/truncate.pipe';

@Component({
  selector: 'app-user-card',
  imports: [
    ViewStatusOrderAtentionPipe, TruncatePipe
],
  templateUrl: './user-card.component.html',
  styleUrl: './user-card.component.css'
})
export class UserCardComponent {
  @Input() patient ?: OrdenAtencion;
  @Input() color ?: string;
}
