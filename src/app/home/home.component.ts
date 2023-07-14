import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  authService: AuthService = inject(AuthService);

  async authenticate() {
    await this.authService.authenticate();
  }

}
