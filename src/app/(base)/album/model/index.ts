export type AlbumItem = {
  name: string;
  location: string;
  date: string;
  cover: string;
};

export type AlbumPayload = {
  _id?: string;
  title: string;
  description: string;
  year: string;
  albums: AlbumItem[];
};

export type AlbumEntity = AlbumPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createEmptyAlbumPayload = (): AlbumPayload => ({
  title: "",
  description: "",
  year: "",
  albums: [],
});
