import { User } from "@/types/user";
import { nextServer } from "./api";
import { AxiosError } from "axios";
import type { NewNote, Note } from "../../types/note";

export type ApiError = AxiosError<{ error: string }>

export interface fetchNotesResponse {
    notes: Note[];
    totalPages: number;
}
export interface Params {
    page: number;
    perPage: number;
    search: string;
    tag?: string;
}


export type RegisterRequestData = {
    email: string;
    password: string;
}

export type CheckSessionRequest = {
    success: boolean;
}

export const register = async (payload: RegisterRequestData) => {
    const { data } = await nextServer.post<User>('/auth/register', payload);
    return data;
}

export const login = async (payload: RegisterRequestData) => {
    const { data } = await nextServer.post<User>('/auth/login', payload);
    return data;
}

export const checkSession = async () => {
    const { data } = await nextServer.get<CheckSessionRequest>('/auth/session');
    console.log("функція запиту Session", data);

    return data.success;
}

export const getMe = async () => {
    const { data } = await nextServer.get<User>('/users/me');
    return data;
}

export const logout = async (): Promise<void> => {
    await nextServer.post('/auth/logout');
};


export const fetchNotes = async (page: number, search: string, tag?: string): Promise<fetchNotesResponse> => {

    const params: Params = {
        page,
        perPage: 10,
        search,
        tag,
    };

    const response = await nextServer.get<fetchNotesResponse>("/notes", {
        params,
    })


    return response.data;

}

export const createNote = async (newNote: NewNote) => {
    const res = await nextServer.post<Note>("/notes", newNote)
    return res.data
}

export const deleteNote = async (noteId: string) => {
    const res = await nextServer.delete<Note>(`/notes/${noteId}`);
    return res.data
}

export const fetchNoteById = async (noteId: string) => {
    const res = await nextServer.get<Note>(`/notes/${noteId}`)
    return res.data
}

export const updateProfileUser = async (data: User) => {
    const res = await nextServer.patch('/users/me', data)
    return res.data
}