import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note, NoteTag } from "@/types/note";
import type { CheckSessionRequest, fetchNotesResponse, Params } from "./clientApi";

export const checkSession = async (): Promise<AxiosResponse<CheckSessionRequest>> => {
  const cookieStore = cookies();

  const res = await nextServer.get<CheckSessionRequest>("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });

  return res; 
};

export const getMe = async (): Promise<User> => {
  const cookieStore = cookies();

  const res = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });

  return res.data;
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<fetchNotesResponse> => {
  const cookieStore = cookies();

  const params: Record<string, string | number> = {
  page,
  perPage: 12,
  search,
};

if (tag) params.tag = tag;

  const res = await nextServer.get<fetchNotesResponse>("/notes", {
    params,
    headers: { Cookie: cookieStore.toString() },
  });

  return res.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const cookieStore = cookies();

  const res = await nextServer.get<Note>(`/notes/${noteId}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return res.data;
};

type CreateNotePayload = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const createNote = async (payload: CreateNotePayload): Promise<Note> => {
  const cookieStore = cookies();

  const res = await nextServer.post<Note>("/notes", payload, {
    headers: { Cookie: cookieStore.toString() },
  });

  return res.data;
};

export const checkSessionWithCookie = async (cookieHeader: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/session`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  const setCookie = res.headers.get("set-cookie") ?? "";

  const text = await res.text().catch(() => "");
  const data = text ? (JSON.parse(text) as CheckSessionRequest) : null;

  return { ok: res.ok, data, setCookie };
};

export { fetchNoteById as fetchServerNoteById };
export { fetchNotes as fetchServerNotes };
export { getMe as getServerMe };
export { checkSession as checkServerSession };
