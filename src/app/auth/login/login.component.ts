import { Component } from '@angular/core';
import { AuthService } from '../_state';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(private service: AuthService) {}
  public async logIn() {
    await this.service.anonymousLogin();
  }
}
