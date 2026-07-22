import type { SpecField } from "./types"

const panelManufacturers: Record<string, string[]> = {
  Samsung: ["VA", "IPS", "OLED", "QD-OLED"],
  LG: ["IPS", "Nano IPS", "OLED", "WOLED"],
  AUO: ["TN", "IPS", "VA", "Fast IPS"],
  BOE: ["IPS", "VA", "OLED"],
  Innolux: ["IPS", "VA", "TN"],
  Sharp: ["IGZO IPS"],
  TCL: ["HVA", "VA"],
}

export const monitorSpecSchema: SpecField[] = [

  // general
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Silver", "Gray"], group: "general" },
  { key: "weight", label: "Weight (kg)", type: "number", group: "general" },
  { key: "warrantyForPhysicalPerson", label: "Warranty (months)", type: "number", group: "general" },

  // display
  { key: "screenSize", label: "Screen size (inch)", type: "number", group: "display" },
  { key: "resolution", label: "Resolution", type: "select", options: ["1280×720", "1366×768", "1600×900", "1920×1080", "1920×1200", "2560×1080", "2560×1440", "3440×1440", "3840×2160", "5120×1440", "5120×2160", "7680×4320"], group: "display" },
  { key: "aspectRatio", label: "Aspect ratio", type: "select", options: ["4:3", "5:4", "16:9", "16:10", "17:9", "21:9", "24:10", "32:9", "32:10"], group: "display" },
  { key: "panelManufacturer", label: "Panel manufacturer", type: "select", options: Object.keys(panelManufacturers), group: "display" },
  { key: "panelType", label: "Panel type", type: "select", group: "display", getOptions: (specifications) => { const manufacturer = specifications.display?.panelManufacturer as string; return panelManufacturers[manufacturer] || [] } },
  { key: "refreshRate", label: "Refresh rate (Hz)", type: "select", options: ["60", "75", "100", "120", "144", "160", "165", "170", "180", "200", "240", "280", "300", "360", "480", "540"], group: "display" },
  { key: "responseTime", label: "Response time (ms)", type: "select", options: ["0.03", "0.1", "0.5", "1", "2", "4", "5", "8"], group: "display" },
  { key: "brightness", label: "Brightness (nits)", type: "number", group: "display" },
  { key: "contrastRatio", label: "Contrast ratio", type: "text", group: "display" },
  { key: "curved", label: "Curved", type: "boolean", group: "display" },
  { key: "curvature", label: "Curvature", type: "select", options: ["1000R", "1500R", "1800R", "2300R", "3000R", "3800R"], group: "display" },
  { key: "touchscreen", label: "Touchscreen", type: "boolean", group: "display" },
  { key: "HDR", label: "HDR", type: "select", options: ["No", "HDR10", "DisplayHDR 400", "DisplayHDR 500", "DisplayHDR 600", "DisplayHDR 1000", "Dolby Vision"], group: "display" },

  // gaming
  { key: "adaptiveSync", label: "Adaptive Sync", type: "select", options: ["None", "AMD FreeSync", "AMD FreeSync Premium", "AMD FreeSync Premium Pro", "NVIDIA G-SYNC Compatible", "NVIDIA G-SYNC", "NVIDIA G-SYNC Ultimate"], group: "gaming" },
  { key: "motionBlurReduction", label: "Motion blur reduction", type: "boolean", group: "gaming" },

  // connectivity
  { key: "hdmi", label: "HDMI ports", type: "number", group: "connectivity" },
  { key: "displayPort", label: "DisplayPort ports", type: "number", group: "connectivity" },
  { key: "usbC", label: "USB-C", type: "boolean", group: "connectivity" },
  { key: "usbHub", label: "USB Hub", type: "boolean", group: "connectivity" },
  { key: "audioJack", label: "3.5mm Audio Jack", type: "boolean", group: "connectivity" },

  // audio
  { key: "speakers", label: "Built-in speakers", type: "boolean", group: "audio" },

  // ergonomics
  { key: "vesaMount", label: "VESA mount", type: "boolean-with-text", textLabel: "VESA pattern (e.g. 75×75 mm, 100×100 mm)", group: "ergonomics" },
  { key: "heightAdjustment", label: "Height adjustment", type: "boolean", group: "ergonomics" },
  { key: "pivot", label: "Pivot", type: "boolean", group: "ergonomics" },
  { key: "swivel", label: "Swivel", type: "boolean", group: "ergonomics" },
  { key: "tilt", label: "Tilt", type: "boolean", group: "ergonomics" },

  // power
  { key: "powerConsumption", label: "Power consumption (W)", type: "number", group: "power" },
]