import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'freqs-stealth-input',
  imports: [FormsModule],
  templateUrl: './stealth-input.component.html',
  styleUrls: ['./stealth-input.component.scss']
})
export class StealthInputComponent {
  @Input() value = "";
  @Output() valueChange = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<void>();
  @Input() placeholder = "";
}
