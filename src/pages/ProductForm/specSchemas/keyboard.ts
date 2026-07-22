import type { SpecField } from "./types"

const keyboardSeries: Record<string, string[]> = {
  Logitech: ["MX Keys", "MX Mechanical", "G413", "G512", "G915", "G Pro X", "POP Keys", "K120", "K380", "K780"],
  Razer: ["BlackWidow", "Huntsman", "DeathStalker", "Ornata", "Pro Type", "Turret"],
  SteelSeries: ["Apex 3", "Apex 5", "Apex 7", "Apex Pro"],
  Corsair: ["K55", "K65", "K70", "K95", "K100"],
  HyperX: ["Alloy Origins", "Alloy Elite", "Alloy Rise"],
  ASUS: ["ROG Azoth", "ROG Falchion", "ROG Claymore", "TUF K3"],
  MSI: ["Vigor GK30", "Vigor GK50", "Strike"],
  Keychron: ["K2", "K4", "K6", "K8", "K10", "Q1", "Q3", "V1", "V3"],
  Redragon: ["K552", "K530", "K617", "K596"],
  Akko: ["3068B", "5075B", "MOD007"],
  Epomaker: ["TH80", "TH66", "RT100"],
  RoyalKludge: ["RK61", "RK68", "RK84", "RK87", "RK100"],
  Ducky: ["One 2", "One 3"],
  CoolerMaster: ["CK530", "CK550", "MK730"],
  A4Tech: ["Bloody", "FK", "KR"],
  Apple: ["Magic Keyboard"],
  Microsoft: ["Designer Keyboard", "Surface Keyboard"],
}

export const keyboardSpecSchema: SpecField[] = [
  // general
  { key: "brand", label: "Brand", type: "select", options: Object.keys(keyboardSeries), group: "general" },
  { key: "series", label: "Series", type: "select", group: "general", getOptions: (specifications) => { const brand = specifications.general?.brand as string; return keyboardSeries[brand] || [] } },
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Gray", "Silver", "Blue", "Red", "Green", "Pink", "Purple", "Yellow"], group: "general" },
  { key: "layout", label: "Layout", type: "select", options: ["ANSI", "ISO", "JIS"] , group: "general" },
  { key: "formFactor", label: "Form factor", type: "select", options: ["100%", "96%", "95%", "90%", "87% (TKL)", "80% (TKL)", "75%", "70%", "68%", "65%", "60%", "40%", "Numpad"] , group: "general" },
  { key: "weight", label: "Weight (g)", type: "number", group: "general" },

  // switches
  { key: "keyboardType", label: "Keyboard type", type: "select", options: ["Mechanical", "Membrane", "Scissor", "Optical", "Hall Effect"] , group: "switches" },
  { key: "switchBrand", label: "Switch brand", type: "select", options: ["Cherry", "Gateron", "Kailh", "Outemu", "Akko", "Razer", "Logitech GX", "SteelSeries OmniPoint", "Corsair ML", "Keychron", "TTC"] , group: "switches" },
  { key: "switchType", label: "Switch type", type: "select", options: ["Red", "Blue", "Brown", "Black", "Silver", "Silent Red", "Silent Black", "Green", "Yellow", "Orange", "Purple", "White"] , group: "switches" },
  { key: "hotSwappable", label: "Hot-swappable", type: "boolean", group: "switches" },
  { key: "antiGhosting", label: "Anti-ghosting", type: "boolean", group: "switches" },
  { key: "nKeyRollover", label: "N-key rollover", type: "boolean", group: "switches" },
  { key: "pollingRate", label: "Polling rate", type: "select", options: ["125 Hz", "250 Hz", "500 Hz", "1000 Hz", "2000 Hz", "4000 Hz", "8000 Hz"] , group: "switches" },

  // keys
  { key: "keycapMaterial", label: "Keycap material", type: "select", options: ["ABS", "PBT", "Double-shot ABS", "Double-shot PBT", "POM"] , group: "keys" },
  { key: "multimediaKeys", label: "Multimedia keys", type: "boolean", group: "keys" },

  // connectivity
  { key: "connection", label: "Connection", type: "select", options: ["Wired", "Wireless", "Wired & Wireless"] , group: "connectivity" },
  { key: "connector", label: "Connector", type: "select", options: ["USB-A", "USB-C", "Micro-USB"] , group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["None", "4.2", "5.0", "5.1", "5.2", "5.3"] , group: "connectivity" },
  { key: "wirelessTechnology", label: "Wireless technology", type: "select", options: ["2.4 GHz", "Bluetooth", "2.4 GHz + Bluetooth"] , group: "connectivity" },
  { key: "detachableCable", label: "Detachable cable", type: "boolean", group: "connectivity" },

  // lighting
  { key: "backlight", label: "Backlight", type: "boolean", group: "lighting" },
  { key: "rgb", label: "RGB lighting", type: "boolean", group: "lighting" },
  { key: "lightingZones", label: "Lighting zones", type: "select", options: ["Single zone", "Multi-zone", "Per-key RGB"] , group: "lighting" },

  // battery
  { key: "batteryCapacity", label: "Battery (mAh)", type: "number", group: "battery" },
  { key: "batteryLife", label: "Battery life (hours)", type: "number", group: "battery" },
  { key: "usbCCharging", label: "USB-C charging", type: "boolean", group: "battery" },

  // compatibility
  { key: "windows", label: "Windows", type: "boolean", group: "compatibility" },
  { key: "macOS", label: "macOS", type: "boolean", group: "compatibility" },
  { key: "linux", label: "Linux", type: "boolean", group: "compatibility" },
  { key: "android", label: "Android", type: "boolean", group: "compatibility" },
  { key: "ios", label: "iOS / iPadOS", type: "boolean", group: "compatibility" },

  // accessories
  { key: "wristRest", label: "Wrist rest included", type: "boolean", group: "accessories" },
  { key: "keycapPuller", label: "Keycap puller included", type: "boolean", group: "accessories" },
  { key: "extraKeycaps", label: "Extra keycaps included", type: "boolean", group: "accessories" },
  { key: "usbReceiver", label: "USB receiver included", type: "boolean", group: "accessories" },
  { key: "cableIncluded", label: "Cable included", type: "boolean", group: "accessories" },
]