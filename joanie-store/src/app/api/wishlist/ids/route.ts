import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ productIds: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.user.id },
      select: { productId: true },
    });

    const productIds = items.map((item) => item.productId);
    return NextResponse.json({ productIds });
  } catch (error) {
    console.error('Wishlist IDs error:', error);
    return NextResponse.json({ productIds: [] });
  }
}
