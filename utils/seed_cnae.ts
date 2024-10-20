import { createReadStream } from "fs";
import * as csv from 'csv'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function exec() {
    const file = './assets/CNAECSV' 

    // Ler o arquivo CSV
    createReadStream(file)

    // pipe - conectar fluxos de leitura e escrita, sem armazenar os dados intermediários em memória
    // columns: true - Primeira linha do arquivo CSV seja tratada como cabeçalho, o nome do cabeçalho corresponde o nome da coluna no banco de dados
    // Delimitador é ; (ponto e vírgula)
    .pipe(csv.parse({ columns: true, delimiter: ';' }))
    .on('error', error => {
        console.error(error)
    })
    // Acionar o evento data quando ler uma linha e executar a função enviando os dados como parâmetro
    .on('data', async (cnae: {code: string, text: string}) => {
            console.log("salvando: ", cnae.code)
           await prisma.cNAE.upsert({
                where: {
                    codigo: cnae.code
                },
                update: {
                    descricao: cnae.text
                },
                create: {
                    codigo: cnae.code,
                    descricao: cnae.text
                }
            }
           )
    });

    console.log('end')
}
