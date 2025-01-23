import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {

  constructor(
    private servicoLogin: LoginService,
    private servicoAuth: AuthService,
    private router: Router
    ) {}

  logout() {
    // Lógica para deslogar o usuário
    this.servicoAuth.logout()
    this.router.navigate(['/']);
    console.log('Usuário deslogado!');
  }
}
