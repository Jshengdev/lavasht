import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductDetail from '@/components/product/ProductDetail';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    return {
      title: 'Product Not Found | Joanie Store',
    };
  }

  return {
    title: `${product.name} | Joanie Store`,
    description: `Shop ${product.name} at Joanie Store. ${product.isOnSale ? `On sale for $${product.salePrice}!` : `$${product.price}`}`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Transform to match Product type
  const productData = {
    id: product.id,
    name: product.name,
    price: product.price,
    salePrice: product.salePrice,
    image: product.image,
    rating: product.rating,
    reviewCount: product.reviewCount,
    category: product.category as 'new-arrivals' | 'trending',
    isOnSale: product.isOnSale,
  };

  return <ProductDetail product={productData} />;
}
