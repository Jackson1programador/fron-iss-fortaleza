import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmpresaParaHome } from 'src/app/interface/EmpresaParaHome';

@Injectable({
  providedIn: 'root'  // O serviço estará disponível globalmente em todo o aplicativo
})
export class SharedService {
  // Inicializa o BehaviorSubject com um array vazio de EmpresaParaHome
  private empresas = new BehaviorSubject<EmpresaParaHome[]>([]);
  currentData$ = this.empresas.asObservable();  // Expondo o Observable para inscrição

  constructor() {}

  // Método para atualizar os dados
  changeData(empresasAtualizada: EmpresaParaHome[]) {
    this.empresas.next(empresasAtualizada);  // Atualiza o valor, e todos os inscritos recebem a mudança
  }
}
