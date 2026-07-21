// A schema is just data describing what fields exist for this category and
// how to render them. SpecForm reads this and doesn't need to know anything
// about phones specifically — copy this file for laptop/tablet/etc and swap
// the fields.
//
// `group` doubles as the actual storage key inside specifications (e.g.
// specifications.display.diagonal), so it must be lowercase and match
// exactly what the backend stores/expects.
import type { SpecField } from "./types"




const phoneSeries: Record<string, string[]> = {
  Apple: ["iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max", "iPhone 15", "iPhone 15 Pro"],
  Samsung: ["Galaxy S26", "Galaxy S26 Ultra", "Galaxy A56", "Galaxy A36"],
  Xiaomi: ["Xiaomi 15", "Xiaomi 15 Pro"],
  Redmi: ["Redmi Note 14", "Redmi 14C"],
  POCO: ["POCO F7", "POCO X7"],
  Google: [],
  OnePlus: [],
  OPPO: [],
  vivo: [],
  Realme: [],
  Honor: [],
  Huawei: [],
  Asus: [],
  Sony: [],
  TCL: [],
  Motorola: [],
  Nokia: [],
  Nothing: [],
  ZTE: []
}


const processorTypes: Record<string, string[]> = {
  Apple: ["A17 Pro", "A18", "A18 Pro"],
  Qualcomm: ["Snapdragon 8 Gen 3", "Snapdragon 8 Gen 2", "Snapdragon 7+ Gen 3"],
  MediaTek: ["Dimensity 9400", "Dimensity 9300", "Dimensity 8300"],
  Samsung: ["Exynos 2400", "Exynos 2200"],
  Google: ["Tensor G4", "Tensor G3"],
  HiSilicon: ["Kirin 9000S", "Kirin 9010"],
  Unisoc: ["T606", "T616", "T820"]
}


export const phoneSpecSchema: SpecField[] = [
  // general
  { key: "brand", label: "Brand", type: "select", options: Object.keys(phoneSeries), group: "general" },
  { key: "series", label: "Series", type: "select", group: "general", getOptions: (specifications) => {const brand = specifications.general?.brand as string; return phoneSeries[brand] || []}},
  { key: "weight", label: "Weight (g)", type: "number", group: "general" },
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Gray", "Silver", "Blue", "Green", "Purple", "Pink", "Red", "Gold", "Titanium", "Natural Titanium"], group: "general" },
  { key: "warrantyForPhysicalPerson", label: "Warranty (months)", type: "number", group: "general" },

  // connectivity
  { key: "2G", label: "2G", type: "boolean", group: "connectivity" },
  { key: "3G", label: "3G", type: "boolean", group: "connectivity" },
  { key: "4G(LTE)", label: "4G (LTE)", type: "boolean", group: "connectivity" },
  { key: "4.5G(LTE-A)", label: "4.5G (LTE-A)", type: "boolean", group: "connectivity" },
  { key: "5G", label: "5G", type: "boolean", group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["4.0", "4.1", "4.2", "5.0", "5.1", "5.2", "5.3", "5.4"], group: "connectivity" },
  { key: "NFC", label: "NFC", type: "boolean", group: "connectivity" },
  { key: "Wi-Fi", label: "Wi-Fi", type: "select", options: ["Wi-Fi 4", "Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"], group: "connectivity" },
  { key: "fmRadioSupport", label: "FM Radio", type: "boolean", group: "connectivity" },

  // display
  { key: "diagonal", label: "Screen size (in)", type: "number", group: "display" },
  { key: "resolution", label: "Resolution", type: "text", group: "display" },
  { key: "screenType", label: "Screen type", type: "select", options: ["IPS LCD", "TFT LCD", "LTPS LCD", "OLED", "AMOLED", "Super AMOLED", "Dynamic AMOLED", "LTPO OLED", "P-OLED"], group: "display" },
  { key: "screenFormat", label: "Screen format", type: "select", options: ["16:9", "18:9", "19:9", "19.5:9", "20:9", "20.5:9", "21:9"], group: "display" },
  { key: "refreshRate", label: "Refresh rate (Hz)", type: "select", options: ["60", "90", "120", "144", "165", "240"], group: "display" },
  { key: "HDRSupport", label: "HDR support", type: "text", group: "display" },
  { key: "screenProtection", label: "Screen protection", type: "select", options: ["Gorilla Glass 3", "Gorilla Glass 5", "Gorilla Glass Victus", "Gorilla Glass Victus+", "Gorilla Glass Victus 2", "Gorilla Glass Armor", "Ceramic Shield", "Dragontrail Glass", "Sapphire Crystal"], group: "display" },
  { key: "brightness", label: "Brightness (nits)", type: "number", group: "display" },

  // processor
  { key: "processorManufacturer", label: "Processor manufacturer", type: "select", options: Object.keys(processorTypes), group: "processor" },
  { key: "processorType", label: "Processor type", type: "select", getOptions: (specifications) => {const manufacturer = specifications.processor?.processorManufacturer as string; return processorTypes[manufacturer] || []}, group: "processor" },
  { key: "numberOfCores", label: "Number of cores", type: "number", group: "processor" },
  { key: "lithography", label: "Lithography (nm)", type: "number", group: "processor" },
  { key: "graphicProcessor", label: "Graphics processor", type: "select", options: ["Apple GPU", "Adreno", "Mali", "Immortalis-G720", "Immortalis-G925", "Xclipse", "PowerVR", "IMG B-Series", "IMG C-Series"], group: "processor" },

  // memory
  { key: "RAM", label: "RAM (GB)", type: "select", options: ["512MB", "1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "10GB", "12GB", "16GB", "18GB", "24GB"], group: "memory" },
  { key: "internalMemory", label: "Internal storage (GB)", type: "select", options: ["4GB", "8GB", "16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB"], group: "memory" },
  { key: "memoryCardSupport", label: "Memory card support", type: "boolean", group: "memory" },

  // camera
  { key: "numberOfCamera", label: "Number of rear cameras", type: "number", group: "camera" },
  { key: "mainCameraMp", label: "Main camera", type: "text", group: "camera" },
  { key: "secondCameraMp", label: "Second camera", type: "text", group: "camera" },
  { key: "videoResolution", label: "Video resolution", type: "text", group: "camera" },
  { key: "autoFocus", label: "Autofocus", type: "boolean", group: "camera" },
  { key: "panorama", label: "Panorama", type: "boolean", group: "camera" },
  { key: "mainCelfieCameraMp", label: "Front camera (MP)", type: "number", group: "camera" },
  { key: "secondCelfieCameraMp", label: "Front camera (secondary)", type: "text", group: "camera" },
  { key: "celfieVideoResolution", label: "Front camera video resolution", type: "text", group: "camera" },
  { key: "celfieAutoFocus", label: "Front camera autofocus", type: "boolean", group: "camera" },

  // sensors
  { key: "faceId", label: "Face ID", type: "boolean", group: "sensors" },
  { key: "accelerometer", label: "Accelerometer", type: "boolean", group: "sensors" },
  { key: "compass", label: "Compass", type: "boolean", group: "sensors" },
  { key: "barometer", label: "Barometer", type: "boolean", group: "sensors" },
  { key: "proximity", label: "Proximity sensor", type: "boolean", group: "sensors" },
  { key: "siri", label: "Voice assistant", type: "boolean", group: "sensors" },

  // battery
  { key: "wirelessCharging", label: "Wireless charging", type: "boolean-with-text", textLabel: "Wattage", group: "battery" },
  { key: "batteryType", label: "Battery type", type: "text", group: "battery" },
  { key: "fastCharging", label: "Fast charging", type: "boolean-with-text", textLabel: "Details", group: "battery" },

  // os
  { key: "OSVersion", label: "OS version", type: "text", group: "os" },
  { key: "OSUpgradable", label: "OS upgradable", type: "boolean", group: "os" },
  { key: "OS", label: "Operating system", type: "select", options: ["iOS", "Android", "HarmonyOS", "KaiOS"], group: "os" },

  // audio
  { key: "stereoSound", label: "Stereo sound", type: "boolean", group: "audio" },
  { key: "loudSpeaker", label: "Loudspeaker", type: "boolean", group: "audio" },
  { key: "numberOfSpeakers", label: "Number of speakers", type: "number", group: "audio" },
  { key: "microphone", label: "Microphone", type: "boolean", group: "audio" },

  // accessories
  { key: "adapter", label: "Adapter included", type: "boolean", group: "accessories" },
  { key: "cableIncluded", label: "Cable included", type: "boolean", group: "accessories" },
]