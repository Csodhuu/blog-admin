export type TravelDescriptionType = "list" | "text";

export type TravelPayload = {
  title: string;
  destination: string;
  date: string;
  endDate: string;
  description: string;
  descriptionType: TravelDescriptionType;
  image: string;
};

export type TravelEntity = TravelPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createEmptyTravelPayload = (): TravelPayload => ({
  title: "",
  destination: "",
  date: "",
  endDate: "",
  description: "",
  descriptionType: "list",
  image: "",
});
