import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";
import { WalletTransaction } from "src/wallet-transaction/entities/wallet-transaction.entity";

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

function createRoute(route: {
  companyId: string;
  routeNumber: string;
  origin: string;
  destination: string;
  tripDuration: number;
  price: number;
}) {
  return prisma.route.create({
    data: {
      companyId: route.companyId,
      routeNumber: route.routeNumber,
      origin: route.origin,
      destination: route.destination,
      tripDuration: route.tripDuration,
      price: route.price,
    },
  });
}

function createWalletTransaction(transaction: {
  userId: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL";
}) {
  return prisma.walletTransaction.create({
    data: {
      userId: transaction.userId,
      transactionAmount: transaction.amount,
      transactionType: transaction.type,
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

  const ROUTES = [
    {
      companyCnpj: "12345678000155",
      routeNumber: "EMTU-301",
      origin: "São Paulo - Jabaquara",
      destination: "Diadema",
      tripDuration: 40,
      price: 8.2,
    },
    {
      companyCnpj: "12345678000155",
      routeNumber: "EMTU-402",
      origin: "São Paulo - Sacomã",
      destination: "São Bernardo do Campo",
      tripDuration: 50,
      price: 9.0,
    },
    {
      companyCnpj: "61123456000180",
      routeNumber: "COM-202",
      origin: "São Paulo - Barra Funda",
      destination: "Santos",
      tripDuration: 120,
      price: 39.5,
    },
  ];

  const [users, busCompanies] = await Promise.all([
    Promise.all(USERS.map((user) => createUser(user))),
    Promise.all(BUS_COMPANIES.map((company) => createBusCompany(company))),
  ]);

  const busCompaniesByCnpj = new Map(busCompanies.map((company) => [company.cnpj, company.id]));

  const routes = await Promise.all(
    ROUTES.map((route) => {
      const companyId = busCompaniesByCnpj.get(route.companyCnpj);

      if (!companyId) {
        throw new Error(
          `Bus company not found for route ${route.routeNumber}: ${route.companyCnpj}`
        );
      }

      return createRoute({
        companyId,
        routeNumber: route.routeNumber,
        origin: route.origin,
        destination: route.destination,
        tripDuration: route.tripDuration,
        price: route.price,
      });
    })
  );

  const usersSeed = await prisma.user.findMany({ take: 2 });
  const walletTransactions: { userId: string; transactions: WalletTransaction[] }[] = [];
  for (const user of usersSeed) {
    const txs = await Promise.all([
      createWalletTransaction({ userId: user.id, amount: Math.random() * 100, type: "DEPOSIT" }),
      createWalletTransaction({ userId: user.id, amount: Math.random() * 100, type: "WITHDRAWAL" }),
    ]);

    walletTransactions.push({ userId: user.id, transactions: txs });
  }

  console.log({ users, busCompanies, routes, walletTransactions });
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
