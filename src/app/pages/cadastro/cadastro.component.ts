import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
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
      nome: ['', Validators.required],
      cnpj: ['', [Validators.required, Validators.minLength(14)]],
      inscricaoMunicipal: ['', Validators.required],
      cpfResponsavel: ['', [Validators.required, Validators.minLength(11)]],
      senhaIss: ['', Validators.required],
      aceites: [false],
      encerrar: [false],
      downloadPlanilha: [false],
      gerarGuia: [false],
      enviarEmail: [false],
      coordenacao: [''] // Valor padrão vazio
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


  public empresas: EmpresaParaHome[] = [];

  ngOnInit() {
    // Inscreve-se para receber as atualizações de dados do serviço
    this.sharedService.currentData$.subscribe(empresasAtualizada => {
      this.empresas = empresasAtualizada;
    });
    console.log(this.empresas)
  }

  editarEmpresa(empresa: any) {
    console.log (empresa)
  }

  excluirEmpresa(empresa: any) {
    console.log (empresa)
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
    if (this.formularioEmpresa.valid) {
      console.log('Formulário enviado para edição:', this.formularioEmpresa.value);
    } else {
      console.log('Por favor, preencha todos os campos corretamente.');
    }
  }

  onDelete() {
      // Confirmação opcional antes de limpar o formulário
  if (confirm('Tem certeza de que deseja excluir os dados do formulário?')) {
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

    console.log('Dados do formulário foram excluídos.');
  }
  }




}



