import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { PrismaClient } from '@prisma/client';
// import { fetchCustomers } from '@/app/lib/data';
const prisma = new PrismaClient();


export default async function Page() {
  const customers = await prisma.customer.findMany({});

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      <Form customers={customers} />
    </main>
  );
}
