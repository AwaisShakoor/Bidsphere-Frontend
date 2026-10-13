import { CategoryPage } from "@/components/dashboard/categoryPage";

type CategoryRouteProps = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryRoute({ params }: CategoryRouteProps) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
