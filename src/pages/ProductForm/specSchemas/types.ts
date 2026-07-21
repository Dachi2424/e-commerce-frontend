


export type SpecFieldType = "text" | "number" | "boolean" | "boolean-with-text" | "select"

export type Specifications = Record<string, Record<string, unknown>>
export type SpecField = {
  key: string
  label: string
  type: SpecFieldType
  group: string
  options?: string[]        // only used when type === "select"
  textLabel?: string        // only used when type === "boolean-with-text" (e.g. "Wattage")
  getOptions?: (specifications: Specifications) => string[]
}