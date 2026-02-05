export type CampDescriptionType = "list" | "text";

export type CampPayload = {
  title: string;
  sport: string;
  date: string;
  endDate: string;
  location: string;
  description: string;
  descriptionType: CampDescriptionType;
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
  endDate: "",
  location: "",
  description: "",
  descriptionType: "list",
  image: "",
});
