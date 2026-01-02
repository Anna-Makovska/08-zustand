import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
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
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
