import type { SpecField } from "./types"

const cpuTypes: Record<string, string[]> = {
  Intel: ["Core i3-6100", "Core i3-7100", "Core i3-8100", "Core i3-9100F", "Core i3-10100", "Core i3-12100F", "Core i3-13100F", "Core i5-6500", "Core i5-7400", "Core i5-8400", "Core i5-9400F", "Core i5-10400F", "Core i5-11400F", "Core i5-12400F", "Core i5-13400F", "Core i5-14400F", "Core i5-12600K", "Core i5-13600K", "Core i5-14600K", "Core i7-6700K", "Core i7-7700K", "Core i7-8700K", "Core i7-9700K", "Core i7-10700K", "Core i7-11700K", "Core i7-12700K", "Core i7-13700K", "Core i7-14700K", "Core i9-9900K", "Core i9-10900K", "Core i9-11900K", "Core i9-12900K", "Core i9-13900K", "Core i9-14900K", "Core Ultra 5 225F", "Core Ultra 7 265K", "Core Ultra 9 285K"],
  AMD: ["Ryzen 3 1200", "Ryzen 3 2200G", "Ryzen 3 3100", "Ryzen 3 4100", "Ryzen 5 1600", "Ryzen 5 2600", "Ryzen 5 3600", "Ryzen 5 4500", "Ryzen 5 5500", "Ryzen 5 5600", "Ryzen 5 5600X", "Ryzen 5 7600", "Ryzen 5 7600X", "Ryzen 5 8600G", "Ryzen 7 1700", "Ryzen 7 2700X", "Ryzen 7 3700X", "Ryzen 7 5700X", "Ryzen 7 5800X", "Ryzen 7 5800X3D", "Ryzen 7 7700", "Ryzen 7 7800X3D", "Ryzen 9 3900X", "Ryzen 9 5900X", "Ryzen 9 5950X", "Ryzen 9 7900X", "Ryzen 9 7950X", "Ryzen 9 7950X3D", "Threadripper 3960X", "Threadripper 3970X", "Threadripper 7960X"]
}
const gpuModels: Record<string, string[]> = {
  NVIDIA: ["GTX 750 Ti", "GTX 950", "GTX 960", "GTX 970", "GTX 980", "GTX 1050", "GTX 1050 Ti", "GTX 1060 3GB", "GTX 1060 6GB", "GTX 1070", "GTX 1080", "GTX 1080 Ti", "GTX 1650", "GTX 1650 Super", "GTX 1660", "GTX 1660 Super", "GTX 1660 Ti", "RTX 2060", "RTX 2060 Super", "RTX 2070", "RTX 2070 Super", "RTX 2080", "RTX 2080 Super", "RTX 2080 Ti", "RTX 3050 8GB", "RTX 3060 12GB", "RTX 3060 Ti", "RTX 3070", "RTX 3070 Ti", "RTX 3080", "RTX 3080 Ti", "RTX 3090", "RTX 3090 Ti", "RTX 4060", "RTX 4060 Ti", "RTX 4070", "RTX 4070 Super", "RTX 4070 Ti", "RTX 4070 Ti Super", "RTX 4080", "RTX 4080 Super", "RTX 4090", "RTX 5070", "RTX 5070 Ti", "RTX 5080", "RTX 5090"],
  AMD: ["RX 460", "RX 470", "RX 480", "RX 550", "RX 560", "RX 570", "RX 580", "RX 590", "RX 5500 XT", "RX 5600 XT", "RX 5700", "RX 5700 XT", "RX 6400", "RX 6500 XT", "RX 6600", "RX 6600 XT", "RX 6650 XT", "RX 6700 XT", "RX 6750 XT", "RX 6800", "RX 6800 XT", "RX 6900 XT", "RX 7600", "RX 7600 XT", "RX 7700 XT", "RX 7800 XT", "RX 7900 GRE", "RX 7900 XT", "RX 7900 XTX"],
  Intel: ["Arc A380", "Arc A580", "Arc A750", "Arc A770", "Arc B580", "Arc B570"]
}

export const pcSpecSchema: SpecField[] = [
  // general
  { key: "caseType", label: "Case type", type: "select", options: ["Mini Tower", "Mid Tower", "Full Tower", "SFF"], group: "general" },
  { key: "color", label: "Color", type: "select", options: ["Black", "White", "Gray", "Silver"], group: "general" },
  { key: "warrantyForPhysicalPerson", label: "Warranty (months)", type: "number", group: "general" },

  // processor
  { key: "processorManufacturer", label: "Processor manufacturer", type: "select", options: Object.keys(cpuTypes), group: "processor" },
  { key: "processorType", label: "Processor type", type: "select", group: "processor", dependsOn: "processorManufacturer", getOptions: (specifications) => { const manufacturer = specifications.processor?.processorManufacturer as string; return cpuTypes[manufacturer] || [] }},
  { key: "numberOfCores", label: "Number of cores", type: "number", group: "processor" },
  { key: "processorSpeed", label: "Processor speed (GHz)", type: "number", group: "processor" },

  // graphics
  { key: "graphicsManufacturer", label: "Graphics manufacturer", type: "select", options: Object.keys(gpuModels), group: "graphics" },
  { key: "graphicsModel", label: "Graphics model", type: "select", group: "graphics", dependsOn: "graphicsManufacturer", getOptions: (specifications) => { const manufacturer = specifications.graphics?.graphicsManufacturer as string; return gpuModels[manufacturer] || [] }},
  { key: "graphicsMemory", label: "Graphics memory", type: "select", options: ["4GB", "6GB", "8GB", "12GB", "16GB", "24GB"], group: "graphics" },

  // memory
  { key: "RAM", label: "RAM", type: "select", options: ["8GB", "16GB", "32GB", "64GB", "128GB"], group: "memory" },
  { key: "RAMType", label: "RAM type", type: "select", options: ["DDR4", "DDR5"], group: "memory" },

  // storage
  { key: "storage", label: "Storage", type: "select", options: ["256GB", "512GB", "1TB", "2TB", "4TB"], group: "storage" },
  { key: "storageType", label: "Storage type", type: "select", options: ["HDD", "SSD SATA", "SSD NVMe"], group: "storage" },

  // motherboard
  { key: "motherboardChipset", label: "Motherboard chipset", type: "text", group: "motherboard" },
  { key: "motherboardFormFactor", label: "Motherboard form factor", type: "select", options: ["Mini ITX", "Micro ATX", "ATX", "E-ATX"], group: "motherboard" },

  // power
  { key: "powerSupply", label: "Power supply (W)", type: "number", group: "power" },

  // cooling
  { key: "cooling", label: "Cooling", type: "select", options: ["Stock cooler", "Air cooler", "Liquid cooling"], group: "cooling" },

  // operating system
  { key: "OS", label: "Operating system", type: "select", options: ["Windows 11", "Windows 10", "Linux", "No OS"], group: "os" },

  // connectivity
  { key: "Wi-Fi", label: "Wi-Fi", type: "select", options: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"], group: "connectivity" },
  { key: "bluetooth", label: "Bluetooth", type: "select", options: ["5.0", "5.1", "5.2", "5.3", "5.4"], group: "connectivity" },

  // ports
  { key: "usbA", label: "USB-A ports", type: "number", group: "ports" },
  { key: "usbC", label: "USB-C ports", type: "number", group: "ports" },
  { key: "hdmi", label: "HDMI", type: "boolean", group: "ports" },
  { key: "displayPort", label: "DisplayPort", type: "boolean", group: "ports" },
  { key: "ethernet", label: "Ethernet", type: "boolean", group: "ports" },

  // accessories
  { key: "keyboardIncluded", label: "Keyboard included", type: "boolean", group: "accessories" },
  { key: "mouseIncluded", label: "Mouse included", type: "boolean", group: "accessories" },
]