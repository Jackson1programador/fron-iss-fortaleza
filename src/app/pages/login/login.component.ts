import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';
import { Usuario } from 'src/app/interface/Usuario';
import { LoginService } from 'src/app/service/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public usuarios!: Usuario[];
  public loginDigitado: string = "";
  public senhaDigitada: string = "";
  public menssagemDeErroDeLogin: boolean = false
  public senhaPadrao: string = "123456" // para teste de layout, pois a validação é feita no back-end

  constructor(
    private servicoLogin: LoginService,
    private servicoAuth: AuthService,
    private router: Router
    ) {}

  // para teste de layout, pois a validação é feita no back-end
  logar(): void {
   let usuarioEncontrado: Usuario | undefined= this.encontrarUsuarioPorNome(this.loginDigitado, this.usuarios)
   console.log(usuarioEncontrado)

    if(usuarioEncontrado?.nome == this.loginDigitado && this.senhaPadrao == this.senhaDigitada ) {
      console.log("logado")
      this.servicoAuth.login()
      this.router.navigate(['/home']);
      this.loginDigitado = "";
      this.senhaDigitada = "";
      this.menssagemDeErroDeLogin = false
    } else {
      console.log("Login ou senha inválida")
      this.menssagemDeErroDeLogin = true
    }
  }

  encontrarUsuarioPorNome(nome: string, usuarios: Usuario[]): Usuario | undefined {
    return usuarios.find(usuario => usuario.nome === nome);
  }


  ngOnInit(): void {

     //esse codigo [e pra buscar do backend, mas vou deixar mocado por enquanto
     //this.servicoLogin.getAll().subscribe({
     //  next: (next) => {
     //    console.log(next);
     //    this.usuarios = next;
     //    console.log(this.usuarios);
     //  },
     //  error: (error) => {
     //    console.log(error);
     //  },
     //  complete: () => {
     //    console.log("complete");
     //  }
     //})

     this.usuarios = [{id: 1, nome: 'jackson' },
                      {id: 2, nome: 'brenna' },
                      {id: 3, nome: 'manu' },
                      {id: 4, nome: 'edilson' },
                      {id: 5, nome: 'tatiana' },
                      {id: 6, nome: 'ediana' },
                      {id: 7, nome: 'sueli' },
                      {id: 8, nome: 'clelton' },
                      {id: 9, nome: 'anderson' },
                      {id: 10, nome: 'rafael' },
                      {id: 11, nome: 'wesley' }
                    ];




  }

}
