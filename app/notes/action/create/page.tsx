import type { Metadata } from "next";
import CreateNoteClient from "./CreateNote.client";

export const metadata: Metadata = {
  title: "Create Note | NoteHub",
  description: "Create a new note in NoteHub. Add a title, content, and tag to organize your thoughts.",
  openGraph: {
    title: "Create Note | NoteHub",
    description: "Create a new note in NoteHub. Add a title, content, and tag to organize your thoughts.",
    url: "https://notehub.vercel.app/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub - Create Note",
      },
    ],
  },
};

export default function CreateNotePage() {
  return <CreateNoteClient />;
}
