export interface Skill {
  name: string;
  level: number;
  max: number;
  note: string;
}

export const skills: Skill[] = [
  { name: 'Paddle Power',       level: 2, max: 5, note: 'Can paddle, not fast yet' },
  { name: 'Paddle Endurance',    level: 2, max: 5, note: 'Tires after a few sets' },
  { name: 'Wave Swimming',       level: 3, max: 5, note: 'Can push through whitewater' },
  { name: 'Duck Dive / Roll',    level: 1, max: 5, note: 'Not yet — boards too big' },
  { name: 'Wave Reading',        level: 2, max: 5, note: 'Starting to spot sets' },
  { name: 'Lineup & Etiquette',  level: 1, max: 5, note: 'Very new to the rules' },
];

/** Format skills as a text block for AI prompts */
export function skillsSummary(): string {
  return skills
    .map((s) => `- ${s.name}: ${s.level}/${s.max} (${s.note})`)
    .join('\n');
}
