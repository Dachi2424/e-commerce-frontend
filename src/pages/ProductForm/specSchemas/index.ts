import { phoneSpecSchema } from "./phone"
import { laptopSpecSchema } from "./laptop"
import { tabletSpecSchema } from "./tablet"
import { pcSpecSchema } from "./pc"

import { consoleSpecSchema } from "./console"
import type { SpecField } from "./types"

export type {SpecField, SpecFieldType} from "./types"

// Add each category's schema here as it gets built. Categories without an
// entry yet just render an empty specs section — the base product fields
// (name/price/stock/etc) still work fine without one.
export const CATEGORY_SPEC_SCHEMAS: Record<string, SpecField[]> = {
  phone: phoneSpecSchema,
  laptop: laptopSpecSchema,
  tablet: tabletSpecSchema,
  pc: pcSpecSchema,
  monitor: [],
  keyboard: [],
  console: consoleSpecSchema,
}