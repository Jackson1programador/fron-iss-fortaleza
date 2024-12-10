import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaCadastro } from 'src/app/interface/EmpresaParaCadastro';
import { SharedService } from 'src/app/service/shared.service';  // Importe o serviço
import { Cliente } from 'src/app/interface/cliente';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CadastroComponent implements OnInit {

// ********Inicio dos dados compartilhados ***********************************************************
coordenacoes: string[] = ['Coordenação 1', 'Coordenação 2', 'Coordenação 3'];

constructor(private fb: FormBuilder, private sharedService: SharedService) {
  this.passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, { validators: this.passwordsMatchValidator });

  this.formularioEmpresa = this.fb.group({
    nome: [{ value: '', disabled: true }, Validators.required],
    //cnpj: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(14)]],
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
  });



  this.formularioUsuario = this.fb.group({
    nome: [{ value: '', disabled: true }, Validators.required],
    coordenacao: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
    isCoordenador: [{ value: false, disabled: true }],
    isUsuarioMaster: [{ value: false, disabled: true }]
  })
   // Monitorando mudanças nos campos isCoordenador
   this.formularioUsuario.get('isCoordenador')?.valueChanges.subscribe((isCoordenador) => {
    this.updateCoordenacaoStatus();
  });
 // Monitorando mudanças nos campos isUsuarioMaster
  this.formularioUsuario.get('isUsuarioMaster')?.valueChanges.subscribe((isUsuarioMaster) => {
    this.updateCoordenacaoStatus();
  });


  this.formularioCliente = this.fb.group({
    nome: [{ value: '', disabled: true }, Validators.required],
    cnpj: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(14) ,Validators.pattern(/^\d{14}$/)]],
    nomeUsuarioMaster: [{ value: '', disabled: true }, Validators.required],
    isCoordenadorUsuarioMaster: [{ value: '', disabled: true }, Validators.required],
    ativo: [{ value: '', disabled: true }, Validators.required],
    emailUsuarioMaster: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
  })







}
// ********final dos dados compartilhados ***********************************************************









  // ********Inicio do Submenu ***********************************************************
  // Estado da aba ativa, inicialmente "aba1"
  abaAtiva = 'aba1';
  // Método para selecionar a aba
  selecionarAba(aba: string) {
    this.abaAtiva = aba;
  }
   //******** final do Submenu ***********************************************************










  // ********Inicio do altear senha ***********************************************************
  passwordForm: FormGroup;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  passwordsMatchValidator(form: FormGroup) {
     //const newPassword = form.get('newPassword').value;
    const newPassword = form.get('newPassword')?.value ?? '';
     //const confirmPassword = form.get('confirmPassword').value;
    const confirmPassword = form.get('confirmPassword')?.value ?? '';

    return newPassword === confirmPassword ? null : { passwordsDontMatch: true };
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      console.log('Form submitted', this.passwordForm.value);
      // Enviar os dados ao back-end para atualizar a senha
      this.resetSenha()
      alert("Senha alterada com sucesso!!!!")
    }
  }

  resetSenha(): void {
    this.passwordForm.reset({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }
  // ********final do alterar senha ***********************************************************








   // ********Inicio do cadastro empresa ***********************************************************
  @ViewChild('nomeInput') nomeInput!: ElementRef; // ViewChild para o campo de nome
  public empresas: EmpresaCadastro[] = [];
  formularioEmpresa: FormGroup;
  hidePassword = true;
  botaoDesabilitarCanselarEmpresa: boolean = true;

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
    }
  }

  novoFormularioEmpresa(): void {
    this.resetEmpresa()
    this.ativarFormularioEmpresa()
    this.botaoDesabilitarCanselarEmpresa = false
  }

  editarFormularioEmpresa() {
    if (this.existeEmpresaSelecionada()) {
     this.ativarFormularioEmpresa()
     this.botaoDesabilitarCanselarEmpresa = false
    } else {
      alert('Selecione uma empresa para editar.');
    }
  }

  cancelarEmpresa() {
    this.desativarFormularioEmpresa()
    this.resetEmpresa()
    this.botaoDesabilitarCanselarEmpresa = true
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
    return !this.formularioEmpresa.valid; // Desabilita se o formulário é inválido
  }

  permitirSomenteNumerosFormularioEmpresa(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert('Somente números são permitidos.');
    }
  }
  // ********final do cadastro empresa ***********************************************************








   // ********inicio do cadastro usuario ***********************************************************
  usuarios: UsuarioParaCadastro[] = [];
  formularioUsuario: FormGroup;
  botaoDesabilitarCanselarUsuario: boolean = true;



  selecionaUsuario(usuario: any) {
    console.log (usuario)
    this.formularioUsuario.patchValue({
      nome: usuario.nome,
      email: usuario.email,
      isCoordenador: usuario.isCoordenador,
      coordenacao: usuario.coordenacao,
      isUsuarioMaster: usuario.isUsuarioMaster
    });
  }

  salvarUsuario() {
    console.log('Formulário enviado para edição:', this.formularioUsuario.value);
    this.desativarFormularioUsuario()
    this.resetUsuario()
    this.botaoDesabilitarCanselarUsuario = true
  }

  onDeleteUsuario() {
    const nome = this.formularioUsuario.get('nome')?.value;
   if (!this.existeUsuarioSelecionada()) {
     alert('Selecione um usuario que deseja excluir.');
     return;
   }

    if (confirm(`Tem certeza de que deseja excluir o usuario ${nome} ?`)) {
      console.log('Dados do formulário foram excluídos.');
      this.desativarFormularioUsuario()
      this.resetUsuario()
    }
  }

  novoFormularioUsuario(): void {
    this.resetUsuario()
    this.ativarFormularioUsuario()
    this.botaoDesabilitarCanselarUsuario = false
  }

  editarFormularioUsuario() {
    if (this.existeUsuarioSelecionada()) {
     this.ativarFormularioUsuario()
     this.botaoDesabilitarCanselarUsuario = false
    } else {
      alert('Selecione um usuario para editar.');
    }
  }
  cancelarUsuario() {
    this.desativarFormularioUsuario()
    this.resetUsuario()
    this.botaoDesabilitarCanselarUsuario = true
  }

  ativarFormularioUsuario(): void {
    this.formularioUsuario.enable(); // Ativa todos os campos do formulário
    this.focarCampoNomeFormularioUsuario()
  }

  desativarFormularioUsuario(): void {
    this.formularioUsuario.disable(); // Desativa todos os campos do formulário
  }

  resetUsuario(): void {
    this.formularioUsuario.reset({
      nome: '',
      email: '',
      coordenacao: '',
      isCoordenador: false,
      isUsuarioMaster: false,
    });
  }

  existeUsuarioSelecionada(): boolean {
    const nome = this.formularioUsuario.get('nome')?.value;
    return !!nome; // Retorna true se 'nome' tiver valor, caso contrário, false
  }

  // ver se t[a funcionando pq esta igual o do formulario empresa]
  focarCampoNomeFormularioUsuario(): void {
    setTimeout(() => {
      this.nomeInput.nativeElement.focus(); // Foca no campo de nome
    }, 0);
  }

  // Verifica se o botão Salvar deve ser habilitado
  podeSalvarUsuario(): boolean {
    return this.formularioUsuario.valid; // Habilita se o formulário é válido
  }

  // Verifica se o botão Salvar deve ser desabilitado
  naoPodeSalvarUsuario(): boolean {
    return !this.formularioUsuario.valid; // Desabilita se o formulário é inválido
  }

  naoPodeCancelarUsuario(): boolean {
    return true
  }

   // Função para atualizar o status do campo coordenacao
  private updateCoordenacaoStatus(): void {
    const isCoordenador = this.formularioUsuario.get('isCoordenador')?.value;
    const isUsuarioMaster = this.formularioUsuario.get('isUsuarioMaster')?.value;
    const coordenacaoControl = this.formularioUsuario.get('coordenacao');
    if (isCoordenador || isUsuarioMaster) {
      this.formularioUsuario.get('coordenacao')?.disable(); // Desabilita o campo
      coordenacaoControl?.reset();  // Limpa o valor do campo
    } else {
      this.formularioUsuario.get('coordenacao')?.enable(); // Habilita o campo
    }
  }

 // ********Final do cadastro usuario ***********************************************************










  // ********inicio do cadastro cliente ***********************************************************
  clientes: Cliente[] = [];
  formularioCliente: FormGroup;
  botaoDesabilitarCanselarCliente: boolean = true;

  selecionaCliente(cliente: any) {
    console.log (cliente)
    this.formularioCliente.patchValue({
      nome: cliente.nome,
      cnpj: cliente.cnpj,
      nomeUsuarioMaster: cliente.nomeUsuarioMaster,
      isCoordenadorUsuarioMaster: cliente.isCoordenadorUsuarioMaster,
      emailUsuarioMaster: cliente.emailUsuarioMaster,
      ativo: cliente.ativo,
    });
  }

  salvarCliente() {
    console.log('Formulário enviado para edição:', this.formularioCliente.value);
    this.desativarFormularioCliente()
    this.resetCliente()
    this.botaoDesabilitarCanselarCliente = true
  }

  onDeleteCliente() {
    const nome = this.formularioCliente.get('nome')?.value;
   if (!this.existeClienteSelecionada()) {
     alert('Selecione um cliente que deseja excluir.');
     return;
   }

    if (confirm(`Tem certeza de que deseja excluir o cliente ${nome} ?`)) {
      console.log('Dados do formulário foram excluídos.');
      this.desativarFormularioCliente()
      this.resetCliente()
    }
  }

  novoFormularioCliente(): void {
    this.resetCliente()
    this.ativarFormularioCliente()
    this.botaoDesabilitarCanselarCliente = false
  }

  editarFormularioCliente() {
    if (this.existeClienteSelecionada()) {
     this.ativarFormularioCliente()
     this.botaoDesabilitarCanselarCliente = false
    } else {
      alert('Selecione um cliente para editar.');
    }
  }
  cancelarCliente() {
    this.desativarFormularioCliente()
    this.resetCliente()
    this.botaoDesabilitarCanselarCliente = true
  }

  ativarFormularioCliente(): void {
    this.formularioCliente.enable(); // Ativa todos os campos do formulário
    this.focarCampoNomeFormularioCliente()
  }

  desativarFormularioCliente(): void {
    this.formularioCliente.disable(); // Desativa todos os campos do formulário
  }

  resetCliente(): void {
    this.formularioCliente.reset({
      nome: '',
      cnpj: '',
      nomeUsuarioMaster: '',
      isCoordenadorUsuarioMaster: false,
      emailUsuarioMaster: '',
      ativo: false,
    });
  }

  existeClienteSelecionada(): boolean {
    const nome = this.formularioCliente.get('nome')?.value;
    return !!nome; // Retorna true se 'nome' tiver valor, caso contrário, false
  }

  // ver se t[a funcionando pq esta igual o do formulario empresa]
  focarCampoNomeFormularioCliente(): void {
    setTimeout(() => {
      this.nomeInput.nativeElement.focus(); // Foca no campo de nome
    }, 0);
  }

  // Verifica se o botão Salvar deve ser habilitado
  podeSalvarCliente(): boolean {
    return this.formularioCliente.valid; // Habilita se o formulário é válido
  }

  // Verifica se o botão Salvar deve ser desabilitado
  naoPodeSalvarCliente(): boolean {
    return !this.formularioCliente.valid; // Desabilita se o formulário é inválido
  }

  naoPodeCancelarCliente(): boolean {
    return true
  }





























  ngOnInit() {
    // Inscreve-se para receber as atualizações de dados do serviço
    // this.sharedService.currentData$.subscribe(empresasAtualizada => {
    //  this.empresas = empresasAtualizada;
    // });

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
      // Continue para as outras 8 empresas...
    ];
    console.log(this.empresas)


    this.usuarios = [
      { id: 1, nome: 'Coordenador 1', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: true },
      { id: 2, nome: 'Coordenador 2', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 3, nome: 'Coordenador 3', isCoordenador: true, coordenacao: 'Coordenação 2', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 4, nome: 'Coordenador 4', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 5, nome: 'Coordenador 5', isCoordenador: true, coordenacao: 'Coordenação 2', email: 'teste@gmail', isUsuarioMaster: false},

    ];

    console.log(this.usuarios)

    this.clientes= [
      { id: 1, nome: 'Formma', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'marphe', cnpj: '1111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true }
   ]


   console.log(this.clientes)
  }




}



