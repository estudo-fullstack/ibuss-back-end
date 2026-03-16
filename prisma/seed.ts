import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcrypt';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function createUser(user: {
  name: string;
  cpf: string;
  email: string;
  phone_number: string;
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
      phone_number: user.phone_number,
    },
  });
}
async function main() {
  const passwordHash = await bcrypt.hash('123456', 10);

  const USERS = [
    {
      name: 'alice',
      cpf: '52998224725',
      email: 'alice@prisma.com',
      password: passwordHash,
      phone_number: '11999999999',
    },
    {
      name: 'bob',
      cpf: '16899535009',
      email: 'bob@prisma.com',
      password: passwordHash,
      phone_number: '11999999999',
    },
    {
      name: 'carol',
      cpf: '45317828791',
      email: 'carol@prisma.com',
      password: passwordHash,
      phone_number: '11999999999',
    },
  ];

  const result = await Promise.all(USERS.map((user) => createUser(user)));
  console.log(result);
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
