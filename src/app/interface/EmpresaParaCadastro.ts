export interface EmpresaCadastro {
  id: number
  nome: string;
  cnpj: string;
  inscricaoMunicipal: string;
  cpfResponsavel: string;
  senhaIss: string;
  aceites: boolean;
  encerrar: boolean;
  downloadPlanilha: boolean;
  gerarGuia: boolean;
  enviarEmail: boolean;
  coordenacao: string;
  emailsDestinatarios: string[];
}
