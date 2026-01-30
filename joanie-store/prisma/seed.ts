import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import 'dotenv/config'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const REGULAR_PRODUCT = {
  name: 'HAVIT HV-G92 Gamepad',
  price: 160,
  rating: 5.0,
  reviewCount: 88,
  isOnSale: false,
} as const

const SALE_PRODUCT = {
  name: 'HAVIT HV-G92 Gamepad',
  price: 1160,
  salePrice: 960,
  rating: 4.0,
  reviewCount: 75,
  isOnSale: true,
} as const

async function main(): Promise<void> {
  await prisma.$transaction([
    prisma.wishlistItem.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.product.deleteMany(),
    prisma.user.deleteMany(),
  ])

  // 8 products per category (images repeat 1-4 for both categories)
  const products = [
    // new-arrivals (8 products)
    { ...REGULAR_PRODUCT, image: '/images/shoe-1.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-2.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-3.png', category: 'new-arrivals' },
    { ...SALE_PRODUCT, image: '/images/shoe-4.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-5.png', category: 'new-arrivals' },
    { ...SALE_PRODUCT, image: '/images/shoe-6.png', category: 'new-arrivals' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-7.png', category: 'new-arrivals' },
    { ...SALE_PRODUCT, image: '/images/shoe-8.png', category: 'new-arrivals' },
    // trending (8 products)
    { ...REGULAR_PRODUCT, image: '/images/shoe-1.png', category: 'trending' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-2.png', category: 'trending' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-3.png', category: 'trending' },
    { ...SALE_PRODUCT, image: '/images/shoe-4.png', category: 'trending' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-5.png', category: 'trending' },
    { ...SALE_PRODUCT, image: '/images/shoe-6.png', category: 'trending' },
    { ...REGULAR_PRODUCT, image: '/images/shoe-7.png', category: 'trending' },
    { ...SALE_PRODUCT, image: '/images/shoe-8.png', category: 'trending' },
  ]

  const result = await prisma.product.createMany({ data: products })
  console.log(`Seeded ${result.count} products`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
