import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/invoices/table';
import { CreateInvoice } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';
// import { fetchInvoicesPages } from '@/app/lib/data';

const prisma = new PrismaClient();

const ITEMS_PER_PAGE = 2; // Replace with your desired items per page

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  console.log(query)

  const currentPage = Number(searchParams?.page) || 1;
  const count = await prisma.invoice.count({
    where: {
      
      OR: [
        { customer: { name: { contains: query } } },
        { customer: { email: { contains: query } } },
        // { amount: { equals: parseInt(query) } },
        // { amount: { equals: parseFloat(query) * 100 } },
        { status: { contains: query } },
      ],
    },
  });
  console.log(count)

  const totalPages = Math.ceil(count / ITEMS_PER_PAGE);

  // const totalPages = Math.ceil(invoicesCount / ITEMS_PER_PAGE);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} text-2xl`}>Invoices</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Search invoices..." />
        <CreateInvoice />
      </div>
      <Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table query={query} currentPage={currentPage} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
