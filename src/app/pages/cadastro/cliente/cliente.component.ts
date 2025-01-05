import { Component } from '@angular/core';
import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { OnInit, ViewEncapsulation, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { EmpresaCadastro } from 'src/app/interface/EmpresaParaCadastro';
import { SharedService } from 'src/app/service/shared.service';  // Importe o serviço
import { Cliente } from 'src/app/interface/Cliente';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss']
})
export class ClienteComponent implements OnInit {


  constructor(private fb: FormBuilder) {



    this.formularioCliente = this.fb.group({
      nome: [{ value: '', disabled: true }, Validators.required],
      cnpj: [{ value: '', disabled: true }, [Validators.required, Validators.minLength(14) ,Validators.pattern(/^\d{14}$/)]],
      nomeUsuarioMaster: [{ value: '', disabled: true }, Validators.required],
      isCoordenadorUsuarioMaster: [{ value: '', disabled: true }, Validators.required],
      ativo: [{ value: '', disabled: true }, Validators.required],
      emailUsuarioMaster: [{ value: '', disabled: true }, [Validators.required, Validators.email]]
    })


  }

  @ViewChild('nomeInput') nomeInput!: ElementRef;
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

  permitirSomenteNumerosFormularioCliente(event: KeyboardEvent): void {
    const charCode = event.charCode ? event.charCode : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      alert('Somente números são permitidos.');
    }
  }






  ngOnInit() {

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
