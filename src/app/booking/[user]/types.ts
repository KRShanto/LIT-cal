export type QuestionType =
  | "SHORT_TEXT"
  | "LONG_TEXT"
  | "RADIO"
  | "CHECKBOX"
  | "DROPDOWN"
  | "PHONE";

export type EventType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  durationMinutes: number;
  questions: {
    idx: number;
    question: string;
    type: QuestionType;
    required: boolean;
    options: string[] | null;
  }[];
};

export type User = {
  id: string;
  name: string;
  username: string;
  imageUrl: string | null;
  publicEmail: string | null;
};

/**
 * Formats duration in minutes to a human-readable string.
 * @param minutes - Duration in minutes
 * @returns Formatted duration string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}
