import { phoneSpecSchema } from "./phone"
import { laptopSpecSchema } from "./laptop"
import { tabletSpecSchema } from "./tablet"
import { monitorSpecSchema } from "./monitor"
import { keyboardSpecSchema } from "./keyboard"
import { pcSpecSchema } from "./pc"
import { consoleSpecSchema } from "./console"
import type { SpecField } from "./types"

export type { SpecField, SpecFieldType } from "./types"

export const CATEGORY_SPEC_SCHEMAS: Record<string, SpecField[]> = {
  phone: phoneSpecSchema,
  laptop: laptopSpecSchema,
  tablet: tabletSpecSchema,
  pc: pcSpecSchema,
  monitor: monitorSpecSchema,
  keyboard: keyboardSpecSchema,
  console: consoleSpecSchema,
}