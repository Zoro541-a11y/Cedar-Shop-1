import { getCategories, getProducts, getRecommendations } from '@/lib/data';
import { HomeContent } from '@/components/home/home-content';

export const revalidate = 300;

export default async function HomePage() {
  const [categories, flashDeals, trending, featured, recommendations] = await Promise.all([
    getCategories(),
    getProducts({ flash: true, limit: 10 }),
    getProducts({ trending: true, limit: 10 }),
    getProducts({ featured: true, limit: 10 }),
    getRecommendations([], 12),
  ]);

  return (
    <HomeContent
      categories={categories}
      flashDeals={flashDeals}
      trending={trending}
      featured={featured}
      recommendations={recommendations}
    />
  );
}
