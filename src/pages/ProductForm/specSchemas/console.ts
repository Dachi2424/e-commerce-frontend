import type { SpecField } from "./types"

const consoleSeries: Record<string, string[]> = {
  Sony: ["PlayStation 5", "PlayStation 5 Slim", "PlayStation 5 Pro", "PlayStation 4", "PlayStation 4 Slim", "PlayStation 4 Pro"],
  Microsoft: ["Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S"],
  Nintendo: ["Nintendo Switch", "Nintendo Switch OLED", "Nintendo Switch Lite", "Nintendo 3DS"]
}

const consoleCPU: Record<string, string[]> = {
  Sony: ["AMD Zen 2 8-core (PS5 / PS5 Slim / PS5 Pro)", "AMD Jaguar 8-core (PS4 / PS4 Slim / PS4 Pro)", "Cell Broadband Engine (PS3)", "Emotion Engine (PS2)", "MIPS R4000-based CPU (PSP)", "ARM Cortex-A9 MPCore (PlayStation Vita)"],
  Microsoft: ["AMD Zen 2 8-core (Xbox Series X / Series S)", "AMD Jaguar 8-core (Xbox One / One S / One X)", "IBM PowerPC Xenon 3-core (Xbox 360)", "Intel Pentium III Custom (Original Xbox)"],
  Nintendo: ["NVIDIA Tegra X1 (Nintendo Switch / Switch OLED / Switch Lite)", "IBM Espresso 3-core PowerPC (Wii U)", "IBM Broadway PowerPC (Wii)", "IBM Gekko PowerPC (GameCube)", "ARM11 MPCore (Nintendo 3DS)", "ARM9 (Nintendo DS)", "ARM7TDMI (Game Boy Advance)", "Custom Sharp LR35902 (Game Boy / Game Boy Color)"]
}

const consoleGPU: Record<string, string[]> = {
  Sony: ["AMD RDNA 2 (PS5)", "AMD RDNA-based GPU (PS5 Pro)", "AMD GCN GPU (PS4 / PS4 Pro)", "NVIDIA RSX Reality Synthesizer (PS3)", "Graphics Synthesizer (PS2)", "Sony CXD1876 GPU (PSP)", "SGX543MP4+ GPU (PS Vita)"],
  Microsoft: ["AMD RDNA 2 GPU (Xbox Series X/S)", "AMD GCN GPU (Xbox One / One S / One X)", "ATI Xenos GPU (Xbox 360)", "NVIDIA NV2A GPU (Original Xbox)"],
  Nintendo: ["NVIDIA Maxwell GPU (Switch)", "AMD Radeon GPU (Wii U)", "AMD Hollywood GPU (Wii)", "ATI Flipper GPU (GameCube)", "DMP PICA200 GPU (Nintendo 3DS)"]
}

export const consoleSpecSchema: SpecField[] = [
  // general
  { key: "brand", label: "Brand", type: "select", options: Object.keys(consoleSeries), group: "general" },
  { key: "series", label: "Series", type: "select", group: "general", dependsOn: "brand", getOptions: (specifications) => {const brand = specifications.general?.brand as string; return consoleSeries[brand] || [] }},

  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Gray", "Blue", "Red"], group: "general" },
  { key: "releaseYear", label: "Release year", type: "number", group: "general" },

  // processor
  { key: "CPU", label: "CPU", type: "select", group: "processor", dependsOn: "brand", getOptions: (specifications) => { const brand = specifications.general?.brand as string; return consoleCPU[brand] || [] }},

  // graphics
  { key: "GPU", label: "GPU", type: "select", group: "graphics", dependsOn: "brand", getOptions: (specifications) => { const brand = specifications.general?.brand as string; return consoleGPU[brand] || [] }},
  { key: "rayTracing", label: "Ray tracing support", type: "boolean", group: "graphics" },

  // memory
  { key: "RAM", label: "RAM", type: "select", options: ["2GB", "4GB", "8GB", "10GB", "12GB", "16GB"], group: "memory" },
  { key: "storage", label: "Storage", type: "select", options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "825GB", "1TB", "2TB"], group: "memory" },
  { key: "storageType", label: "Storage type", type: "select", options: ["HDD", "SSD", "NVMe SSD"], group: "memory" },

  // display
  { key: "resolution", label: "Maximum resolution", type: "select", options: ["1080p", "1440p", "4K", "8K"], group: "display" },
  { key: "refreshRate", label: "Maximum refresh rate (Hz)", type: "select", options: ["60", "120", "144", "165"], group: "display" },

  // connectivity
  { key: "wifi", label: "Wi-Fi", type: "select", options: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E"], group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["4.2", "5.0", "5.1", "5.2", "5.3"], group: "connectivity" },
  { key: "ethernet", label: "Ethernet port", type: "boolean", group: "connectivity" },

  // features
  { key: "opticalDrive", label: "Optical drive", type: "boolean", group: "features" },
  { key: "digitalEdition", label: "Digital edition", type: "boolean", group: "features" },

  // accessories
  { key: "controllerIncluded", label: "Controller included", type: "boolean", group: "accessories" },
  { key: "controllerCount", label: "Number of controllers", type: "number", group: "accessories" }

]