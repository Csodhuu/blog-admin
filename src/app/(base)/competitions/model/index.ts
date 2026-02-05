export type CompetitionType = "upcomingEvents" | "pastEvents";
export type CompetitionDescriptionType = "list" | "text";

export type CompetitionPayload = {
  title: string;
  sport: string;
  date: string;
  endDate: string;
  location: string;
  description: string;
  descriptionType: CompetitionDescriptionType;
  image: string;
  type: CompetitionType;
  link: string;
};

export type CompetitionEntity = CompetitionPayload & {
  _id?: string;
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createEmptyCompetitionPayload = (): CompetitionPayload => ({
  title: "",
  sport: "",
  date: "",
  endDate: "",
  location: "",
  description: "",
  image: "",
  type: "upcomingEvents",
  link: "",
  descriptionType: "list",
});
