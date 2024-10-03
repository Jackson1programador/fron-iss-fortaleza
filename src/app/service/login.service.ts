import { Usuario } from './../interface/Usuario';
import { EventEmitter, Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'

import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/usuario'

  constructor(private http: HttpClient) { }

  public emitEventGetUsuarios = new EventEmitter();


  getAll(): Observable<Array<Usuario>> {
    return this.http.get<Array<Usuario>>(this.apiUrl)
  }
}
