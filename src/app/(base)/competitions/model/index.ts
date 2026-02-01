export type CompetitionType = "upcomingEvents" | "pastEvents";

export type CompetitionPayload = {
  title: string;
  sport: string;
  date: string;
  location: string;
  description: string;
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
  location: "",
  description: "",
  image: "",
  type: "upcomingEvents",
  link: "",
});
