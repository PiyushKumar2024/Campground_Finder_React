import { 
  FaFaucet, FaToilet, FaShower, FaTrash, FaFire, 
  FaParking, FaWifi, FaSignal, FaBolt, FaCaravan, 
  FaWater, FaTree, FaDog 
} from "react-icons/fa";

import { 
  MdKitchen, MdLocalLaundryService, MdFamilyRestroom, MdTableRestaurant 
} from "react-icons/md";

import { 
  GiWoodPile, GiCactus 
} from "react-icons/gi";

const PASSIVE_COLOR = "#9ca3af"; // Cool Gray

export const amenityOptions = [
  {
    name: "Essentials",
    amenities: [
      { 
        label: "Potable Water", 
        value: "water", 
        passiveIcon: <FaFaucet size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaFaucet size={20} color="#3b82f6"/> 
      },
      { 
        label: "Toilet", 
        value: "toilet", 
        passiveIcon: <FaToilet size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaToilet size={20} color="#06b6d4"/> 
      },
      { 
        label: "Showers", 
        value: "shower", 
        passiveIcon: <FaShower size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaShower size={20} color="#0ea5e9"/> 
      },
      { 
        label: "Trash Cans", 
        value: "trash", 
        passiveIcon: <FaTrash size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaTrash size={20} color="#ef4444"/> 
      },
      { 
        label: "Campfire Allowed", 
        value: "campfire", 
        passiveIcon: <FaFire size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaFire size={20} color="#f97316"/> 
      }
    ]
  },
  {
    name: "Comfort & Gear",
    amenities: [
      { 
        label: "Firewood", 
        value: "firewood", 
        passiveIcon: <GiWoodPile size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <GiWoodPile size={20} color="#eab308"/> 
      },
      { 
        label: "Picnic Table", 
        value: "picnic_table", 
        passiveIcon: <MdTableRestaurant size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <MdTableRestaurant size={20} color="#d97706"/> 
      },
      { 
        label: "Shared Kitchen", 
        value: "kitchen", 
        passiveIcon: <MdKitchen size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <MdKitchen size={20} color="#8b5cf6" /> 
      },
      { 
        label: "Laundry", 
        value: "laundry", 
        passiveIcon: <MdLocalLaundryService size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <MdLocalLaundryService size={20} color="#06b6d4"/> 
      },
      { 
        label: "Parking", 
        value: "parking", 
        passiveIcon: <FaParking size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaParking size={20} color="#2563eb"/> 
      }
    ]
  },
  {
    name: "Connectivity",
    amenities: [
      { 
        label: "WiFi", 
        value: "wifi", 
        passiveIcon: <FaWifi size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaWifi size={20} color="#8b5cf6"/> 
      },
      { 
        label: "Cell Signal", 
        value: "signal", 
        passiveIcon: <FaSignal size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaSignal size={20} color="#22c55e" /> 
      },
      { 
        label: "Electric Hookup", 
        value: "electric", 
        passiveIcon: <FaBolt size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaBolt size={20} color="#facc15"/> 
      },
      { 
        label: "RV Sanitary Dump", 
        value: "rv_dump", 
        passiveIcon: <FaCaravan size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaCaravan size={20} color="#9333ea"/> 
      }
    ]
  },
  {
    name: "Location & Vibes",
    amenities: [
      { 
        label: "Waterfront", 
        value: "waterfront", 
        passiveIcon: <FaWater size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaWater size={20} color="#06b6d4"/> 
      },
      { 
        label: "Forest", 
        value: "forest", 
        passiveIcon: <FaTree size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaTree size={20} color="#16a34a"/> 
      },
      { 
        label: "Desert", 
        value: "desert", 
        passiveIcon: <GiCactus size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <GiCactus size={20} color="#84cc16"/> 
      },
      { 
        label: "Pet Friendly", 
        value: "pets", 
        passiveIcon: <FaDog size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <FaDog size={20} color="#d946ef" /> 
      },
      { 
        label: "Family Friendly", 
        value: "family", 
        passiveIcon: <MdFamilyRestroom size={20} color={PASSIVE_COLOR} />, 
        activeIcon: <MdFamilyRestroom size={20} color="#f43f5e"/> 
      }
    ]
  }
];

export const amenitiesLookup = {
  // --- Essentials ---
  water: {
    label: "Potable Water",
    active: <FaFaucet size={20} color="#3b82f6"/>, // Bright Blue
    passive: <FaFaucet size={20} color={PASSIVE_COLOR} />
  },
  toilet: {
    label: "Toilet",
    active: <FaToilet size={20} color="#06b6d4"/>, // Cyan
    passive: <FaToilet size={20} color={PASSIVE_COLOR} />
  },
  shower: {
    label: "Showers",
    active: <FaShower size={20} color="#0ea5e9"/>, // Sky Blue
    passive: <FaShower size={20} color={PASSIVE_COLOR} />
  },
  trash: {
    label: "Trash Cans",
    active: <FaTrash size={20} color="#ef4444"/>, // Red
    passive: <FaTrash size={20} color={PASSIVE_COLOR} />
  },
  campfire: {
    label: "Campfire Allowed",
    active: <FaFire size={20} color="#f97316"/>, // Orange
    passive: <FaFire size={20} color={PASSIVE_COLOR} />
  },

  // --- Comfort ---
  firewood: {
    label: "Firewood",
    active: <GiWoodPile size={20} color="#eab308"/>, // Gold
    passive: <GiWoodPile size={20} color={PASSIVE_COLOR} />
  },
  picnic_table: {
    label: "Picnic Table",
    active: <MdTableRestaurant size={20} color="#d97706"/>, // Pumpkin
    passive: <MdTableRestaurant size={20} color={PASSIVE_COLOR} />
  },
  kitchen: {
    label: "Shared Kitchen",
    active: <MdKitchen size={20} color="#8b5cf6" />, // Violet
    passive: <MdKitchen size={20} color={PASSIVE_COLOR} />
  },
  laundry: {
    label: "Laundry",
    active: <MdLocalLaundryService size={20} color="#06b6d4"/>, // Teal
    passive: <MdLocalLaundryService size={20} color={PASSIVE_COLOR} />
  },
  parking: {
    label: "Parking",
    active: <FaParking size={20} color="#2563eb"/>, // Electric Blue
    passive: <FaParking size={20} color={PASSIVE_COLOR} />
  },

  // --- Connectivity ---
  wifi: {
    label: "WiFi",
    active: <FaWifi size={20} color="#8b5cf6"/>, // Purple
    passive: <FaWifi size={20} color={PASSIVE_COLOR} />
  },
  signal: {
    label: "Cell Signal",
    active: <FaSignal size={20} color="#22c55e" />, // Neon Green
    passive: <FaSignal size={20} color={PASSIVE_COLOR} />
  },
  electric: {
    label: "Electric Hookup",
    active: <FaBolt size={20} color="#facc15"/>, // Yellow
    passive: <FaBolt size={20} color={PASSIVE_COLOR} />
  },
  rv_dump: {
    label: "RV Sanitary Dump",
    active: <FaCaravan size={20} color="#9333ea"/>, // Deep Purple
    passive: <FaCaravan size={20} color={PASSIVE_COLOR} />
  },

  // --- Location ---
  waterfront: {
    label: "Waterfront",
    active: <FaWater size={20} color="#06b6d4"/>, // Cyan
    passive: <FaWater size={20} color={PASSIVE_COLOR} />
  },
  forest: {
    label: "Forest",
    active: <FaTree size={20} color="#16a34a"/>, // Green
    passive: <FaTree size={20} color={PASSIVE_COLOR} />
  },
  desert: {
    label: "Desert",
    active: <GiCactus size={20} color="#84cc16"/>, // Lime
    passive: <GiCactus size={20} color={PASSIVE_COLOR} />
  },
  pets: {
    label: "Pet Friendly",
    active: <FaDog size={20} color="#d946ef" />, // Fuschia
    passive: <FaDog size={20} color={PASSIVE_COLOR} />
  },
  family: {
    label: "Family Friendly",
    active: <MdFamilyRestroom size={20} color="#f43f5e"/>, // Pink
    passive: <MdFamilyRestroom size={20} color={PASSIVE_COLOR} />
  },
};