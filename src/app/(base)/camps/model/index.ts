export type CampPayload = {
  title: string;
  sport: string;
  date: string;
  location: string;
  description: string;
  image: string;
};

export type CampEntity = CampPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createEmptyCampPayload = (): CampPayload => ({
  title: "",
  sport: "",
  date: "",
  location: "",
  description: "",
  image: "",
});
