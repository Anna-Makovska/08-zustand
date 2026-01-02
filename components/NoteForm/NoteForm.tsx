"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function NoteForm({ onSubmit }: NoteFormProps) {
  const router = useRouter();
  const { draft, setDraft } = useNoteStore();
  const [errors, setErrors] = useState<{
    title?: string;
    content?: string;
  }>({});

  const [formData, setFormData] = useState({
    title: draft.title,
    content: draft.content,
    tag: draft.tag,
  });

  useEffect(() => {
    setFormData({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  }, [draft]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);
    setDraft({
      title: updatedFormData.title,
      content: updatedFormData.content,
      tag: updatedFormData.tag as NoteTag,
    });

    if (name === "title") {
      if (value.length < 3) {
        setErrors((prev) => ({
          ...prev,
          title: "Title must be at least 3 characters",
        }));
      } else if (value.length > 50) {
        setErrors((prev) => ({
          ...prev,
          title: "Title must be at most 50 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, title: undefined }));
      }
    }

    if (name === "content") {
      if (value.length > 500) {
        setErrors((prev) => ({
          ...prev,
          content: "Content must be at most 500 characters",
        }));
      } else {
        setErrors((prev) => ({ ...prev, content: undefined }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: { title?: string; content?: string } = {};
    if (!formData.title) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 50) {
      newErrors.title = "Title must be at most 50 characters";
    }

    if (formData.content.length > 500) {
      newErrors.content = "Content must be at most 500 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataObj = new FormData();
    formDataObj.append("title", formData.title);
    formDataObj.append("content", formData.content);
    formDataObj.append("tag", formData.tag);

    await onSubmit(formDataObj);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={8}
          className={css.textarea}
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={handleCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
