import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const items = await prisma.cartItem.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    });

    const { totalItems, totalPrice } = items.reduce(
      (acc, item) => {
        const price = item.product.salePrice || item.product.price;
        return {
          totalItems: acc.totalItems + item.quantity,
          totalPrice: acc.totalPrice + price * item.quantity,
        };
      },
      { totalItems: 0, totalPrice: 0 }
    );

    return NextResponse.json({ items, totalItems, totalPrice });
  } catch (error) {
    console.error('Cart GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const item = await prisma.cartItem.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId,
        },
      },
      update: { quantity: { increment: quantity } },
      create: { userId: session.user.id, productId, quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Cart POST error:', error);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
