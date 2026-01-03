"use client";

import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchNoteById, deleteNote } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

interface NotePreviewProps {
  noteId: string;
}

export default function NotePreview({ noteId }: NotePreviewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", noteId],
    queryFn: () => fetchNoteById(noteId),
    enabled: Boolean(noteId),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      handleClose();
      setTimeout(() => {
        router.push("/notes/filter/all");
      }, 100);
    },
  });

  const handleClose = () => {
    router.back();
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteMutation.mutateAsync(noteId);
    }
  };

  if (isLoading) {
    return (
      <Modal onClose={handleClose}>
        <p>Loading, please wait...</p>
      </Modal>
    );
  }

  if (error || !note) {
    return (
      <Modal onClose={handleClose}>
        <p>Something went wrong.</p>
      </Modal>
    );
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className={css.deleteButton}
        >
          {deleteMutation.isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}
