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

  coordenacoes: string[] = ['Coordenação 1', 'Coordenação 2', 'Coordenação 3'];
  formularioEmpresa: FormGroup;
  hidePassword = true;

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
  }

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

  ngOnInit() {
    // Inscreve-se para receber as atualizações de dados do serviço
    this.sharedService.currentData$.subscribe(empresasAtualizada => {
      this.empresas = empresasAtualizada;
    });
    console.log(this.empresas)
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




  salvar() {
    console.log('Formulário enviado para edição:', this.formularioEmpresa.value);
    this.desativarFormulario()
    this.reset()
  }

  onDelete() {
   if (!this.existeEmpresaSelecionada()) {
     alert('Selecione a empresa que deseja excluir.');
     return;
   }

  if (confirm('Tem certeza de que deseja excluir a empresa?')) {
    console.log('Dados do formulário foram excluídos.');
    this.desativarFormulario()
    this.reset()
  }
  }

  novoFormulario(): void {
    this.reset()
     this.ativarFormulario()
    }

  editarFormulario() {
    if (this.existeEmpresaSelecionada()) {
     this.ativarFormulario()
    } else {
      alert('Selecione uma empresa para editar.');
    }
  }

  ativarFormulario(): void {
    this.formularioEmpresa.enable(); // Ativa todos os campos do formulário
    this.focarCampoNome()
  }

  desativarFormulario(): void {
    this.formularioEmpresa.disable(); // Desativa todos os campos do formulário
  }



  reset(): void {
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



  focarCampoNome(): void {
    setTimeout(() => {
      this.nomeInput.nativeElement.focus(); // Foca no campo de nome
    }, 0);
  }

  // Função para formatar os nomes dos campos, na hora de salva se tiver campo invalido esse codigo vai compor a funcao salvar


  // Verifica se o botão Salvar deve ser habilitado
  podeSalvar(): boolean {
    return this.formularioEmpresa.valid; // Habilita se o formulário é válido
  }

  // Verifica se o botão Salvar deve ser desabilitado
  naoPodeSalvar(): boolean {
    return !this.formularioEmpresa.valid; // Desabilita se o formulário é inválido
  }


  permitirSomenteNumeros(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert('Somente números são permitidos.');
    }
  }




}



