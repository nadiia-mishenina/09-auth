"use server";

import { createNote } from "@/lib/api/serverApi";
import type { NoteTag } from "@/types/note";

type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export async function createNoteAction(payload: CreateNotePayload) {
  return await createNote(payload);
}
