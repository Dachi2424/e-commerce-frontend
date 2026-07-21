// A schema is just data describing what fields exist for this category and
// how to render them. SpecForm reads this and doesn't need to know anything
// about phones specifically — copy this file for laptop/tablet/etc and swap
// the fields.
//
// `group` doubles as the actual storage key inside specifications (e.g.
// specifications.display.diagonal), so it must be lowercase and match
// exactly what the backend stores/expects.

export type SpecFieldType = "text" | "number" | "boolean" | "boolean-with-text" | "select"

export type SpecField = {
  key: string
  label: string
  type: SpecFieldType
  group: string
  options?: string[]        // only used when type === "select"
  textLabel?: string        // only used when type === "boolean-with-text" (e.g. "Wattage")
}

export const phoneSpecSchema: SpecField[] = [
  // general
  { key: "brand", label: "Brand", type: "text", group: "general" },
  { key: "serie", label: "Series", type: "text", group: "general" },
  { key: "weight", label: "Weight (g)", type: "number", group: "general" },
  { key: "color", label: "Color", type: "text", group: "general" },
  { key: "warrantyForPhysicalPerson", label: "Warranty (months)", type: "number", group: "general" },

  // connectivity
  { key: "2G", label: "2G", type: "boolean", group: "connectivity" },
  { key: "3G", label: "3G", type: "boolean", group: "connectivity" },
  { key: "4G(LTE)", label: "4G (LTE)", type: "boolean", group: "connectivity" },
  { key: "4.5G(LTE-A)", label: "4.5G (LTE-A)", type: "boolean", group: "connectivity" },
  { key: "5G", label: "5G", type: "boolean", group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "text", group: "connectivity" },
  { key: "NFC", label: "NFC", type: "boolean", group: "connectivity" },
  { key: "Wi-Fi", label: "Wi-Fi", type: "text", group: "connectivity" },
  { key: "fmRadioSupport", label: "FM Radio", type: "boolean", group: "connectivity" },

  // display
  { key: "diagonal", label: "Screen size (in)", type: "number", group: "display" },
  { key: "resolution", label: "Resolution", type: "text", group: "display" },
  { key: "screenType", label: "Screen type", type: "text", group: "display" },
  { key: "screenFormat", label: "Screen format", type: "text", group: "display" },
  { key: "refreshRate", label: "Refresh rate (Hz)", type: "number", group: "display" },
  { key: "HDRSupport", label: "HDR support", type: "text", group: "display" },
  { key: "screenProtection", label: "Screen protection", type: "text", group: "display" },
  { key: "brightness", label: "Brightness (nits)", type: "number", group: "display" },
  { key: "doblyVision", label: "Dolby Vision", type: "boolean", group: "display" },

  // processor
  { key: "processorManufacturer", label: "Processor manufacturer", type: "text", group: "processor" },
  { key: "processorType", label: "Processor type", type: "text", group: "processor" },
  { key: "processor", label: "Processor description", type: "text", group: "processor" },
  { key: "numberOfCores", label: "Number of cores", type: "number", group: "processor" },
  { key: "lithography", label: "Lithography (nm)", type: "number", group: "processor" },
  { key: "graphicProcessor", label: "Graphics processor", type: "text", group: "processor" },

  // memory
  { key: "RAM", label: "RAM (GB)", type: "number", group: "memory" },
  { key: "internalMemory", label: "Internal storage (GB)", type: "number", group: "memory" },
  { key: "memoryCardSupport", label: "Memory card support", type: "boolean", group: "memory" },

  // camera
  { key: "numberOfCamera", label: "Number of rear cameras", type: "number", group: "camera" },
  { key: "mianCameraMp", label: "Main camera", type: "text", group: "camera" },
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
  { key: "accelometer", label: "Accelerometer", type: "boolean", group: "sensors" },
  { key: "compass", label: "Compass", type: "boolean", group: "sensors" },
  { key: "barometer", label: "Barometer", type: "boolean", group: "sensors" },
  { key: "proximity", label: "Proximity sensor", type: "boolean", group: "sensors" },
  { key: "siri", label: "Voice assistant", type: "boolean", group: "sensors" },

  // battery
  { key: "wirelessCharging", label: "Wireless charging", type: "boolean-with-text", textLabel: "Wattage", group: "battery" },
  { key: "batteryType", label: "Battery type", type: "text", group: "battery" },
  { key: "fastCharging", label: "Fast charging", type: "boolean-with-text", textLabel: "Details", group: "battery" },

  // os
  { key: "OSVersion", label: "OS version", type: "number", group: "os" },
  { key: "OSUpgradable", label: "OS upgradable", type: "boolean", group: "os" },
  { key: "OS", label: "Operating system", type: "select", options: ["iOS", "Android"], group: "os" },

  // audio
  { key: "stereoSound", label: "Stereo sound", type: "boolean", group: "audio" },
  { key: "loudSpeaker", label: "Loudspeaker", type: "boolean", group: "audio" },
  { key: "numberOfSpeakers", label: "Number of speakers", type: "number", group: "audio" },
  { key: "microphone", label: "Microphone", type: "boolean", group: "audio" },

  // accessories
  { key: "adapter", label: "Adapter included", type: "boolean", group: "accessories" },
  { key: "cableIncluded", label: "Cable included", type: "boolean", group: "accessories" },
]