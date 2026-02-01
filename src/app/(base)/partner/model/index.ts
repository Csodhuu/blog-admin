export type PartnerPayload = {
  name: string;
  image: string;
};

export type PartnerEntity = PartnerPayload & {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createPartnerPayload = (): PartnerPayload => ({
  name: "",
  image: "",
});
