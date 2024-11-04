import { Component, HostListener, OnInit } from '@angular/core';
import { EmpresaParaHome } from 'src/app/interface/EmpresaParaHome';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public empresasFront: EmpresaParaHome[] = [];
  public empresas: EmpresaParaHome[] = [];
  public empresasCheckboxMarcada: EmpresaParaHome[] = [];

  public showContainerAtividade: boolean = false;
  public showContainerSituacao: boolean = false;

  situacoes: string[] = ['sucesso', 'pendente', 'erro', 'processando'];
  situacoesSelecionadas: string[] = [...this.situacoes];

  searchTerm: string = '';

  public filtraEmpresaPorNome(event: any) {
    this.searchTerm = event.target.value;

    this.empresasFront = this.empresasCheckboxMarcada.filter(empresa =>
      empresa.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

  }

  onCheckboxChange(event: any) {
    const situacao = event.target.value;

    if (event.target.checked) {
      this.situacoesSelecionadas.push(situacao);
    } else {
      const index = this.situacoesSelecionadas.indexOf(situacao);
      if (index > -1) {
        this.situacoesSelecionadas.splice(index, 1);
      }
    }

    // Atualiza a lista de empresas Marcadas com base nas situações selecionadas
    this.empresasCheckboxMarcada = this.empresas.filter(empresa =>
      this.situacoesSelecionadas.some(situacao => empresa.situacao.toLowerCase().includes(situacao.toLowerCase()))
    );

    // Também atualiza a lista filtrada com base no nome
    this.empresasFront = this.empresasCheckboxMarcada.filter(empresa =>
      empresa.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  public ativarSituacao() {
    this.showContainerSituacao = true;
  }

  public desativarSituacao() {
    this.showContainerSituacao = false;
  }

  //FUNÇAO QUE AO CLICAR FORA DO CONTAINER DO CHECKBOX, ELA FECHA O CONTAINER
  @HostListener('document:click', ['$event'])
  public onClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (this.showContainerSituacao && !targetElement.closest('.content-situacao')) {
      this.desativarSituacao();
    }
  }

  //FUNÇÃO QUE VERIFICAR SE AS OPÇÕES DO CHECKBOX DESABILITADA FICA COM O TRAÇO VERMELHO
  public isCheckboxEnabled(situacao: string): boolean {
    return this.empresasCheckboxMarcada.some(empresa => empresa.situacao === situacao);
  }

  ngOnInit(): void {
    let empresa1: EmpresaParaHome = { id: 1, cnpj: "123123123123", nome: "fulando de tal", situacao: "sucesso", email: "sucesso", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" };
    let empresa2: EmpresaParaHome = { id: 2, cnpj: "123123123123", nome: "toinaha variedade", situacao: "processando", email: "processando", guia: "processando", encerramento: "sucesso", aceites: "sucesso" };
    let empresa3: EmpresaParaHome = { id: 3, cnpj: "123123123123", nome: "aviao de tal", situacao: "erro", email: "erro", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" };
    let empresa4: EmpresaParaHome = { id: 4, cnpj: "123123123123", nome: "casa de tal", situacao: "pendente", email: "pendente", guia: "pendente", encerramento: "pendente", aceites: "pendente" };
    let empresa5: EmpresaParaHome = { id: 5, cnpj: "123123123123", nome: "zica de tal", situacao: "sucesso", email: "não processa", guia: "não processa", encerramento: "sucesso", aceites: "sucesso" };
    let empresa6: EmpresaParaHome = {id: 6, cnpj: "123123123123", nome: "fulando de tal",  situacao: "sucesso", email: "sucesso", guia: "sucesso", encerramento: "sucesso",aceites: "sucesso" }
    let empresa7: EmpresaParaHome = {id: 7, cnpj: "123123123123", nome: "toinaha variedade",  situacao: "processando", email: "processando", guia: "processando", encerramento: "sucesso",aceites: "sucesso" }
    let empresa8: EmpresaParaHome = {id: 8, cnpj: "123123123123", nome: "aviao de tal",  situacao: "erro", email: "erro", guia: "sucesso", encerramento: "sucesso",aceites: "sucesso" }
    let empresa9: EmpresaParaHome = {id: 9, cnpj: "123123123123", nome: "casa de tal",  situacao: "pendente", email: "pendente", guia: "pendente", encerramento: "pendente",aceites: "pendente" }
    let empresa10: EmpresaParaHome = {id:10, cnpj: "123123123123", nome: "zica de tal",  situacao: "sucesso", email: "não processa", guia: "não processa", encerramento: "sucesso",aceites: "sucesso" }

    this.empresas.push(empresa1);
    this.empresas.push(empresa2);
    this.empresas.push(empresa3);
    this.empresas.push(empresa4);
    this.empresas.push(empresa5);
    this.empresas.push(empresa6);
    this.empresas.push(empresa7);
    this.empresas.push(empresa8);
    this.empresas.push(empresa9);
    this.empresas.push(empresa10);

    this.empresasFront = this.empresas;
    this.empresasCheckboxMarcada = this.empresas;
  }
}

