import type { SpecField } from "./types"

const laptopSeries: Record<string, string[]> = {
  Apple: ["MacBook Air", "MacBook Pro"],
  ASUS: ["Zenbook", "Vivobook", "ExpertBook", "ROG Zephyrus", "ROG Strix", "ROG Flow", "TUF Gaming", "ProArt"],
  Acer: ["Aspire", "Swift", "Spin", "TravelMate", "Nitro", "Predator"],
  Dell: ["Inspiron", "XPS", "Latitude", "Precision", "Vostro", "Alienware"],
  HP: ["Pavilion", "Victus", "OMEN", "Envy", "Spectre", "ProBook", "EliteBook", "ZBook"],
  Lenovo: ["IdeaPad", "ThinkPad", "ThinkBook", "Legion", "Yoga", "LOQ"],
  MSI: ["Modern", "Prestige", "Summit", "Katana", "Cyborg", "Sword", "Stealth", "Raider", "Titan", "Vector"],
  Huawei: ["MateBook"],
  Samsung: ["Galaxy Book"],
  Microsoft: ["Surface Laptop", "Surface Pro", "Surface Book"],
  LG: ["Gram"],
  Razer: ["Blade"],
  Gigabyte: ["AERO", "AORUS", "G Series"],
  Honor: ["MagicBook"],
  Xiaomi: ["Redmi Book", "Mi Notebook"],
}

const processorTypes: Record<string, string[]> = {
  Intel: ["Core i3", "Core i5", "Core i7", "Core i9", "Core Ultra 5", "Core Ultra 7", "Core Ultra 9"],
  AMD: ["Ryzen 3", "Ryzen 5", "Ryzen 7", "Ryzen 9"],
  Apple: ["M1", "M2", "M3", "M4", "M4 Pro", "M4 Max"],
  Qualcomm: ["Snapdragon X Plus", "Snapdragon X Elite"],
}

const graphicsModels: Record<string, string[]> = {
  NVIDIA: ["GeForce RTX 2050", "GeForce RTX 3050", "GeForce RTX 4050", "GeForce RTX 4060", "GeForce RTX 4070", "GeForce RTX 4080", "GeForce RTX 4090", "RTX 500 Ada", "RTX 1000 Ada", "RTX 2000 Ada", "RTX 3000 Ada", "RTX 3500 Ada", "RTX 4000 Ada", "RTX 5000 Ada"],
  AMD: ["Radeon 610M", "Radeon 660M", "Radeon 680M", "Radeon 760M", "Radeon 780M", "Radeon RX 6550M", "Radeon RX 7600S", "Radeon RX 7600M XT", "Radeon RX 7700S", "Radeon RX 7800M"],
  Intel: ["UHD Graphics", "Iris Xe Graphics", "Arc Graphics", "Arc 130V", "Arc 140V"],
  Apple: ["7-core GPU", "8-core GPU", "10-core GPU", "16-core GPU", "20-core GPU", "32-core GPU", "40-core GPU"],
}


const graphicsMemory: Record<string, string[]> = {
  NVIDIA: [ "4GB", "6GB", "8GB", "12GB", "16GB" ],
  AMD: [ "2GB", "4GB", "6GB", "8GB", "12GB", "16GB" ],
  Intel: [ "Shared" ],
  Apple: [ "Shared" ],
}


export const laptopSpecSchema: SpecField[] = [
  // general
  { key: "brand", label: "Brand", type: "select", options: Object.keys(laptopSeries), group: "general" },
  { key: "series", label: "Series", type: "select", group: "general", getOptions: (specifications) => { const brand = specifications.general?.brand as string; return laptopSeries[brand] || []}},
  { key: "weight", label: "Weight (g)", type: "number", group: "general" },
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Silver", "Gray", "Blue", "Green"], group: "general" },
  { key: "warrantyForPhysicalPerson", label: "Warranty (months)", type: "number", group: "general" },

  // display
  { key: "diagonal", label: "Screen size (in)", type: "number", group: "display" },
  { key: "resolution", label: "Resolution", type: "text", group: "display" },
  { key: "screenType", label: "Screen type", type: "select", options: ["TN", "IPS", "OLED", "Mini LED"], group: "display" },
  { key: "refreshRate", label: "Refresh rate (Hz)", type: "select", options: ["60", "90", "120", "144", "165", "180", "240", "360"], group: "display" },
  { key: "brightness", label: "Brightness (nits)", type: "number", group: "display" },
  { key: "touchscreen", label: "Touchscreen", type: "boolean", group: "display" },

  // processor
  { key: "processorManufacturer", label: "Processor manufacturer", type: "select", options: Object.keys(processorTypes), group: "processor" },
  { key: "processorType", label: "Processor type", type: "select", group: "processor", getOptions: (specifications) => { const manufacturer = specifications.processor?.processorManufacturer as string; return processorTypes[manufacturer] || []}},
  { key: "numberOfCores", label: "Number of cores", type: "number", group: "processor" },
  { key: "processorSpeed", label: "Processor speed (GHz)", type: "number", group: "processor" },

  // graphics
  { key: "graphicsManufacturer", label: "Graphics manufacturer", type: "select", options: Object.keys(graphicsModels), group: "graphics" },
  { key: "graphicsModel", label: "Graphics model", type: "select", group: "graphics", getOptions: (specifications) => {const manufacturer = specifications.graphics?.graphicsManufacturer as string; return graphicsModels[manufacturer] || []} },
  { key: "graphicsMemory", label: "Graphics memory", type: "select", group: "graphics", getOptions: (specifications) => {const manufacturer = specifications.graphics?.graphicsManufacturer as string; return graphicsMemory[manufacturer] || []} },

  // memory
  { key: "RAM", label: "RAM", type: "select", options: ["4GB", "8GB", "16GB", "24GB", "32GB", "64GB", "128GB"], group: "memory" },
  { key: "storage", label: "Storage", type: "select", options: ["128GB", "256GB", "512GB", "1TB", "2TB", "4TB"], group: "memory" },
  { key: "storageType", label: "Storage type", type: "select", options: ["HDD", "SSD SATA", "SSD NVMe"], group: "memory" },

  // battery
  { key: "batteryCapacity", label: "Battery (Wh)", type: "number", group: "battery" },
  { key: "fastCharging", label: "Fast charging", type: "boolean", group: "battery" },

  // connectivity
  { key: "Wi-Fi", label: "Wi-Fi", type: "select", options: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"], group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["5.0", "5.1", "5.2", "5.3", "5.4"], group: "connectivity" },

  // ports
  { key: "usbA", label: "USB-A ports", type: "number", group: "ports" },
  { key: "usbC", label: "USB-C ports", type: "number", group: "ports" },
  { key: "hdmi", label: "HDMI", type: "boolean", group: "ports" },
  { key: "ethernet", label: "Ethernet", type: "boolean", group: "ports" },
  { key: "headphoneJack", label: "3.5mm Jack", type: "boolean", group: "ports" },

  // operating system
  { key: "OS", label: "Operating system", type: "select", options: ["Windows 11", "macOS", "Linux", "No OS"], group: "os" },

  // camera
  { key: "webcam", label: "Webcam", type: "select", options: ["720p", "1080p", "1440p", "2160p", "4320p"], group: "camera" },

  // audio
  { key: "microphone", label: "Microphone", type: "boolean", group: "audio" },
  { key: "stereoSound", label: "Stereo speakers", type: "boolean", group: "audio" },

  // accessories
  { key: "chargerIncluded", label: "Charger included", type: "boolean", group: "accessories" },
]