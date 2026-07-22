import type { SpecField } from "./specSchemas/types"

export type SpecValue = string | number | boolean | null | undefined | [boolean, string]

export type SpecValues = Record<string, Record<string, SpecValue>>

type Props = {
  schema: SpecField[]
  values: SpecValues
  onChange: (group: string, key: string, value: SpecValue) => void
}

function SpecForm({ schema, values, onChange }: Props) {
  if (schema.length === 0) {
    return <p className="spec-form__empty">No spec fields defined for this category yet.</p>
  }

  const groups = Array.from(new Set(schema.map((f) => f.group)))

  return (
    <div className="spec-form">
      {groups.map((group) => (
        <fieldset key={group} className="spec-form__group">
          <legend className="spec-form__group-label">{group}</legend>

          <div className="spec-form__grid">
            {schema
              .filter((field) => field.group === group)
              .map((field) => (
                <SpecFieldInput
                  key={field.key}
                  field={field}
                  value={values[field.group]?.[field.key]}
                  values={values}
                  onChange={(value) =>
                    onChange(field.group, field.key, value)
                  }
                />
              ))}
          </div>
        </fieldset>
      ))}
    </div>
  )
}

function SpecFieldInput({
  field,
  value,
  values,
  onChange,
}: {
  field: SpecField
  value: SpecValue
  values: SpecValues
  onChange: (value: SpecValue) => void
}) {
  switch (field.type) {
    case "text":
      return (
        <label className="spec-form__field">
          <span>{field.label}</span>
          <input
            type="text"
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        </label>
      )

    case "number":
    return (
      <label className="spec-form__field">
        <span>{field.label}</span>
        <input
          type="number"
          value={typeof value === "number" ? value : ""}
          onChange={(e) =>
            onChange(
              e.target.value === ""
                ? undefined
                : Number(e.target.value)
            )
          }
        />
      </label>
    )

    case "boolean":
      return (
        <label className="spec-form__field spec-form__field--checkbox">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      )

    case "boolean-with-text": {
      const [checked, text] = Array.isArray(value)
        ? value
        : [false, ""]

      return (
        <div className="spec-form__field spec-form__field--boolean-with-text">
          <label className="spec-form__checkbox-row">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) =>
                onChange([e.target.checked, text])
              }
            />

            <span>{field.label}</span>
          </label>

          {checked && (
            <label className="spec-form__nested-input">
              <span>{field.textLabel || "Details"}</span>

              <input
                type="text"
                value={text}
                onChange={(e) =>
                  onChange([checked, e.target.value])
                }
              />
            </label>
          )}
        </div>
      )
    }

    case "select": {
      const options = field.getOptions
        ? field.getOptions(values)
        : field.options || []

      return (
        <label className="spec-form__field">
          <span>{field.label}</span>

          <select
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="" disabled>
              Select…
            </option>

            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      )
    }

    default:
      return null
  }
}

export default SpecForm