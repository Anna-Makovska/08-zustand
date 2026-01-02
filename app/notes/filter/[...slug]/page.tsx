import type { Metadata } from "next";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/getQueryClient";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tag = resolvedParams.slug[0] || "all";

  const tagTitles: Record<string, string> = {
    all: "All Notes",
    Todo: "Todo Notes",
    Work: "Work Notes",
    Personal: "Personal Notes",
    Meeting: "Meeting Notes",
    Shopping: "Shopping Notes",
  };

  const title = tagTitles[tag] || "Notes";

  return {
    title: `${title} | NoteHub`,
    description: `Browse ${title.toLowerCase()} in NoteHub`,
    openGraph: {
      title: `${title} | NoteHub`,
      description: `Browse ${title.toLowerCase()} in NoteHub`,
      url: `https://notehub.vercel.app/notes/filter/${tag}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
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
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
