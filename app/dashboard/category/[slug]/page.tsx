import { Category } from "@/components/category";

export default async function DashboardCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <Category slug={slug} />;
}
