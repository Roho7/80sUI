import { format, parseISO } from "date-fns"

export function formatUpdatedAt(isoDate: string): string {
  return format(parseISO(isoDate), "MMM d, yyyy")
}
