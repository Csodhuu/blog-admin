export type TravelPayload = {
  title: string;
  destination: string;
  date: string;
  description: string;
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
  description: "",
  image: "",
});
