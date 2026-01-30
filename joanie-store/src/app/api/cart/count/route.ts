import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      select: { quantity: true },
    });

    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Cart count error:', error);
    return NextResponse.json({ count: 0 });
  }
}
