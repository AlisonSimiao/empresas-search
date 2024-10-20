import puppeteer from "puppeteer";
import { CNPJ } from "../typing/cnpj";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function exec(option: {sigla: string, tipo: 'novas' | 'maiores'}, notificacao: Function, success: Function) {
    try {
    const url = 'https://www.empresaqui.com.br/listas-de-empresas/' + option.sigla
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const cnpj = new CNPJ()
    
    notificacao(`indo para o url ${url}`, 'log')

    await page.goto(url);

    const type = {
        melhores : {
            id:'personalize',
            adj: 'melhores'
        },
        novas: {
            id: 'novas',
            adj: 'novas'
        }
    }[option.tipo]

    const empresas = []

    const { id, adj } = type

        notificacao(`pegando links das ${adj} empresas`,'log')

        const lines = await page.$$eval(`section#${id} table tr td a`, el => {
            return el.map( a => ({link: a.href, name: a.textContent }))
        })

        for(const {link, name} of lines) {
            notificacao('acessando '+ link, 'log')

            await page.goto(link)

            const empresaBase = await page.$eval('#dadosEmpresaInterna tr', tr => {
               return  { cnpj:  tr.children[1].textContent || '' }

            })

            notificacao('buscando informacoes do cnpj ' + empresaBase.cnpj, 'log')
            const empresa = await cnpj.get(empresaBase.cnpj)
            notificacao(`empresa ${name} salva`, 'success')

            success({cnpj: empresa?.cnpj, cnae: empresa?.CnaePrincipal.cnaeCodigo,  telefone: empresa?.telefones, email: empresa?.email})
        }

    await browser.close()
    await prisma.$disconnect()
    
    }
    catch(e) {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    }
}
