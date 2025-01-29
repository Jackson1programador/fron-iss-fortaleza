import { Competencia } from './../../interface/Competencia';
import { Component, HostListener, OnInit, NgModule } from '@angular/core';
import { EmpresaParaHome } from 'src/app/interface/EmpresaParaHome';
import { SharedService } from 'src/app/service/shared.service';  // Importe o serviço

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private sharedService: SharedService) { }

  public empresasFront: EmpresaParaHome[] = [];
  public empresas: EmpresaParaHome[] = [];
  public empresasCheckboxMarcada: EmpresaParaHome[] = [];
  public competencia: Competencia = {
    id: 0,
    competencia: '',
    cliente: '',
    empresas: []
  };

  public showContainerAtividade: boolean = false;
  public showContainerSituacao: boolean = false;
  public modalAberto: boolean = false;
  public modalAbertoDoQueNaoPodeEncerrar: boolean = false;
  public modalAgendamento: boolean = false;
  public modalAbertoDoQueNaoPodeAgendar: boolean = false;

  competencias: { valor: string; texto: string }[] = [];

  nomeEmpresa: string = "";
  cnpjEmpresa: string = "";
  situacaoEmpresa: string = "";

  idEmpresaParaAgendamento: number = 0;
  nomeEmpresaParaAgendamento: string = "";
  cnpjEmpresaParaAgendamento: string = "";
  situacaoEmpresaAgendada: string = "";
  dataParaAgendamento: string = "";
  horaParaAgendamento: string = "";

  // Variável para armazenar a competência selecionada
  competenciaSelecionada: string = '';



  situacoes: string[] = ['sucesso', 'pendente', 'erro', 'processando', 'agendamento'];
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

  abrirModal(empresa: any) {
    this.nomeEmpresa = empresa.nome
    this.cnpjEmpresa = empresa.cnpj
    this.situacaoEmpresa = empresa.situacao
    //fazer a logica pra so encerrar se tiver pendente ou com erro
    if(empresa.situacao == "pendente" || empresa.situacao == "erro"){
      this.modalAberto = true;
    } else {
      this.modalAbertoDoQueNaoPodeEncerrar = true
    }
  }

  fecharModal() {
    this.modalAberto = false;
  }
  fecharModalDoQueNaoPodeEncerrar() {
    this.modalAbertoDoQueNaoPodeEncerrar = false
  }

  abrirModalAgendamento(empresa: any) {
    this.idEmpresaParaAgendamento = empresa.id
    this.cnpjEmpresaParaAgendamento = empresa.cnpj
    this.nomeEmpresaParaAgendamento = empresa.nome
    this.situacaoEmpresaAgendada = empresa.situacao
    if(empresa.situacao == "pendente" || empresa.situacao == "erro"){
      this.modalAgendamento = true;
    } else {
      this.modalAbertoDoQueNaoPodeAgendar = true
    }
  }

  fecharModalDoQueNaoPodeAgendar() {
    this.modalAbertoDoQueNaoPodeAgendar = false
  }


  fecharModalAgendamento() {
    this.modalAgendamento = false
  }

  encerrar() {
    // Lógica para encerrar
    alert('Encerramento iniciado!');
    this.fecharModal();
  }

  editarEmpresa(empresa: any) {
    console.log(empresa)
     // Lógica para editar
  }

  agendarEmpresa() {

    // Verifica se a data e a hora foram preenchidas
    if (!this.dataParaAgendamento || !this.horaParaAgendamento) {
      alert('Por favor, selecione uma data e hora para o agendamento.');
      return; // Interrompe o agendamento
    }

    const dataAtual = new Date();

    // Combina a data e a hora selecionadas para criar um objeto Date
    const dataAgendada = new Date(this.dataParaAgendamento + 'T' + this.horaParaAgendamento);

    if (dataAgendada <= dataAtual) {
      alert('A data e hora selecionadas não podem ser menores ou iguais à data e hora atual.');
      return; // Impede o agendamento se a data/hora for inválida
    }

    alert(
      'Empresa ' + this.nomeEmpresaParaAgendamento +
      ' CNPJ ' + this.cnpjEmpresaParaAgendamento +
      ' competência ' + this.competenciaSelecionada +
      ' foi agendada para a data ' + this.dataParaAgendamento +
      ' na hora ' + this.horaParaAgendamento)

    console.log(
      'Empresa ' + this.nomeEmpresaParaAgendamento +
      ' CNPJ ' + this.cnpjEmpresaParaAgendamento +
      ' competência ' + this.competenciaSelecionada +
      ' foi agendada para a data ' + this.dataParaAgendamento +
      ' na hora ' + this.horaParaAgendamento
    );
    this.dataParaAgendamento = ""
    this.horaParaAgendamento = ""
    this.fecharModalAgendamento()
  }

  gerarCompetencias(): string[] {
    const hoje = new Date(); // Data atual
    const competencias: string[] = [];

    // Começar do mês passado
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth(); // Janeiro = 0, então mês atual - 1 já é o mês passado

    // Gerar as 12 competências
    for (let i = 0; i < 12; i++) {
      if (mes === 0) { // Caso seja Janeiro, retroceder para Dezembro do ano anterior
        mes = 12;
        ano--;
      }
      const competencia = `${mes.toString().padStart(2, '0')}/${ano}`;
      competencias.push(competencia);
      this.competencias.push({ valor: competencia, texto: competencia });
      mes--; // Retroceder um mês
    }
    return competencias;
  }

  selecaoDeCompetencia(valor: string): void {
    console.log("Competência selecionada:", valor);
    console.log(valor);
    console.log(this.competencia.competencia);
    // Aqui você pode adicionar qualquer lógica necessária com o valor selecionado
    if (this.competencia.competencia == valor) {
      this.empresas = this.competencia.empresas
      this.empresasFront = this.empresas;
      this.empresasCheckboxMarcada = this.empresas;
    } else {
      this.empresas = []
      this.empresasFront = []
      this.empresasCheckboxMarcada = []
    }

  }




  ngOnInit(): void {

   const empresasMokadas: EmpresaParaHome[] = [
    { id: 1, cnpj: "11111111111111", nome: "fulando de tal", situacao: "sucesso", email: "sucesso", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" },
    { id: 2, cnpj: "123123123123", nome: "toinaha variedade", situacao: "processando", email: "processando", guia: "processando", encerramento: "sucesso", aceites: "sucesso" },
    { id: 3, cnpj: "123123123123", nome: "aviao de tal", situacao: "erro", email: "erro", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" },
    { id: 4, cnpj: "123123123123", nome: "casa de tal", situacao: "agendamento", email: "pendente", guia: "pendente", encerramento: "pendente", aceites: "pendente" },
    { id: 5, cnpj: "123123123123", nome: "zica de tal", situacao: "sucesso", email: "não processa", guia: "não processa", encerramento: "sucesso", aceites: "sucesso" },
    { id: 6, cnpj: "123123123123", nome: "fulando de tal", situacao: "sucesso", email: "sucesso", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" },
    { id: 7, cnpj: "123123123123", nome: "toinaha variedade", situacao: "processando", email: "processando", guia: "processando", encerramento: "sucesso", aceites: "sucesso" },
    { id: 8, cnpj: "123123123123", nome: "aviao de tal", situacao: "erro", email: "erro", guia: "sucesso", encerramento: "sucesso", aceites: "sucesso" },
    { id: 9, cnpj: "123123123123", nome: "casa de tal", situacao: "pendente", email: "pendente", guia: "pendente", encerramento: "pendente", aceites: "pendente" },
    { id: 10, cnpj: "123123123123", nome: "zica de tal", situacao: "sucesso", email: "não processa", guia: "não processa", encerramento: "sucesso", aceites: "sucesso" }
  ];

  this.competencia = {
      id: 1,
      competencia: "12/2024",
      cliente: "Formma Contabil",
      empresas: empresasMokadas
    },

    this.gerarCompetencias();
    this.competenciaSelecionada = this.competencias[0].valor;
    this.selecaoDeCompetencia(this.competenciaSelecionada)


    console.log(this.empresas)
    this.sharedService.changeData(this.empresas);
  }
}

