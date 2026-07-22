import type { SpecField } from "./types"

const tabletSeries: Record<string, string[]> = {
  Apple: ["iPad", "iPad Air", "iPad Pro", "iPad mini"],
  Samsung: ["Galaxy Tab S", "Galaxy Tab A", "Galaxy Tab Active"],
  Lenovo: ["Tab", "Tab Plus", "Tab P", "Yoga Tab"],
  Xiaomi: ["Pad", "Pad Pro", "Redmi Pad"],
  Huawei: ["MatePad", "MatePad Pro"],
  Microsoft: ["Surface Go", "Surface Pro"],
  ASUS: ["ROG Flow", "Transformer"],
  Amazon: ["Fire HD", "Fire Max"],
  OnePlus: ["OnePlus Pad"],
  Google: ["Pixel Tablet"],
  Honor: ["Pad"],
  Nokia: ["T"],
  TCL: ["Tab"],
}

const processorTypes: Record<string, string[]> = {
  Apple: ["A15 Bionic", "A16 Bionic", "A17 Pro", "M1", "M2", "M4"],
  Qualcomm: ["Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2", "Snapdragon 7+ Gen 3", "Snapdragon 6 Gen 1"],
  MediaTek: ["Dimensity 9400", "Dimensity 9300", "Dimensity 8300", "Helio G99"],
  Samsung: ["Exynos 2400", "Exynos 1380"],
  Google: ["Tensor G4", "Tensor G3"],
  Intel: ["Core i3", "Core i5", "Core i7", "Core Ultra 5", "Core Ultra 7"],
}

export const tabletSpecSchema: SpecField[] = [
  { key: "brand", label: "Brand", type: "select", options: Object.keys(tabletSeries), group: "general" },
  { key: "series", label: "Series", type: "select", group: "general", getOptions: (specifications) => { const brand = specifications.general?.brand as string; return tabletSeries[brand] || [] }},
  { key: "weight", label: "Weight (g)", type: "number", group: "general" },
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Silver", "Gray", "Blue", "Green", "Gold"], group: "general" },

  { key: "diagonal", label: "Screen size (in)", type: "number", group: "display" },
  { key: "resolution", label: "Resolution", type: "text", group: "display" },
  { key: "screenType", label: "Screen type", type: "select", options: ["IPS LCD", "OLED", "AMOLED", "Super AMOLED", "Mini LED"], group: "display" },
  { key: "refreshRate", label: "Refresh rate (Hz)", type: "select", options: ["60", "90", "120", "144", "165"], group: "display" },

  { key: "processorManufacturer", label: "Processor manufacturer", type: "select", options: Object.keys(processorTypes), group: "processor" },
  { key: "processorType", label: "Processor type", type: "select", group: "processor", getOptions: (specifications) => { const manufacturer = specifications.processor?.processorManufacturer as string; return processorTypes[manufacturer] || [] }},
  { key: "numberOfCores", label: "Number of cores", type: "number", group: "processor" },

  { key: "RAM", label: "RAM", type: "select", options: ["2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB"], group: "memory" },
  { key: "storage", label: "Storage", type: "select", options: ["32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "2TB"], group: "memory" },
  { key: "memoryCardSupport", label: "Memory card support", type: "boolean", group: "memory" },

  { key: "Wi-Fi", label: "Wi-Fi", type: "select", options: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"], group: "connectivity" },
  { key: "cellular", label: "Cellular support", type: "select", options: ["Wi-Fi only", "4G LTE", "5G"], group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["5.0", "5.1", "5.2", "5.3", "5.4"], group: "connectivity" },

  { key: "batteryCapacity", label: "Battery (mAh)", type: "number", group: "battery" },
  { key: "fastCharging", label: "Fast charging", type: "boolean-with-text", textLabel: "Wattage", group: "battery" },

  { key: "OS", label: "Operating system", type: "select", options: ["iPadOS", "Android", "Windows", "HarmonyOS"], group: "os" },

  { key: "rearCamera", label: "Rear camera (MP)", type: "number", group: "camera" },
  { key: "frontCamera", label: "Front camera (MP)", type: "number", group: "camera" },

  { key: "stylusSupport", label: "Stylus support", type: "boolean", group: "accessories" },
  { key: "keyboardSupport", label: "Keyboard support", type: "boolean", group: "accessories" },
  { key: "chargerIncluded", label: "Charger included", type: "boolean", group: "accessories" },
]