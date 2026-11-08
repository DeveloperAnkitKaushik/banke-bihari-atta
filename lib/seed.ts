import type { Product, Settings } from "./types";

type SeedRow = [id: string, name: string, nameHi: string, category: Product["category"], color: string, badge: string, description: string, sizes: string];

const rows: SeedRow[] = [
  ["chakki-atta", "Chakki Fresh Atta", "चक्की आटा", "atta", "#e2b25a", "Bestseller", "Sharbati wheat stone-ground slow on our chakki, so the bran and the taste stay in. Soft rotis every time.", "1 kg, 5 kg, 10 kg"],
  ["multigrain-atta", "Multigrain Atta", "मल्टीग्रेन आटा", "atta", "#c98f3c", "Healthy", "Wheat blended with jowar, bajra, ragi, chana and jau. Fibre-rich rotis for the whole family.", "1 kg, 5 kg"],
  ["bajra-atta", "Bajra Atta", "बाजरा आटा", "atta", "#8f8a6a", "Winter Special", "Freshly milled pearl millet for warm bajre ki roti and tikki.", "1 kg, 2 kg"],
  ["makka-atta", "Makka Atta", "मक्का आटा", "atta", "#f2c230", "", "Golden maize flour, perfect with sarson ka saag.", "1 kg, 2 kg"],
  ["jowar-atta", "Jowar Atta", "ज्वार आटा", "atta", "#e9dcc0", "Gluten Free", "Light, gluten-free sorghum flour for bhakri and rotis.", "1 kg"],
  ["toor-dal", "Toor Dal", "अरहर दाल", "dal", "#f0a830", "Bestseller", "Cleaned, sorted and unpolished arhar dal that cooks soft and tastes like home.", "500 g, 1 kg, 5 kg"],
  ["moong-dal", "Moong Dal", "मूंग दाल", "dal", "#e8cf48", "", "Yellow moong, easy on the stomach and quick to cook.", "500 g, 1 kg"],
  ["chana-dal", "Chana Dal", "चना दाल", "dal", "#e3a83a", "", "Bold, even-sized chana dal for tadka and halwa.", "500 g, 1 kg"],
  ["masoor-dal", "Masoor Dal", "मसूर दाल", "dal", "#e0703a", "", "Red lentils that cook in minutes.", "500 g, 1 kg"],
  ["urad-dal", "Urad Dal Sabut", "उड़द दाल", "dal", "#3a3330", "", "Whole black urad for dal makhani.", "500 g, 1 kg"],
  ["besan", "Pure Besan", "शुद्ध बेसन", "besan", "#f3cf6b", "Pure", "100% chana dal besan, ground fine for pakode, kadhi and laddoo.", "500 g, 1 kg"],
  ["ragi-atta", "Ragi Atta", "रागी आटा", "besan", "#8a4b3a", "Calcium Rich", "Finger millet flour for porridge, dosa and rotis.", "500 g, 1 kg"],
  ["haldi", "Haldi Powder", "हल्दी", "masale", "#f2b705", "Fresh Ground", "Whole turmeric ground in-house. Real colour, real aroma.", "100 g, 200 g, 500 g"],
  ["lal-mirch", "Lal Mirch Powder", "लाल मिर्च", "masale", "#c62a1a", "", "Bright red chilli powder with balanced heat.", "100 g, 200 g, 500 g"],
  ["dhaniya", "Dhaniya Powder", "धनिया", "masale", "#9b8a4a", "", "Coriander seeds roasted lightly and ground fresh.", "100 g, 200 g, 500 g"],
  ["dalia", "Gehun Dalia", "गेहूं दलिया", "other", "#d8b98a", "", "Broken wheat for khichdi, upma and sweet dalia.", "500 g, 1 kg"],
  ["sooji", "Sooji / Rava", "सूजी", "other", "#f1e2b8", "", "Fine semolina for halwa, upma and rava idli.", "500 g, 1 kg"],
];

export const SEED_PRODUCTS: Product[] = rows.map(([id, name, nameHi, category, color, badge, description, sizes], order) => ({
  id,
  name,
  nameHi,
  category,
  color,
  badge,
  description,
  sizes: sizes.split(", "),
  featured: badge === "Bestseller",
  visible: true,
  order,
  imageVersion: 0,
}));

export const SEED_SETTINGS: Settings = {
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "Main Bazaar, Vrindavan, Uttar Pradesh",
  hours: "Mon–Sun · 7:00 AM – 9:00 PM",
  mapQuery: "Banke Bihari Temple, Vrindavan",
  since: "1998",
  families: "5000",
};
