import rawZones from "../data/street-zones.json";
export const streetZones = rawZones as Record<
  string,
  { zone: string; price: number }
>;
