import { Component } from '@angular/core';
import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { OnInit, ViewEncapsulation, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EmpresaCadastro } from 'src/app/interface/EmpresaParaCadastro';
import { SharedService } from 'src/app/service/shared.service';  // Importe o serviço
import { Cliente } from 'src/app/interface/Cliente';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EmpresaComponent implements OnInit {

  @ViewChild('nomeInput') nomeInput!: ElementRef; // ViewChild para o campo de nome
  public empresas: EmpresaCadastro[] = [];
  coordenacoes: string[] = [];
  formularioEmpresa: FormGroup;
  hidePassword = true;
  botaoDesabilitarCanselarEmpresa: boolean = true;
  botaoDesabilitarIncluirEmailEmpresa: boolean = true;
  controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar: boolean = false;
  emailsLista: string[] = [];
  // Control para o input de novo email
  novoEmail = new FormControl('', [Validators.required, Validators.email]);
  usuarios: UsuarioParaCadastro[] = []; // por enquanto, pq estou utilizando isso para conseguir os cordenaroes, mas o certo [e fazer uma requisi;'ao s[o pros coredenadores]]
  isDivDisabled = true; // Variável para controlar se a div está desabilitada

  constructor(private fb: FormBuilder, private sharedService: SharedService) {

    this.formularioEmpresa = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      cnpj: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(14) ,Validators.pattern(/^\d{14}$/)]],
      inscricaoMunicipal: [{ value: '', disabled: true }, Validators.required],
      cpfResponsavel: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(11)]],
      senhaIss: [{ value: '', disabled: true }, Validators.required],
      aceites: [{ value: false, disabled: true }],
      encerrar: [{ value: false, disabled: true }],
      downloadPlanilha: [{ value: false, disabled: true }],
      gerarGuia: [{ value: false, disabled: true }],
      enviarEmail: [{ value: false, disabled: true }],
      coordenacao: [{ value: '', disabled: true }, Validators.required],
      emailsDestinatarios: this.fb.array([this.criarEmailControl(true)])
    });

  }

  selecionaEmpresa(empresa: any) {
    console.log (empresa)
    this.formularioEmpresa.patchValue({
      nome: empresa.nome,
      cnpj: empresa.cnpj,
      inscricaoMunicipal: empresa.inscricaoMunicipal,
      cpfResponsavel: empresa.cpfResponsavel,
      senhaIss: empresa.senhaIss,
      aceites: empresa.aceites,
      encerrar: empresa.encerrar,
      downloadPlanilha: empresa.downloadPlanilha,
      gerarGuia: empresa.gerarGuia,
      enviarEmail: empresa.enviarEmail,
    });
  }

  salvarEmpresa() {
    console.log('Formulário enviado para edição:', this.formularioEmpresa.value);
    this.desativarFormularioEmpresa()
    this.resetEmpresa()
    this.botaoDesabilitarCanselarEmpresa = true
    this.botaoDesabilitarIncluirEmailEmpresa = true
    this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = false
    this.emailsLista = []
    this.isDivDisabled = true
  }

  onDeleteEmpresa() {
    const nome = this.formularioEmpresa.get('nome')?.value;
   if (!this.existeEmpresaSelecionada()) {
     alert('Selecione a empresa que deseja excluir.');
     return;
   }

    if (confirm(`Tem certeza de que deseja excluir a empresa ${nome} ?`)) {
      console.log('Dados do formulário foram excluídos.');
      this.desativarFormularioEmpresa()
      this.resetEmpresa()
      this.botaoDesabilitarCanselarEmpresa = true
      this.botaoDesabilitarIncluirEmailEmpresa = true
      this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = false
      this.emailsLista = []
      this.isDivDisabled = true
    }
  }

  novoFormularioEmpresa(): void {
    this.resetEmpresa()
    this.ativarFormularioEmpresa()
    this.botaoDesabilitarCanselarEmpresa = false
    this.botaoDesabilitarIncluirEmailEmpresa = false
    this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = true
    this.isDivDisabled = false
  }

  editarFormularioEmpresa() {
    if (this.existeEmpresaSelecionada()) {
     this.ativarFormularioEmpresa()
     this.botaoDesabilitarCanselarEmpresa = false
     this.botaoDesabilitarIncluirEmailEmpresa = false
     this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = true
     this.isDivDisabled = false
    } else {
      alert('Selecione uma empresa para editar.');
    }
  }

  cancelarEmpresa() {
    this.desativarFormularioEmpresa()
    this.resetEmpresa()
    this.botaoDesabilitarCanselarEmpresa = true
    this.botaoDesabilitarIncluirEmailEmpresa = true
    this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = false
    this.emailsLista = []
    this.isDivDisabled = true
  }

  ativarFormularioEmpresa(): void {
    this.formularioEmpresa.enable(); // Ativa todos os campos do formulário
    this.focarCampoNomeFormularioEmpresa()
  }

  desativarFormularioEmpresa(): void {
    this.formularioEmpresa.disable(); // Desativa todos os campos do formulário
  }

  resetEmpresa(): void {
    this.formularioEmpresa.reset({
      nome: '',
      cnpj: '',
      inscricaoMunicipal: '',
      cpfResponsavel: '',
      senhaIss: '',
      aceites: false,
      encerrar: false,
      downloadPlanilha: false,
      gerarGuia: false,
      enviarEmail: false,
    });
  }

  existeEmpresaSelecionada(): boolean {
    const nome = this.formularioEmpresa.get('nome')?.value;
    return !!nome; // Retorna true se 'nome' tiver valor, caso contrário, false
  }

  focarCampoNomeFormularioEmpresa(): void {
    setTimeout(() => {
      this.nomeInput.nativeElement.focus(); // Foca no campo de nome
    }, 0);
  }

  // Verifica se o botão Salvar deve ser habilitado
  podeSalvarEmpresa(): boolean {
    return this.formularioEmpresa.valid; // Habilita se o formulário é válido
  }

  // Verifica se o botão Salvar deve ser desabilitado
  naoPodeSalvarEmpresa(): boolean {
    console.log(this.formularioEmpresa.valid)
    console.log(this.formularioEmpresa)

    if(this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar) {
      return !this.formularioEmpresa.valid; // Desabilita se o formulário é inválido
    }
    return true

  }

  permitirSomenteNumerosFormularioEmpresa(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert('Somente números são permitidos.');
    }
  }

  get emails(): FormArray {
    return this.formularioEmpresa.get('emailsDestinatarios') as FormArray;
  }

  // Criar controle de email
  criarEmailControl(disabled: boolean = false): FormControl {
    return this.fb.control(
      { value: '', disabled: disabled }, // Controle desabilitado inicialmente
      [Validators.required, Validators.email]
    );
  }



  // Adicionar novo email
  adicionarEmail() {
    // Verifica se há espaço para adicionar mais emails
    if (this.emailsLista.length >= 10) {
      alert("Só é permitido cadastrar no máximo 10 e-mails!");
      return;
    }

    // Verifica se o email é válido
    if (this.novoEmail.valid) {
      const novoEmail = this.novoEmail.value?.trim();

      if (novoEmail && !this.emailsLista.includes(novoEmail)) {
        console.log(novoEmail)
        console.log(this.emailsLista)
        this.emailsLista.push(novoEmail); // Adiciona o email na lista

        this.novoEmail.reset(); // Limpa o campo de input
        this.formularioEmpresa.patchValue({
          emailsDestinatarios: this.emailsLista,
        });
        console.log(this.emailsLista)
        console.log(this.formularioEmpresa)
      } else {
        alert("Este email já foi adicionado à lista!");
      }
    } else {
      alert("Por favor, insira um email válido antes de adicionar!");
    }
  }

  // Remover email
  removerEmail(index: number) {
    this.emails.removeAt(index);
  }

  // Habilitar o FormArray de emails
  habilitarEmails() {
    this.emails.enable();
  }

  verificarEmailValido(email: any): void {
    if(this.emailsLista.length < 10) {
      if (email.status == "INVALID") {
        console.log("email invalido")
        this.botaoDesabilitarIncluirEmailEmpresa = true
      } else {
        console.log("email valido")
        this.botaoDesabilitarIncluirEmailEmpresa = false
      }
    }
  }

  removerEmailSalvo(index: number) {
    this.emailsLista.splice(index, 1); // Remove o email da lista
  }



  ngOnInit() {

    this.empresas = [
      { id: 1, nome: 'Empresa 1', cnpj: '12345678000101', inscricaoMunicipal: 'IM1', cpfResponsavel: '12345678901', senhaIss: 'senha1', aceites: true, encerrar: false, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 1', emailsDestinatarios: ['email1@empresa.com', 'contato1@empresa.com'] },
      { id: 2, nome: 'Empresa 2', cnpj: '12345678000102', inscricaoMunicipal: 'IM2', cpfResponsavel: '12345678902', senhaIss: 'senha2', aceites: false, encerrar: false, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 2', emailsDestinatarios: ['email2@empresa.com', 'contato2@empresa.com'] },
      { id: 3, nome: 'Empresa 3', cnpj: '12345678000103', inscricaoMunicipal: 'IM3', cpfResponsavel: '12345678903', senhaIss: 'senha3', aceites: true, encerrar: true, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 3', emailsDestinatarios: ['email3@empresa.com', 'contato3@empresa.com'] },
      { id: 4, nome: 'Empresa 4', cnpj: '12345678000104', inscricaoMunicipal: 'IM4', cpfResponsavel: '12345678904', senhaIss: 'senha4', aceites: false, encerrar: false, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 4', emailsDestinatarios: ['email4@empresa.com', 'contato4@empresa.com'] },
      { id: 5, nome: 'Empresa 5', cnpj: '12345678000105', inscricaoMunicipal: 'IM5', cpfResponsavel: '12345678905', senhaIss: 'senha5', aceites: true, encerrar: true, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 5', emailsDestinatarios: ['email5@empresa.com', 'contato5@empresa.com'] },
      { id: 6, nome: 'Empresa 6', cnpj: '12345678000106', inscricaoMunicipal: 'IM6', cpfResponsavel: '12345678906', senhaIss: 'senha6', aceites: true, encerrar: false, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 6', emailsDestinatarios: ['email6@empresa.com', 'contato6@empresa.com'] },
      { id: 7, nome: 'Empresa 7', cnpj: '12345678000107', inscricaoMunicipal: 'IM7', cpfResponsavel: '12345678907', senhaIss: 'senha7', aceites: false, encerrar: true, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 7', emailsDestinatarios: ['email7@empresa.com', 'contato7@empresa.com'] },
      { id: 8, nome: 'Empresa 8', cnpj: '12345678000108', inscricaoMunicipal: 'IM8', cpfResponsavel: '12345678908', senhaIss: 'senha8', aceites: true, encerrar: false, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 8', emailsDestinatarios: ['email8@empresa.com', 'contato8@empresa.com'] },
      { id: 9, nome: 'Empresa 9', cnpj: '12345678000109', inscricaoMunicipal: 'IM9', cpfResponsavel: '12345678909', senhaIss: 'senha9', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 9', emailsDestinatarios: ['email9@empresa.com', 'contato9@empresa.com'] },
      { id: 10, nome: 'Empresa 10', cnpj: '12345678000110', inscricaoMunicipal: 'IM10', cpfResponsavel: '12345678910', senhaIss: 'senha10', aceites: true, encerrar: false, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 10', emailsDestinatarios: ['email10@empresa.com', 'contato10@empresa.com'] },
      { id: 11, nome: 'Empresa 11', cnpj: '12345678000111', inscricaoMunicipal: 'IM11', cpfResponsavel: '12345678911', senhaIss: 'senha11', aceites: true, encerrar: false, downloadPlanilha: true, gerarGuia: false, enviarEmail: true, coordenacao: 'Coordenação 11', emailsDestinatarios: ['email11@empresa.com', 'contato11@empresa.com'] },
      { id: 12, nome: 'Empresa 12', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 13, nome: 'Empresa 13', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 14, nome: 'Empresa 14', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 15, nome: 'Empresa 15', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 16, nome: 'Empresa 16', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 17, nome: 'Empresa 17', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      { id: 18, nome: 'Empresa 18', cnpj: '12345678000112', inscricaoMunicipal: 'IM12', cpfResponsavel: '12345678912', senhaIss: 'senha12', aceites: false, encerrar: true, downloadPlanilha: false, gerarGuia: true, enviarEmail: false, coordenacao: 'Coordenação 12', emailsDestinatarios: ['email12@empresa.com', 'contato12@empresa.com'] },
      // Continue para as outras 8 empresas...
    ];



    this.usuarios = [
      { id: 1, nome: 'Jackson', coordenacao: 'Coordenação 1', email: 'teste@gmail', nivel: 'assistente' },
      { id: 2, nome: 'Sueli', coordenacao: 'Coordenação 1', email: 'teste@gmail',  nivel: 'analista' },
      { id: 3, nome: 'Ediana', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'assistente' },
      { id: 4, nome: 'Adalberto', coordenacao: 'Coordenação 1', email: 'teste@gmail',  nivel: 'master' },
      { id: 5, nome: 'Edilsom', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'coordenador' },
      { id: 6, nome: 'wesley', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'analista' },
      { id: 7, nome: 'anderson', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'analista' },
      { id: 8, nome: 'Raphael', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'analista' },
      { id: 9, nome: 'Diana', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'analista' },
      { id: 10, nome: 'Géssica', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'assistente' },
      { id: 11, nome: 'Flavia', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'assistente' },
      { id: 12, nome: 'Cleoton', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'assistente' },
      { id: 13, nome: 'Rosiane', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'assistente' },
      { id: 14, nome: 'Janacle', coordenacao: 'Coordenação 2', email: 'teste@gmail', nivel: 'assistente' },
      { id: 15, nome: 'Marla', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'analista' },
      { id: 16, nome: 'Ilana', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'analista' },
      { id: 17, nome: 'Marcio', coordenacao: 'Coordenação 2', email: 'teste@gmail',  nivel: 'coordenador' },

    ];


    this.coordenacoes = [
      ...new Set(
        this.usuarios
          .filter(usuario => usuario.nivel === 'coordenador' || usuario.nivel === 'master')
          .map(usuario => usuario.nome)
      )
    ];

    console.log(this.empresas)
    console.log(this.usuarios)
    console.log(this.coordenacoes)

  }




}



