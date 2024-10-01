import { Component, OnInit } from '@angular/core';
import { usuario } from 'src/app/interface/Usuario';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  //public usuarios: usuario;

  constructor(
    private servicoLogin: LoginService
    ) {}

  ngOnInit(): void {

    this.servicoLogin.getAll().subscribe({
      next: (next) => {
        console.log(next);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log("complete");
      }
    })




  }

}
