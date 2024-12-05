import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpresaParaHome } from 'src/app/interface/EmpresaParaHome';
import { SharedService } from 'src/app/service/shared.service';  // Importe o serviço


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
    email: [{ value: '', disabled: true }, Validators.required],
    isCoordenador: [{ value: false, disabled: true }],
    isUsuarioMaster: [{ value: false, disabled: true }]
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
    }
  }
  // ********final do alterar senha ***********************************************************








   // ********Inicio do cadastro empresa ***********************************************************
  @ViewChild('nomeInput') nomeInput!: ElementRef; // ViewChild para o campo de nome
  public empresas: EmpresaParaHome[] = [];
  formularioEmpresa: FormGroup;
  hidePassword = true;

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
    }

  editarFormularioEmpresa() {
    if (this.existeEmpresaSelecionada()) {
     this.ativarFormularioEmpresa()
    } else {
      alert('Selecione uma empresa para editar.');
    }
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









































  ngOnInit() {
    // Inscreve-se para receber as atualizações de dados do serviço
    this.sharedService.currentData$.subscribe(empresasAtualizada => {
      this.empresas = empresasAtualizada;
    });
    console.log(this.empresas)


    this.usuarios = [
      { id: 1, nome: 'Coordenador 1', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: true },
      { id: 2, nome: 'Coordenador 2', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 3, nome: 'Coordenador 3', isCoordenador: true, coordenacao: 'Coordenação 2', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 4, nome: 'Coordenador 4', isCoordenador: false, coordenacao: 'Coordenação 1', email: 'teste@gmail', isUsuarioMaster: false},
      { id: 5, nome: 'Coordenador 5', isCoordenador: true, coordenacao: 'Coordenação 2', email: 'teste@gmail', isUsuarioMaster: false},

    ];

    console.log(this.usuarios)
  }



}



