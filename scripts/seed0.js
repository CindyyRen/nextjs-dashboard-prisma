// const { placeholderJobs } = require("./placeholder-data");

const {
  invoices,
  customers,
  revenue,
  users,
} = require('../app/lib/placeholder-data.js');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedUsers() {
  await Promise.all(
    users.map(async (user) => {
      await prisma.user.upsert({
        where: {
          id: user.id,
          
        },
        update: user,
        create: user,
      });
    }),
  );
}

async function seedCustomers() {
  await Promise.all(
    customers.map(async (customer) => {
      await prisma.customer.upsert({
        where: {
          id: customer.id,
        },
        update: customer,
        create: customer,
      });
    }),
  );
}

async function seedInvoices() {
  await Promise.all(
    invoices.map(async (item) => {
      await prisma.invoice.upsert({
        where: {
          id: item.id,
        },
        update: item,
        create: {
          ...item,
          date: new Date(), // Create a new Date object with the current timestamp
        },
      });
    }),
  );
}

async function seedRevenue() {
  await Promise.all(
    revenue.map(async (item) => {
      await prisma.revenue.upsert({
        where: {
          month: item.month,
        },
        update: item,
        create: item,
      });
    }),
  );
}

async function main() {
  try {
    await seedCustomers();
    await seedInvoices();
    await seedUsers();
    await seedRevenue();
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
