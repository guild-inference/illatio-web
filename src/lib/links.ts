export type Property = 'illatio' | 'guild' | 'labs' | 'cloud' | 'docs' | 'models';
export const domains: Record<Property, string> = {
  illatio: 'illatio.dev',
  guild: 'guild.illatio.dev',
  labs: 'labs.illatio.dev',
  cloud: 'cloud.illatio.dev',
  docs: 'docs.guild.illatio.dev',
  models: 'models.guild.illatio.dev',
};
const app = 'illatio';
const groups = {
  illatio: 'illatio',
  labs: 'illatio',
  cloud: 'illatio',
  guild: 'guild',
  docs: 'guild',
  models: 'guild',
};
export const asset = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const canonical = (property: Property, path = '') =>
  `https://${domains[property]}/${path.replace(/^\//, '')}`;
export function link(property: Property, path = ''): string {
  if (import.meta.env.PUBLIC_DEPLOYMENT === 'production') return canonical(property, path);
  const part = property === 'illatio' || property === 'guild' ? '' : `${property}/`;
  const tail = `${part}${path.replace(/^\//, '')}`;
  if (groups[property] === app) return asset(tail);
  const remote = import.meta.env.PUBLIC_GUILD_URL || 'http://127.0.0.1:4174';
  return `${remote.replace(/\/$/, '')}/${tail}`;
}
