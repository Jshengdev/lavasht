import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthSession } from '@/lib/auth';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const item = await prisma.cartItem.findUnique({ where: { id } });

    if (!item || item.userId !== session.user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cart DELETE error:', error);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAuthSession();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { quantity } = await req.json();

    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json({ error: 'Valid quantity required' }, { status: 400 });
    }

    const existingItem = await prisma.cartItem.findUnique({ where: { id } });

    if (!existingItem || existingItem.userId !== session.user.id) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const item = await prisma.cartItem.update({
      where: { id },
      data: { quantity },
      include: { product: true },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error('Cart PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}
