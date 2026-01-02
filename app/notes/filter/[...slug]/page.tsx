import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import FilteredNotesClient from "./FilteredNotes.client";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || "all";

  const tagDisplayName = tag === "all" ? "All Notes" : `${tag} Notes`;
  const title = `${tagDisplayName} | NoteHub`;
  const description = `Browse and manage your ${tag === "all" ? "notes" : tag.toLowerCase() + " notes"} in NoteHub`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: `NoteHub - ${tagDisplayName}`,
        },
      ],
    },
  };
}

export default async function FilteredNotesPage({ params }: PageProps) {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || "all";

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: "", tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <FilteredNotesClient tag={tag} />
    </HydrationBoundary>
  );
}
