import { Component } from '@angular/core';
import { UsuarioParaCadastro } from 'src/app/interface/UsuarioParaCadastro';
import { OnInit, ViewChild, ElementRef   } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  coordenacoes: string[] = [];
  usuarios: UsuarioParaCadastro[] = [];
  formularioUsuario: FormGroup;
  botaoDesabilitarCanselarUsuario: boolean = true;
  controlaBotaoSalvarUsuarioAtivoSoAposDeClicarEmNovoOuEditar: boolean = false;
  niveis: string[] = ['assistente', 'analista', 'coordenador', 'master', 'GM'];
  @ViewChild('nomeInput') nomeInput!: ElementRef; // ViewChild para o campo de nome

  constructor(private fb: FormBuilder) {
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
  }

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
      console.log(this.formularioUsuario.value);
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

  ngOnInit() {

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

    console.log(this.usuarios)
    console.log(this.coordenacoes)
  }

}
