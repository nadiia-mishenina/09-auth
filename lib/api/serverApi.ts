import { cookies } from "next/headers";
import { nextServer } from "./api";
import { CheckSessionRequest, fetchNotesResponse, Params } from "./clientApi";
import { User } from "@/types/user";
import { Note } from "@/types/note";

export const checkServerSession = async () => {
    const cookieStore = await cookies();
    const data = await nextServer.get<CheckSessionRequest>('/auth/session', { headers: { Cookie: cookieStore.toString() } });

    return data;
}


export const getServerMe = async () => {
    const cookieStore = await cookies();
    const data = await nextServer.get<User>('/users/me', { headers: { Cookie: cookieStore.toString() } });

    return data;
}

export const fetchServerNotes = async (page: number, search: string, tag?: string): Promise<fetchNotesResponse> => {
    const cookieStore = await cookies();

    const params: Params = {
        page,
        perPage: 10,
        search,
        tag,
    };

    const response = await nextServer.get<fetchNotesResponse>("/notes", {
        params,
        headers: { Cookie: cookieStore.toString() }
    })


    return response.data;

}

export const fetchServerNoteById = async (noteId: string) => {
    const cookieStore = await cookies();
    const res = await nextServer.get<Note>(`/notes/${noteId}`, { headers: { Cookie: cookieStore.toString() } })
    return res.data
}