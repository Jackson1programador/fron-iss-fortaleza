import { EmpresaParaHome } from 'src/app/interface/EmpresaParaHome';

export interface Competencia {
  id: number
  competencia: string
  cliente: string
  empresas: EmpresaParaHome[];

}
