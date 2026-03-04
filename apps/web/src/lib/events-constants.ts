/** Country code (ISO 3166-1 alpha-2) to display name */
export const COUNTRY_NAMES: Record<string, string> = {
  in: "India",
  de: "Germany",
  ar: "Argentina",
  it: "Italy",
  cz: "Czechia",
  nl: "Netherlands",
  ro: "Romania",
  th: "Thailand",
  be: "Belgium",
  es: "Spain",
  pl: "Poland",
  si: "Slovenia",
  us: "USA",
};

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code.toLowerCase()] ?? code.toUpperCase();
}

/** Human-readable event type label */
export function getEventTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    congress: "Congress",
    summit: "Summit",
    meetup: "Meetup",
    collab: "Collab",
    rave: "Rave",
    hackathon: "Hackathon",
    privacycorner: "Privacy Corner",
  };
  return labels[type] ?? type;
}
