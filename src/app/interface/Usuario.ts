export interface Usuario {
  id: number
  nome: string
  grupoEmpresa: {id: number, nome: string}
  cliente: {id: number, nome: string, cnpj: string}
  grupoPermissao: {id: number, nome: string}
}
