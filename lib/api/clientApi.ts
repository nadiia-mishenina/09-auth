import type { User } from "@/types/user";
import { nextServer } from "./api";
import type { AxiosError } from "axios";
import type { NewNote, Note } from "../../types/note";

export type ApiError = AxiosError<{ error: string }>;

export interface fetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export interface Params {
  page: number;
  search: string;
  tag?: string;
}

export type RegisterRequestData = {
  email: string;
  password: string;
};

export type CheckSessionRequest = {
  success: boolean;
};

export const register = async (payload: RegisterRequestData): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/register", payload);
  return data;
};

export const login = async (payload: RegisterRequestData): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/login", payload);
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await nextServer.get<CheckSessionRequest>("/auth/session");
  return data.success;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<fetchNotesResponse> => {
  
  const params: Record<string, string | number> = {
    page,
    perPage: 10,
    search,
  };

  if (tag) params.tag = tag;

  const response = await nextServer.get<fetchNotesResponse>("/notes", {
    params,
  });

  return response.data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const res = await nextServer.post<Note>("/notes", newNote);
  return res.data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const res = await nextServer.delete<Note>(`/notes/${noteId}`);
  return res.data;
};

export const fetchNoteById = async (noteId: string): Promise<Note> => {
  const res = await nextServer.get<Note>(`/notes/${noteId}`);
  return res.data;
};


export type UpdateProfilePayload = {
  username: string;
};

export const updateProfileUser = async (
  payload: UpdateProfilePayload
): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};
