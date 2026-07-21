import { getCategories, getBrands, getSellers, getProducts } from '@/lib/data';
import { CatalogClient } from '@/components/catalog/catalog-client';

export const dynamic = 'force-dynamic';

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  seller?: string;
  minPrice?: string;
  maxPrice?: string;
  rating?: string;
  shipping?: string;
  sort?: string;
  deal?: string;
  featured?: string;
};

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const [categories, brands, sellers] = await Promise.all([
    getCategories(),
    getBrands(),
    getSellers(),
  ]);

  const products = await getProducts({
    category: searchParams.category,
    brand: searchParams.brand,
    seller: searchParams.seller,
    search: searchParams.q,
    sort: searchParams.sort,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minRating: searchParams.rating ? Number(searchParams.rating) : undefined,
    shippingFrom: searchParams.shipping,
    flash: searchParams.deal === 'flash',
    featured: searchParams.featured === 'true' || searchParams.featured === '1',
  });

  return (
    <CatalogClient
      products={products}
      categories={categories}
      brands={brands}
      sellers={sellers}
      initialParams={searchParams}
    />
  );
}
