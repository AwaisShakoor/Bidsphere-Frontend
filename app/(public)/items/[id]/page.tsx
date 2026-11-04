import { PublicItemDetail } from "@/components/public/PublicItemDetail";

export default async function PublicItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <PublicItemDetail itemId={id} />;
}