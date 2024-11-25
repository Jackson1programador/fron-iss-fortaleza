import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//component
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { ErroComponent } from './pages/erro/erro.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { ContatoComponent } from './pages/contato/contato.component';

const routes: Routes = [
  {path: "home", component: HomeComponent, pathMatch: "full"},
  {path: "login", component: LoginComponent},
  {path: "cadastro", component: CadastroComponent},
  {path: "recuperar-senha", component: RecuperarSenhaComponent},
  {path: "contato", component: ContatoComponent},
  {path: "404", component: ErroComponent},
  {path: "**", redirectTo: '404' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
