import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateComponent } from './pages/template/template.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { ErroComponent } from './pages/erro/erro.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { MenuComponent } from './shared/menu/menu.component';
import { RodapeComponent } from './shared/rodape/rodape.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { ContatoComponent } from './pages/contato/contato.component';

import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    TemplateComponent,
    LoginComponent,
    HomeComponent,
    ErroComponent,
    CadastroComponent,
    MenuComponent,
    RodapeComponent,
    RecuperarSenhaComponent,
    ContatoComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
