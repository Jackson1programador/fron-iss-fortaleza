import { Component, OnInit } from '@angular/core';
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
    private servicoLogin: LoginService
    ) {}

  // para teste de layout, pois a validação é feita no back-end
  logar(): void {
   let usuarioEncontrado: Usuario | undefined= this.encontrarUsuarioPorNome(this.loginDigitado, this.usuarios)
   console.log(usuarioEncontrado)

    if(usuarioEncontrado?.nome == this.loginDigitado && this.senhaPadrao == this.senhaDigitada ) {
      console.log("logado")
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

    this.servicoLogin.getAll().subscribe({
      next: (next) => {
        console.log(next);
        this.usuarios = next;
        console.log(this.usuarios);
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
