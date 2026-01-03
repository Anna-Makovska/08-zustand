"use client";

import { useState, useEffect } from "react";
import type { NoteTag } from "@/types/note";
import { useNoteStore } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const { draft, setDraft } = useNoteStore();

  const [formData, setFormData] = useState({
    title: draft.title,
    content: draft.content,
    tag: draft.tag,
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });

  useEffect(() => {
    setFormData({
      title: draft.title,
      content: draft.content,
      tag: draft.tag,
    });
  }, [draft]);

  const validateField = (name: string, value: string) => {
    let error = "";

    if (name === "title") {
      if (!value.trim()) {
        error = "Title is required";
      } else if (value.length < 3) {
        error = "Title must be at least 3 characters";
      } else if (value.length > 50) {
        error = "Title must be at most 50 characters";
      }
    }

    if (name === "content") {
      if (value.length > 500) {
        error = "Content must be at most 500 characters";
      }
    }

    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    setDraft({
      title: updatedFormData.title,
      content: updatedFormData.content,
      tag: updatedFormData.tag as NoteTag,
    });

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const titleError = validateField("title", formData.title);
    const contentError = validateField("content", formData.content);

    if (titleError || contentError) {
      setErrors({
        title: titleError,
        content: contentError,
      });
      return;
    }

    onSubmit(e);
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
        <button type="button" className={css.cancelButton} onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}
