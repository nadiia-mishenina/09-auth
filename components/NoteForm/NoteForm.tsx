"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import css from "./NoteForm.module.css";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import { createNote } from "@/lib/api/clientApi";

const TAGS: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const draft = useNoteStore((s) => s.draft);
  const setDraft = useNoteStore((s) => s.setDraft);
  const clearDraft = useNoteStore((s) => s.clearDraft);

  
  const values = useMemo(() => draft ?? initialDraft, [draft]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createNote,
    onSuccess: async () => {
      
      await queryClient.invalidateQueries({ queryKey: ["notes"] });
      
      await queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === "notes",
      });

      clearDraft(); 
      router.back(); 
    },
    onError: () => {
      toast.error("Failed to create note");
    },
  });

  const handleChange: React.FormEventHandler<HTMLFormElement> = (e) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;

    const name = target.name as "title" | "content" | "tag";
    const value = target.value;

    if (name === "tag") setDraft({ tag: value as NoteTag });
    if (name === "title") setDraft({ title: value });
    if (name === "content") setDraft({ content: value });
  };

  
  const action = async (formData: FormData) => {
    const title = String(formData.get("title") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();
    const tag = String(formData.get("tag") ?? "Todo") as NoteTag;

    if (!title || !content) {
      toast.error("Please fill all fields");
      return;
    }

    await mutateAsync({ title, content, tag });
  };

  const onCancel: React.MouseEventHandler<HTMLButtonElement> = () => {
    router.back(); 
  };

  return (
    <form className={css.form} action={action} onChange={handleChange}>
      <label className={css.label}>
        Title
        <input
          className={css.input}
          type="text"
          name="title"
          defaultValue={values.title}
          required
        />
      </label>

      <label className={css.label}>
        Content
        <textarea
          className={css.textarea}
          name="content"
          defaultValue={values.content}
          required
        />
      </label>

      <label className={css.label}>
        Tag
        <select className={css.select} name="tag" defaultValue={values.tag}>
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button className={css.submit} type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </button>
        <button
          className={css.cancel}
          type="button"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
