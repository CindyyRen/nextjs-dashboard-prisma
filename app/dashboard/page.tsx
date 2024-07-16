import { Card } from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { fetchRevenue } from '@/app/lib/data';
import { PrismaClient } from '@prisma/client';
import { formatCurrency } from '../lib/utils';
import { Suspense } from 'react';
import { RevenueChartSkeleton } from '../ui/skeletons';
const prisma = new PrismaClient();

type LatestInvoice = {
  id: string;
  amount: number;
  customer: {
    name: string;
    email: string;
    image_url: string;
  };
};

export default async function Page() {
  // const revenue = await fetchRevenue();


  const numberOfCustomers = (await prisma.customer.count()) || 0;
  const numberOfInvoices = (await prisma.invoice.count()) || 0;

  const pending_result = await prisma.invoice.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'pending',
    },
  });
  const paid_result = await prisma.invoice.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: 'paid',
    },
  });

  const totalPaidInvoices =
    formatCurrency(Number(paid_result?._sum?.amount)) ?? 0;
  const totalPendingInvoices =
    formatCurrency(Number(pending_result?._sum?.amount)) ?? 0;

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Collected" value={totalPaidInvoices} type="collected" />
        <Card title="Pending" value={totalPendingInvoices} type="pending" />
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
        <Card
          title="Total Customers"
          value={numberOfCustomers}
          type="customers"
        />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<RevenueChartSkeleton />}>
        <LatestInvoices />
        </Suspense>
      </div>
    </main>
  );
}
