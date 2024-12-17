import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
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
// essa coordencao e usado na empresa e no usuario
coordenacoes: string[] = [];

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
    emailsDestinatarios: this.fb.array([this.criarEmailControl(true)])
  });



  this.formularioUsuario = this.fb.group({
    nome: [{ value: '', disabled: true }, Validators.required],
    coordenacao: [{ value: '', disabled: true }, Validators.required],
    email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
     //isCoordenador: [{ value: false, disabled: true }],
     //isUsuarioMaster: [{ value: false, disabled: true }]
    nivel: [{ value: '', disabled: true }, Validators.required],
  })
  this.formularioUsuario.get('nivel')?.valueChanges.subscribe(() => {
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
  botaoDesabilitarIncluirEmailEmpresa: boolean = true;
  controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar: boolean = false;
  emailsLista: string[] = [];
  // Control para o input de novo email
  novoEmail = new FormControl('', [Validators.required, Validators.email]);


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
    }
  }

  novoFormularioEmpresa(): void {
    this.resetEmpresa()
    this.ativarFormularioEmpresa()
    this.botaoDesabilitarCanselarEmpresa = false
    this.botaoDesabilitarIncluirEmailEmpresa = false
    this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = true
  }

  editarFormularioEmpresa() {
    if (this.existeEmpresaSelecionada()) {
     this.ativarFormularioEmpresa()
     this.botaoDesabilitarCanselarEmpresa = false
     this.botaoDesabilitarIncluirEmailEmpresa = false
     this.controlaBotaoSalvarEmpresaAtivoSoAposDeClicarEmNovoOuEditar = true
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
  // ********final do cadastro empresa ***********************************************************








   // ********inicio do cadastro usuario ***********************************************************
  usuarios: UsuarioParaCadastro[] = [];
  formularioUsuario: FormGroup;
  botaoDesabilitarCanselarUsuario: boolean = true;
  controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar: boolean = false;
  niveis: string[] = ['assistente', 'analista', 'coordenador', 'master', 'GM'];



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
    this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar = false
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
      this.botaoDesabilitarCanselarUsuario = true
      this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar = false
    }
  }

  novoFormularioUsuario(): void {
    this.resetUsuario()
    this.ativarFormularioUsuario()
    this.botaoDesabilitarCanselarUsuario = false
    this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar = true
  }

  editarFormularioUsuario() {
    if (this.existeUsuarioSelecionada()) {
     this.ativarFormularioUsuario()
     this.botaoDesabilitarCanselarUsuario = false
     this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar = true
    } else {
      alert('Selecione um usuario para editar.');
    }
  }
  cancelarUsuario() {
    this.desativarFormularioUsuario()
    this.resetUsuario()
    this.botaoDesabilitarCanselarUsuario = true
    this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar = false
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
    console.log(this.formularioUsuario)
    console.log(this.formularioUsuario.valid)
    if(this.controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar){
      return !this.formularioUsuario.valid; // Desabilita se o formulário é inválido
    }
    return true

  }

  naoPodeCancelarUsuario(): boolean {
    return true
  }

   // Função para atualizar o status do campo coordenacao
   private updateCoordenacaoStatus(): void {
    const nivel = this.formularioUsuario.get('nivel')?.value; // Obtém o valor do campo nivel
    const coordenacaoControl = this.formularioUsuario.get('coordenacao'); // Referência ao campo coordenacao

    // Verifica se nivel é 'coordenador', 'master' ou 'GM'
    if (nivel === 'coordenador' || nivel === 'master' || nivel === 'GM') {
      coordenacaoControl?.disable(); // Desabilita o campo coordenacao
      coordenacaoControl?.reset();   // Limpa o valor do campo coordenacao
    } else {
      coordenacaoControl?.enable(); // Habilita o campo coordenacao
    }
  }

 // ********Final do cadastro usuario ***********************************************************










  // ********inicio do cadastro cliente ***********************************************************
  clientes: Cliente[] = [];
  formularioCliente: FormGroup;
  botaoDesabilitarCanselarCliente: boolean = true;
  controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar: boolean = false;

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
    this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar = false
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
      this.botaoDesabilitarCanselarCliente = true
      this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar = false
    }
  }

  novoFormularioCliente(): void {
    this.resetCliente()
    this.ativarFormularioCliente()
    this.botaoDesabilitarCanselarCliente = false
    this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar = true
  }

  editarFormularioCliente() {
    if (this.existeClienteSelecionada()) {
     this.ativarFormularioCliente()
     this.botaoDesabilitarCanselarCliente = false
     this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar = true
    } else {
      alert('Selecione um cliente para editar.');
    }
  }
  cancelarCliente() {
    this.desativarFormularioCliente()
    this.resetCliente()
    this.botaoDesabilitarCanselarCliente = true
    this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar = false
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
    if(this.controlaBotaoSalvarClienteAtivoSoAposDeClicarEmNovoOuEditar) {
      return !this.formularioCliente.valid; // Desabilita se o formulário é inválido
    }
    return true

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

    console.log(this.usuarios)
    this.coordenacoes = [
      ...new Set(
        this.usuarios
          .filter(usuario => usuario.nivel === 'coordenador' || usuario.nivel === 'master')
          .map(usuario => usuario.nome)
      )
    ];
    console.log(this.coordenacoes)

    this.clientes= [
      { id: 1, nome: 'Formma', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'Formma', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'master', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'atre', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true },
      { id: 1, nome: 'fortes', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: false, ativo: true },
      { id: 1, nome: 'marphe', cnpj: '11111111111111' , nomeUsuarioMaster: 'Jackson', emailUsuarioMaster: 'teste@gmail', isCoordenadorUsuarioMaster: true, ativo: true }
   ]


   console.log(this.clientes)
  }




}



