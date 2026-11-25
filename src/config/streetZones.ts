import raw from "../data/street-zones.json";
import type { StreetZone } from "../types/address";

export const streetZones = raw as Record<string, StreetZone>;
