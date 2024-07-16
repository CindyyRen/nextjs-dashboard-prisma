'use server';
import { z } from 'zod';
import { ZodError } from 'zod';
import { revalidatePath } from 'next/cache';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import {
  type RedirectableProviderType,
  type OAuthProviderType,
} from 'next-auth/providers';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(),
  status: z.enum(['pending', 'paid']),
  date: z.string(),
});
const prisma = new PrismaClient();
const CreateInvoice = FormSchema.omit({ id: true, date: true });
export async function createInvoice(formData: FormData) {
  const { customerId, amount, status } = CreateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  // const date = new Date().toISOString().split('T')[0];
  const date = new Date().toISOString();
  try {
    await prisma.invoice.create({
      data: {
        customer: {
          connect: { id: customerId },
        },
        amount: amountInCents,
        status: status,
        date: date,
      },
    });

    // You may want to handle revalidation or other logic here
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to create invoice.');
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after use
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export async function updateInvoice(id: string, formData: FormData) {
  const { customerId, amount, status } = UpdateInvoice.parse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  const amountInCents = amount * 100;
  try {
    await prisma.invoice.update({
      where: {
        id: id,
      },
      data: {
        customer: {
          connect: { id: customerId },
        },
        amount: amountInCents,
        status: status,
      },
    });
  } catch (error) {
    // Check if the error is a ZodError
    if (error instanceof ZodError) {
      console.error('Zod Validation Error:', error.errors);
      throw new Error('Validation error. Failed to update invoice.');
    } else {
      console.error('Database Error:', error);
      throw new Error('Failed to update invoice.');
    }
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after use
  }
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
  try {
    await prisma.invoice.delete({
      where: {
        id: id,
      },
    });

    // You may want to handle revalidation or other logic here
    revalidatePath('/dashboard/invoices');
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to delete invoice.');
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma Client after use
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function signInOAuth({
  providerId,
}: {
  providerId: OAuthProviderType;
}) {
  let redirectUrl;
  try {
    const result = await signIn(providerId, {
      redirect: false,
    });

    if (result.url) {
      redirectUrl = result.url;
      // console.log('redirectUrl', redirectUrl);
    } else {
      return {
        status: 'error',
        errorMessage: 'Failed to login, redirect url not found',
      };
    }
  } catch (error) {
    return {
      status: 'error',
      errorMessage: 'Failed to login',
    };
  }

  redirect(redirectUrl);
}
