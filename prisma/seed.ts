import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function createUser(user: {
  name: string;
  cpf: string;
  email: string;
  phoneNumber: string;
  password: string;
}) {
  return prisma.user.upsert({
    where: { cpf: user.cpf },
    update: {},
    create: {
      name: user.name,
      cpf: user.cpf,
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
    },
  });
}

function createBusCompany(company: { name: string; cnpj: string }) {
  return prisma.busCompany.upsert({
    where: { cnpj: company.cnpj },
    update: {},
    create: {
      name: company.name,
      cnpj: company.cnpj,
    },
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  const USERS = [
    {
      name: "alice",
      cpf: "52998224725",
      email: "alice@prisma.com",
      password: passwordHash,
      phoneNumber: "11999999999",
    },
    {
      name: "bob",
      cpf: "16899535009",
      email: "bob@prisma.com",
      password: passwordHash,
      phoneNumber: "11999999999",
    },
    {
      name: "carol",
      cpf: "45317828791",
      email: "carol@prisma.com",
      password: passwordHash,
      phoneNumber: "11999999999",
    },
  ];

  const BUS_COMPANIES = [
    {
      name: "Viação Cometa",
      cnpj: "61123456000180",
    },
    {
      name: "EMTU Metropolitana",
      cnpj: "12345678000155",
    },
  ];

  const [users, busCompanies] = await Promise.all([
    Promise.all(USERS.map((user) => createUser(user))),
    Promise.all(BUS_COMPANIES.map((company) => createBusCompany(company))),
  ]);

  console.log({ users, busCompanies });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
