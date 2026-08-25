import type { ListFilters, RankedSession, Session } from '../types';
import { playgroundRelevance } from './relevance';

const EMPTY_FILTERS: ListFilters = {
  query: '',
  day: '',
  field: '',
  keyword: '',
  playgroundOnly: false,
};

/** 一覧の初期フィルタ。 */
export function emptyFilters(): ListFilters {
  return { ...EMPTY_FILTERS };
}

export function rankSession(session: Session): RankedSession {
  const { score, reasons } = playgroundRelevance(session);
  return { ...session, score, reasons };
}

/** フィルタ後に関連度・開始時刻で並べる。 */
export function filterSessions(
  sessions: readonly Session[],
  filters: ListFilters,
): RankedSession[] {
  const q = filters.query.trim().toLowerCase();
  const ranked = sessions.map(rankSession).filter((s) => {
    if (filters.day && s.day !== filters.day) return false;
    if (filters.field && s.field !== filters.field) return false;
    if (filters.keyword && !s.keywords.includes(filters.keyword)) return false;
    if (filters.playgroundOnly && s.score < 3) return false;
    if (!q) return true;
    const hay = [
      s.title,
      s.abstract,
      s.takeaway,
      s.field,
      s.fieldLabel,
      s.format,
      s.room,
      ...s.keywords,
      ...s.speakers.map((sp) => `${sp.name} ${sp.company}`),
    ]
      .join('\n')
      .toLowerCase();
    return hay.includes(q);
  });

  return ranked.sort((a, b) => {
    if (filters.playgroundOnly || b.score !== a.score) {
      if (b.score !== a.score) return b.score - a.score;
    }
    const day = a.day.localeCompare(b.day);
    if (day !== 0) return day;
    const start = a.start.localeCompare(b.start);
    if (start !== 0) return start;
    return a.title.localeCompare(b.title, 'ja');
  });
}

export function findSession(
  sessions: readonly Session[],
  uuid: string,
): Session | undefined {
  return sessions.find((s) => s.uuid === uuid);
}

export function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, 'ja'),
  );
}
