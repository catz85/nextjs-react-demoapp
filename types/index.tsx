export interface ImagePost {
    albumId: number;
    id: number;
    title: string;
    url: string;
    thumbnailUrl: string;
}

export interface Credentials {
    email: string;
    password: string;
    csrfToken?:string;
}