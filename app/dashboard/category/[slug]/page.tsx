import { CategoryPage } from "@/components/category/CategoryPage";

export default async function DashboardCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
