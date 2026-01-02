import NotePreview from "./NotePreview.client";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function InterceptedNotePage({ params }: PageProps) {
  const resolvedParams = await params;

  return <NotePreview noteId={resolvedParams.id} />;
}
