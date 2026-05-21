import { redirect } from "next/navigation";

export default function CollectionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Redirect /collections/[slug] to /categories/[slug] for backwards compatibility
  redirect(`/categories/${params.slug}`);
}
