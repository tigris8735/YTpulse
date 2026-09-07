import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'demo@ytpulse.app' },
    update: {},
    create: {
      email: 'demo@ytpulse.app',
      passwordHash: await bcrypt.hash('demo123', 10),
      plan: 'free',
    },
  });
  console.log('✅ Seed completed');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
