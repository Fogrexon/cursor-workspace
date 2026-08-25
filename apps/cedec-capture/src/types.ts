export type Speaker = {
  name: string;
  company: string;
  job: string;
};

export type Session = {
  id: number;
  uuid: string;
  parentUuid: string | null;
  title: string;
  day: string;
  start: string;
  end: string;
  room: string;
  field: string;
  fieldLabel: string;
  extraFields: string[];
  format: string;
  type: string;
  difficulty: number;
  difficultyLabel: string;
  keywords: string[];
  abstract: string;
  takeaway: string;
  expectedSkill: string;
  speakers: Speaker[];
  officialUrl: string;
  cedilUrl: string;
  photoAllowed: boolean;
  snsAllowed: boolean;
  materialsAllowed: boolean;
};

export type Catalog = {
  capturedAt: string;
  source: string;
  event: {
    name: string;
    dates: string[];
    venue: string;
    official: string;
    cedil: string;
  };
  sessionCount: number;
  sessions: Session[];
};

export type ListFilters = {
  query: string;
  day: string;
  field: string;
  keyword: string;
  playgroundOnly: boolean;
};

export type Route =
  | { view: 'list'; filters: ListFilters }
  | { view: 'session'; uuid: string };

export type RankedSession = Session & {
  score: number;
  reasons: string[];
};
