import { notFound } from 'next/navigation';
import { getProductBySlug, getProductReviews, getRelatedProducts } from '@/lib/data';
import { ProductDetail } from '@/components/product/product-detail';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product' };
  return {
    title: product.title,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id),
    getRelatedProducts(product, 8),
  ]);

  return <ProductDetail product={product} reviews={reviews} related={related} />;
}
