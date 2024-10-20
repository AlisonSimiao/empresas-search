import axios, { AxiosError, AxiosInstance } from "axios";
import { IEmpresa } from "./empresa";
import { CNAEPrincipal, Empresa, PrismaClient } from '@prisma/client'
import axiosRetry from "axios-retry";
import { removeSpecialSimbols } from "../utils/fn";

const prisma = new PrismaClient()

export class CNPJ {
    http: AxiosInstance
    constructor(){
        const url = 'https://receitaws.com.br/v1/cnpj';
    
    this.http = axios.create({
        baseURL: url,
    })

    this.config()
    }
    
    static async delay(ms: number){
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    format(date: string) {
        const d = new Date(date)

        return isNaN(d.getTime()) ? undefined : d;
    }

    config(){
        axiosRetry(axios, {
            retries: 3, // number of retries
            retryDelay: (retryCount) => {
                console.log(`retry attempt: ${retryCount}`);
                return retryCount * 2000; // time interval between retries
            },
            retryCondition: (error: AxiosError) => {
                console.log({message: error.message})
                // if retry condition is not specified, by default idempotent requests are retried
                return error.status === 503;
            },
        });

        this.http.interceptors.response.use(
            function (response) {
              return response;
            },
            async function (error) {
                if (error.response && error.response.status === 429) {
                    
                    await CNPJ.delay(60000);
                    
                    return axios(error.config);
                  }
            }
          );
    }

    async get(_cnpj: string): Promise<Empresa & {CnaePrincipal: CNAEPrincipal}> {
        const cnpj = removeSpecialSimbols(_cnpj)
        const empresa = await prisma.empresa.findFirst({
            where: {
                cnpj: _cnpj
            },
            include:{ CnaePrincipal: true }
        }).catch(() => { 
            console.error('erro ao buscar empresa', _cnpj, 'no banco de dados')
            
            return null 
        })

        if(empresa)
            return empresa


        const _empresa =  await this.http.get<IEmpresa>(`/${cnpj}`)
        .then((dados) => dados.data)
        .catch((e) => (null))

        if(_empresa){
            return prisma.empresa.create({
                data: {
                    cnpj: _empresa.cnpj,
                    razao_social: _empresa.nome,
                    nome_fantasia: _empresa.fantasia,
                    data_criacao: _empresa.abertura,
                    natureza_juridica: _empresa.natureza_juridica,
                    data_situacao: _empresa.data_situacao,
                    situacao: _empresa.situacao,
                    porte: _empresa.porte,
                    capital_social: _empresa.capital_social,
                    telefones: _empresa.telefone,
                    email: _empresa.email,
                    ultimaAtualizacao: this.format(_empresa.ultima_atualizacao),
                    Endereco: {
                        create: {
                            logradouro: _empresa.logradouro,
                            numero: _empresa.numero,
                            complemento: _empresa.complemento,
                            bairro: _empresa.bairro,
                            cep: _empresa.cep,
                            uf: _empresa.uf,
                            municipio: _empresa.municipio 
                        }
                    },
                    CnaePrincipal: {
                      create: {
                        cnae: {
                            connectOrCreate:{
                                where: {
                                    codigo: removeSpecialSimbols(_empresa.atividade_principal[0].code)
                                },
                                create: {
                                    codigo: removeSpecialSimbols(_empresa.atividade_principal[0].code),
                                    descricao: _empresa.atividade_principal[0].text
                                }
                            }
                        }
                      } 
                    },
                    CnaeSecundarios: {
                        create: _empresa.atividades_secundarias.map(cnae => ({
                            CNAE: {
                                connectOrCreate:{
                                    where: {
                                        codigo: removeSpecialSimbols(cnae.code)
                                    },
                                    create: {
                                        codigo: removeSpecialSimbols(cnae.code),
                                        descricao: cnae.text
                                    }
                                }
                            }

                        }))
                    },
                    Simei: {
                        create: {
                            optante: _empresa.simples.optante,
                            ultimaAtualizacao: this.format(_empresa.simples.ultima_atualizacao),
                            dataExclusao: this.format(_empresa.simples.data_exclusao),
                            dataOpcao: this.format(_empresa.simples.data_opcao),
                        }
                    },
                    Simples: {
                        create: {
                            optante: _empresa.simei.optante,
                            ultimaAtualizacao: this.format(_empresa.simei.ultima_atualizacao),
                            dataExclusao: this.format(_empresa.simei.data_exclusao),
                            dataOpcao: this.format(_empresa.simei.data_opcao),
                        }
                    }


                },
                include: {CnaePrincipal: true}

            })
        }

        return null
    }
    
}
    
