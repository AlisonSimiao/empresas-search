export interface IEmpresa {
    abertura: string;
    situacao: string;
    tipo: string;
    nome: string;
    fantasia: string;
    porte: string;
    natureza_juridica: string;
    atividade_principal: Atividade[];
    atividades_secundarias: Atividade[];
    logradouro: string;
    numero: string;
    complemento: string;
    municipio: string;
    bairro: string;
    uf: string;
    cep: string;
    telefone: string;
    data_situacao: string;
    cnpj: string;
    ultima_atualizacao: string;
    status: string;
    email: string;
    efr: string;
    motivo_situacao: string;
    situacao_especial: string;
    data_situacao_especial: string;
    capital_social: string;
    qsa: any[];
    simples: SimplesOuSimei;
    simei: SimplesOuSimei;
    extra: Record<string, any>;
    billing: Billing;
  }
  
  interface Atividade {
    code: string;
    text: string;
  }
  
  interface SimplesOuSimei {
    optante: boolean;
    data_opcao: string;
    data_exclusao: string;
    ultima_atualizacao: string;
  }
  
  interface Billing {
    free: boolean;
    database: boolean;
  }
  