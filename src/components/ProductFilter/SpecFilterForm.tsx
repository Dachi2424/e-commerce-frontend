import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { SpecField, Specifications } from "../../pages/ProductForm/specSchemas/types"
import "./SpecFilterForm.scss"

export type SpecFilterValue = string[] | boolean | undefined
export type SpecFilterValues = Record<string, Record<string, SpecFilterValue>>

type Props = {
  schema: SpecField[]
  values: SpecFilterValues
  onChange: (group: string, key: string, value: SpecFilterValue) => void
}

// Only these types make sense as filters — free text has too many possible
// values for a checkbox list, and raw numbers (weight, core count, etc.)
// aren't things people filter by an exact value.
const FILTERABLE_TYPES = ["select", "boolean", "boolean-with-text"]

// For a dependent field (e.g. Processor Type depends on Processor
// Manufacturer), options must be computed from whichever parent value(s)
// are ACTUALLY currently checked — never a static list of every possible
// option across every manufacturer that ever existed. Showing Apple's M1
// next to Intel's i3 in the same list, with no connection to what's
// checked under Manufacturer, would let someone select an impossible
// combination that exists on no real product.
export function computeDependentOptions(schema: SpecField[], field: SpecField, parentValues: string[]): string[] {
  if (!field.getOptions || !field.dependsOn) return []
  const depField = schema.find((f) => f.key === field.dependsOn)
  if (!depField) return []

  const optionSet = new Set<string>()
  for (const parentValue of parentValues) {
    const synthetic: Specifications = { [depField.group]: { [depField.key]: parentValue } }
    field.getOptions(synthetic).forEach((o) => optionSet.add(o))
  }
  return Array.from(optionSet)
}

function getParentSelectedValues(values: SpecFilterValues, schema: SpecField[], field: SpecField): string[] {
  if (!field.dependsOn) return []
  const depField = schema.find((f) => f.key === field.dependsOn)
  if (!depField) return []

  const depValue = values[depField.group]?.[depField.key]
  return Array.isArray(depValue) ? depValue : []
}

function getFilterOptions(schema: SpecField[], field: SpecField, values: SpecFilterValues): string[] {
  if (field.options) return field.options
  if (!field.getOptions) return []
  if (!field.dependsOn) return []

  const parentValues = getParentSelectedValues(values, schema, field)
  if (parentValues.length === 0) return []

  return computeDependentOptions(schema, field, parentValues)
}

function SpecFilterForm({ schema, values, onChange }: Props) {
  const filterableFields = schema.filter((f) => FILTERABLE_TYPES.includes(f.type))
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set())

  if (filterableFields.length === 0) {
    return null
  }

  const groups = Array.from(new Set(filterableFields.map((f) => f.group)))

  function toggleGroup(group: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev)
      if (next.has(group)) {
        next.delete(group)
      } else {
        next.add(group)
      }
      return next
    })
  }

  return (
    <div className="spec-filter-form">
      {groups.map((group) => {
        const isOpen = openGroups.has(group)
        return (
          <div key={group} className="spec-filter-form__group">
            <button
              type="button"
              className="spec-filter-form__group-header"
              onClick={() => toggleGroup(group)}
              aria-expanded={isOpen}
            >
              <span className="spec-filter-form__group-label">{group}</span>
              <ChevronDown
                size={16}
                className={`spec-filter-form__group-chevron ${isOpen ? "spec-filter-form__group-chevron--open" : ""}`}
              />
            </button>

            <div
              className={`spec-filter-form__group-body-wrap ${
                isOpen ? "spec-filter-form__group-body-wrap--open" : ""
              }`}
            >
              <div className="spec-filter-form__group-body-inner">
                <div className="spec-filter-form__group-body">
                  {filterableFields
                    .filter((f) => f.group === group)
                    .map((field) => (
                      <SpecFilterField
                        key={field.key}
                        schema={schema}
                        field={field}
                        value={values[field.group]?.[field.key]}
                        values={values}
                        onChange={(v) => onChange(field.group, field.key, v)}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function SpecFilterField({
  schema,
  field,
  value,
  values,
  onChange,
}: {
  schema: SpecField[]
  field: SpecField
  value: SpecFilterValue
  values: SpecFilterValues
  onChange: (v: SpecFilterValue) => void
}) {
  if (field.type === "boolean" || field.type === "boolean-with-text") {
    return (
      <label className="spec-filter-form__checkbox-row">
        <input
          type="checkbox"
          checked={value === true}
          onChange={(e) => onChange(e.target.checked ? true : undefined)}
        />
        <span>{field.label}</span>
      </label>
    )
  }

  const options = getFilterOptions(schema, field, values)
  const selected = Array.isArray(value) ? value : []

  // Only true for genuinely dependent fields (Processor Type, Series, etc.)
  // whose parent (Manufacturer, Brand) hasn't been checked yet — this is
  // expected, not an error, so we say so instead of just vanishing.
  const isWaitingOnParent = field.dependsOn && options.length === 0
  if (options.length === 0 && !isWaitingOnParent) return null

  const dependencyLabel = field.dependsOn ? schema.find((f) => f.key === field.dependsOn)?.label : undefined

  function toggleOption(option: string) {
    const next = selected.includes(option)
      ? selected.filter((o) => o !== option)
      : [...selected, option]
    onChange(next.length > 0 ? next : undefined)
  }

  return (
    <div className="spec-filter-form__field">
      <span className="spec-filter-form__field-label">{field.label}</span>
      {isWaitingOnParent ? (
        <p className="spec-filter-form__hint">Select {dependencyLabel || "a value"} first</p>
      ) : (
        <div className="spec-filter-form__options">
          {options.map((option) => (
            <label key={option} className="spec-filter-form__option">
              <input type="checkbox" checked={selected.includes(option)} onChange={() => toggleOption(option)} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default SpecFilterForm