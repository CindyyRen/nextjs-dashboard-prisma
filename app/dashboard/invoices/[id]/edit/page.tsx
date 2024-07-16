import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { PrismaClient } from '@prisma/client';
import { InvoiceForm } from '@/app/lib/definitions';
const prisma = new PrismaClient();

export default async function Page({ params }: { params: { id: string } }) {
  // const invoice = await fetchInvoiceById(params.id);
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      customer_id: true,
      amount: true,
      status: true,
    },
  });
  const customers = await prisma.customer.findMany({});

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Edit Invoice',
            href: `/dashboard/invoices/${params.id}/edit`,
            active: true,
          },
        ]}
      />
      {invoice && <Form invoice={invoice} customers={customers} />}
    </main>
  );
}

// export async function fetchInvoiceById(id: string): Promise<InvoiceForm> {
//   try {
//     const invoice = await prisma.invoice.findUnique({
//       where: {
//         id: id,
//       },
//       select: {
//         id: true,
//         customer_id: true,
//         amount: true,
//         status: true,
//       },
//     });

//     if (!invoice) {
//       throw new Error('Invoice not found.');
//     }

//     // Convert amount from cents to dollars
//     invoice.amount = invoice.amount / 100;

//     return invoice;
//   } catch (error) {
//     console.error('Database Error:', error);
//     throw new Error('Failed to fetch invoice.');
//   } finally {
//     await prisma.$disconnect(); // Disconnect Prisma Client after use
//   }
// }
