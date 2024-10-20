-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "cnpj" TEXT NOT NULL,
    "razao_social" TEXT NOT NULL,
    "nome_fantasia" TEXT NOT NULL,
    "data_criacao" TEXT NOT NULL,
    "natureza_juridica" TEXT NOT NULL,
    "data_situacao" TEXT NOT NULL,
    "situacao" TEXT NOT NULL,
    "porte" TEXT NOT NULL,
    "capital_social" TEXT NOT NULL,
    "telefones" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "simeiId" INTEGER,
    "simplesId" INTEGER,
    "cNAEPrincipalId" INTEGER NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simei_opcao" (
    "id" SERIAL NOT NULL,
    "optante" BOOLEAN NOT NULL,
    "dataOpcao" TIMESTAMP(3),
    "dataExclusao" TIMESTAMP(3),
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simei_opcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simples_opcao" (
    "id" SERIAL NOT NULL,
    "optante" BOOLEAN NOT NULL,
    "dataOpcao" TIMESTAMP(3),
    "dataExclusao" TIMESTAMP(3),
    "ultimaAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "simples_opcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnae_principal" (
    "id" SERIAL NOT NULL,
    "cnaeCodigo" TEXT NOT NULL,

    CONSTRAINT "cnae_principal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnae_secundarios" (
    "id" SERIAL NOT NULL,
    "codigoCnae" TEXT NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "cnae_secundarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cnaes" (
    "codigo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "cnaes_pkey" PRIMARY KEY ("codigo")
);

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_cNAEPrincipalId_fkey" FOREIGN KEY ("cNAEPrincipalId") REFERENCES "cnae_principal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_simeiId_fkey" FOREIGN KEY ("simeiId") REFERENCES "simei_opcao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_simplesId_fkey" FOREIGN KEY ("simplesId") REFERENCES "simples_opcao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnae_principal" ADD CONSTRAINT "cnae_principal_cnaeCodigo_fkey" FOREIGN KEY ("cnaeCodigo") REFERENCES "cnaes"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnae_secundarios" ADD CONSTRAINT "cnae_secundarios_codigoCnae_fkey" FOREIGN KEY ("codigoCnae") REFERENCES "cnaes"("codigo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cnae_secundarios" ADD CONSTRAINT "cnae_secundarios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
