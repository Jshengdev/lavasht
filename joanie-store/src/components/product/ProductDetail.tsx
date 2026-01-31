'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductInfo from './ProductInfo';
import type { Product } from '@/types';
import { TransitionLink } from '@/components/animations';

interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-[1370px] px-5 py-8">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <TransitionLink
            href="/"
            className="inline-flex items-center gap-2 text-[#333333] hover:text-[#77794E] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Shop</span>
          </TransitionLink>
        </motion.div>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative aspect-square bg-[#F5F5F5] rounded-lg overflow-hidden"
          >
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-8"
              priority
            />
            {/* Sale Badge */}
            {product.isOnSale && product.salePrice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                className="absolute top-4 left-4 bg-[#DB4444] text-white text-sm font-semibold px-3 py-1 rounded"
              >
                -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
              </motion.div>
            )}
          </motion.div>

          {/* Product Info */}
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}
