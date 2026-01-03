"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NoteForm from "@/components/NoteForm/NoteForm";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./page.module.css";

export default function CreateNoteClient() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearDraft } = useNoteStore();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
      router.back();
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const tag = formData.get("tag") as NoteTag;

    await createMutation.mutateAsync({
      title,
      content,
      tag,
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </main>
  );
}
