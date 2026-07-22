/** Build a download base name for the current demo effect (no extension). */
export function exportBaseName(effectId: string): string {
  const safe = effectId.replace(/[^a-z0-9_-]+/gi, '-').replace(/^-|-$/g, '');
  return `graphim-${safe || 'export'}`;
}
