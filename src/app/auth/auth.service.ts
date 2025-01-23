import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false; // Simula o estado de login

  login(): void {
    this.loggedIn = true; // Simula o login
  }

  logout(): void {
    this.loggedIn = false; // Simula o logout
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }
}
