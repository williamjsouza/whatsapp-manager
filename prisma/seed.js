const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const Database = require('better-sqlite3');
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../backend/database/database.sqlite');
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@admin.com';
  const password = 'admin';

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (!existingUser) {
    const password_hash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        password_hash,
        role: 'ADMIN'
      }
    });
    console.log('User admin@admin.com created with password "admin"');
  } else {
    console.log('Admin user already exists');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
