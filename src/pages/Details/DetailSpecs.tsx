import { CATEGORY_SPEC_SCHEMAS } from "../ProductForm/specSchemas"
import type { SpecField } from "../ProductForm/specSchemas/types"
import "./DetailSpecs.scss"

type Props = {
  category: string
  specifications: Record<string, Record<string, unknown>>
}

export function formatValue(field: SpecField, value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null

  if (field.type === "boolean") {
    return value ? "Yes" : "No"
  }

  if (field.type === "boolean-with-text") {
    if (Array.isArray(value)) {
      const [checked, detail] = value as [boolean, string]

      if (!checked) return "No"

      return detail ? `Yes — ${detail}` : "Yes"
    }

    return value ? "Yes" : "No"
  }

  return String(value)
}

function DetailSpecs({ category, specifications }: Props) {
  const schema = CATEGORY_SPEC_SCHEMAS[category] || []

  if (schema.length === 0 || !specifications) return null

  const groups = Array.from(
    new Set(schema.map((field) => field.group))
  ).filter((group) => group !== "general")

  return (
    <section className="detail-specs">
      <h2 className="detail-specs__title">Full specifications</h2>

      <div className="detail-specs__groups">
        {groups.map((group) => {
          const fields = schema.filter((field) => field.group === group)
          const rows = fields
            .map((field) => ({ field, display: formatValue(field, specifications[group]?.[field.key]),}))
            .filter((row): row is {field: SpecField, display: string} => row.display !== null)

          if (rows.length === 0) return null

          return (
            <div key={group} className="detail-specs__group">
              <div className="detail-specs__group-header">{group}</div>

              <div className="detail-specs__rows">
                {rows.map(({ field, display }) => (
                  <div key={field.key} className="detail-specs__row">
                    <div className="detail-specs__label">{field.label}</div>
                    <div className="detail-specs__value">{display}</div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default DetailSpecs