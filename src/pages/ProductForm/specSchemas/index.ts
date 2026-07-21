import type { SpecField } from "./phone"
import { phoneSpecSchema } from "./phone"

// Add each category's schema here as it gets built. Categories without an
// entry yet just render an empty specs section — the base product fields
// (name/price/stock/etc) still work fine without one.
export const CATEGORY_SPEC_SCHEMAS: Record<string, SpecField[]> = {
  phone: phoneSpecSchema,
  laptop: [],
  tablet: [],
  pc: [],
  monitor: [],
  keyboard: [],
  console: [],
}