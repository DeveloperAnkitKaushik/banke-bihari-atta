import type { Product, Settings } from "./types";

// Free-to-use photos from Unsplash (unsplash.com/license), cropped square by their CDN.
const u = (id: string) => `https://images.unsplash.com/photo-${id}?w=900&h=900&fit=crop&q=75&auto=format`;

type SeedRow = [id: string, name: string, nameHi: string, category: Product["category"], color: string, badge: string, description: string, sizes: string, photos: string];

const rows: SeedRow[] = [
  ["chakki-atta", "Chakki Fresh Atta", "चक्की आटा", "atta", "#e2b25a", "Bestseller", "Sharbati wheat stone-ground slow on our chakki, so the bran and the taste stay in. Soft, fluffy rotis every single time.", "1 kg, 5 kg, 10 kg, 25 kg", "1610725664285-7c57e6eeac3f 1714842981153-ffeaf74e7a1a 1763951719000-661d3d50d763 1574323347407-f5e1ad6d020b"],
  ["sharbati-gehun", "Sharbati Gehun", "शरबती गेहूं", "atta", "#d9a441", "Premium", "Golden MP Sharbati wheat, cleaned and sorted. Buy the grain and get it milled fresh in front of you.", "10 kg, 25 kg, 50 kg", "1574323347407-f5e1ad6d020b 1561978248-bffcdd0457ad 1529511582893-2d7e684dd128"],
  ["multigrain-atta", "Multigrain Atta", "मल्टीग्रेन आटा", "atta", "#c98f3c", "Healthy", "Wheat blended with jowar, bajra, ragi, chana and jau. Fibre-rich rotis for the whole family.", "1 kg, 5 kg", "1788240371020-c5ceadce05d6 1786994060314-eccbdd13066d 1780907084874-14d202d39bf1"],
  ["bajra-atta", "Bajra Atta", "बाजरा आटा", "atta", "#8f8a6a", "Winter Special", "Freshly milled pearl millet for warm bajre ki roti, tikki and khichdi.", "1 kg, 2 kg, 5 kg", "1724418020207-144b3ba54d2d 1639086407827-0dadcd5718c9"],
  ["makka-atta", "Makka Atta", "मक्का आटा", "atta", "#f2c230", "Seasonal", "Golden maize flour, the only partner for sarson ka saag.", "1 kg, 2 kg", "1559631526-5716df3cfacd 1550828484-45019f8bf11c"],
  ["jowar-atta", "Jowar Atta", "ज्वार आटा", "atta", "#e9dcc0", "Gluten Free", "Light, gluten-free sorghum flour for bhakri and soft rotis.", "1 kg, 2 kg", "1792130910504-a5226d9a98ab 1758356860542-a2df92aad294"],
  ["ragi-atta", "Ragi Atta", "रागी आटा", "atta", "#8a4b3a", "Calcium Rich", "Finger millet flour for porridge, dosa, laddoo and rotis.", "500 g, 1 kg", "1653580524515-77b19c176b88 1620827792322-5960fe216618"],
  ["rajgira-atta", "Rajgira Atta", "राजगिरा आटा", "atta", "#d8b98a", "Vrat Special", "Amaranth flour for vrat ki puri, thepla and halwa.", "500 g, 1 kg", "1768729339998-909158957162"],
  ["toor-dal", "Toor Dal", "अरहर दाल", "dal", "#f0a830", "Bestseller", "Cleaned, sorted and unpolished arhar dal that cooks soft and tastes like home.", "500 g, 1 kg, 5 kg", "1701166175567-2f55dd40e662 1788603092417-a01e665e0ab2"],
  ["moong-dal", "Moong Dal Dhuli", "मूंग दाल", "dal", "#e8cf48", "", "Washed yellow moong, light on the stomach and quick to cook.", "500 g, 1 kg", "1702041357314-db5826c96f04 1594900799266-0e56587ba586"],
  ["sabut-moong", "Sabut Moong", "साबुत मूंग", "dal", "#5f8a3a", "Protein Rich", "Whole green moong for dal, sprouts and cheela.", "500 g, 1 kg", "1788629531508-c0d971473c37 1788629531025-51f8fec9def1 1758701925687-1449ab265c2e"],
  ["chana-dal", "Chana Dal", "चना दाल", "dal", "#e3a83a", "", "Bold, even-sized chana dal for tadka, halwa and puran poli.", "500 g, 1 kg, 5 kg", "1780478238047-13e4e6c07cba 1612869538502-b5baa439abd7"],
  ["masoor-dal", "Masoor Dal", "मसूर दाल", "dal", "#e0703a", "", "Red lentils that cook in minutes and turn creamy.", "500 g, 1 kg", "1770617476260-1addeea7c826 1764573464925-da17a9f796d4 1730591857303-0fa44be3f677"],
  ["urad-sabut", "Urad Sabut", "साबुत उड़द", "dal", "#3a3330", "", "Whole black urad for slow-cooked dal makhani.", "500 g, 1 kg", "1601723897386-e5df0c749fb7 1790438716406-0bf98fdab808"],
  ["rajma", "Rajma Chitra", "राजमा", "dal", "#9b3b2f", "Sunday Special", "Speckled Jammu rajma that cooks soft and soaks up the masala.", "500 g, 1 kg", "1564894809611-1742fc40ed80 1579705745811-a32bef7856a3"],
  ["kabuli-chana", "Kabuli Chana", "काबुली चना", "dal", "#e6c58a", "", "Big, creamy chickpeas for chole bhature.", "500 g, 1 kg", "1788629071741-b69c10388162 1767875816994-88dd9d05ce2f 1644432757699-bb5a01e8fb0e"],
  ["kala-chana", "Kala Chana", "काला चना", "dal", "#6b4a2e", "", "Desi black chickpeas for sukhe chane, sprouts and kadhi.", "500 g, 1 kg", "1788629906609-5f66704a72ef 1788629071924-37c53b52eeb7"],
  ["besan", "Pure Besan", "शुद्ध बेसन", "besan", "#f3cf6b", "Pure", "100% chana dal besan, ground fine for pakode, kadhi and laddoo.", "500 g, 1 kg, 5 kg", "1749169439872-7cee08d9a71b 1788629071713-af75529fa496 1714842981153-ffeaf74e7a1a"],
  ["sattu", "Chana Sattu", "चना सत्तू", "besan", "#c9a46a", "Summer Cooler", "Roasted gram flour for sattu sharbat and litti.", "500 g, 1 kg", "1641301553499-9a0ff924fcb5 1606854428857-5121b55a2661"],
  ["chawal-atta", "Chawal Atta", "चावल का आटा", "besan", "#f1ead8", "", "Fine rice flour for dosa, chilla and crispy pakode.", "500 g, 1 kg", "1586137712370-9b450509c587 1704972269889-f0fdd7f0e7c3"],
  ["haldi", "Haldi Powder", "हल्दी", "masale", "#f2b705", "Fresh Ground", "Whole turmeric ground in-house. Real colour, real aroma.", "100 g, 200 g, 500 g", "1615485500834-bc10199bc727 1768729340925-2749ecdc211c 1768729340164-7d83fe18384d"],
  ["lal-mirch", "Lal Mirch Powder", "लाल मिर्च", "masale", "#c62a1a", "", "Bright red chilli powder with balanced heat.", "100 g, 200 g, 500 g", "1547332226-395d746d139a 1577563717655-919fc57789b4 1791989167508-44ecc214d110"],
  ["dhaniya", "Dhaniya Powder", "धनिया", "masale", "#9b8a4a", "", "Coriander seeds roasted lightly and ground fresh.", "100 g, 200 g, 500 g", "1608797179072-4268dd68eff2 1528613526328-8c19bd037322"],
  ["jeera", "Jeera Sabut", "जीरा", "masale", "#8a7350", "", "Bold, aromatic cumin, cleaned twice.", "100 g, 250 g", "1701189975806-97b11541ec82 1701189975842-591ebd1e26a2 1645331465778-eb409d112198"],
  ["garam-masala", "Garam Masala", "गरम मसाला", "masale", "#7a4a2a", "House Blend", "Our family blend of 13 whole spices, roasted and ground in small batches.", "50 g, 100 g, 200 g", "1581600140682-d4e68c8cde32 1596040033229-a9821ebd058d 1716816211590-c15a328a5ff0"],
  ["dalia", "Gehun Dalia", "गेहूं दलिया", "other", "#d8b98a", "", "Broken wheat for khichdi, upma and sweet dalia.", "500 g, 1 kg", "1776669236271-5cfe72d74755 1574323347407-f5e1ad6d020b"],
  ["sooji", "Sooji / Rava", "सूजी", "other", "#f1e2b8", "", "Fine semolina for halwa, upma and rava idli.", "500 g, 1 kg", "1638405803231-40312cd276b6 1595801106239-faefa2cdcf75"],
  ["poha", "Poha", "पोहा", "other", "#f5e7b5", "", "Medium-thick poha that stays soft, never mushy.", "500 g, 1 kg", "1789991184412-c29c9dfa2b39"],
  ["basmati", "Basmati Chawal", "बासमती चावल", "other", "#f7f2e4", "", "Long-grain aged basmati that cooks fluffy and fragrant.", "1 kg, 5 kg", "1704916029292-ec7b5976204c 1711060266983-92bd378c850c"],
  ["sarson-tel", "Kachi Ghani Sarson Tel", "सरसों तेल", "other", "#d9a400", "Cold Pressed", "Pungent kachi ghani mustard oil, pressed from yellow sarson.", "1 L, 5 L", "1474979266404-7eaacbcd87c5 1575727114832-87658853f993 1610012063609-bb63f427f11c"],
];

export const SEED_PRODUCTS: Product[] = rows.map(([id, name, nameHi, category, color, badge, description, sizes, photos], order) => ({
  id,
  name,
  nameHi,
  category,
  color,
  badge,
  description,
  sizes: sizes.split(", "),
  photos: photos.split(" ").map(u),
  featured: badge === "Bestseller" || badge === "House Blend",
  visible: true,
  order,
}));

export const SEED_SETTINGS: Settings = {
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  address: "Main Bazaar, Vrindavan, Uttar Pradesh",
  hours: "Mon–Sun · 7:00 AM – 9:00 PM",
  mapQuery: "Shri Banke Bihari Mandir, Vrindavan, Uttar Pradesh",
  since: "1998",
  families: "5000",
};
