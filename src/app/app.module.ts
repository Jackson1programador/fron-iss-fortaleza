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
import { AlterarSenhaComponent } from './pages/cadastro/alterar-senha/alterar-senha.component';
import { MenuComponent } from './shared/menu/menu.component';
import { RodapeComponent } from './shared/rodape/rodape.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
import { ContatoComponent } from './pages/contato/contato.component';

import {HttpClientModule} from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EmpresaComponent } from './pages/cadastro/empresa/empresa.component';
import { UsuarioComponent } from './pages/cadastro/usuario/usuario.component';
import { ClienteComponent } from './pages/cadastro/cliente/cliente.component';


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
    ContatoComponent,
    AlterarSenhaComponent,
    EmpresaComponent,
    UsuarioComponent,
    ClienteComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    FormsModule,
    AppRoutingModule,
    MatOptionModule,
    MatFormFieldModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    NgxMaskDirective,
    NgxMaskPipe

  ],
  providers: [provideNgxMask()],
  bootstrap: [AppComponent]
})
export class AppModule { }
