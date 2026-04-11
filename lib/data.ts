export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    originalPrice?: number;
    material: string;
    tag?: string;
    description: string;
    image: string;
}

export const PRODUCTS: Product[] = [
    // ═══════════════════════════════════════════
    //  RINGS (25 Pieces)
    // ═══════════════════════════════════════════
    {
        id: "ring_1",
        name: "Ethereal Solitaire",
        category: "Rings",
        price: 850,
        originalPrice: 1200,
        material: "18k Gold & Diamond",
        tag: "Sale",
        description: "A timeless masterpiece featuring a brilliant-cut solitary diamond that captures and refracts light beautifully.",
        image: "/images/rings/ring_01.jpg"
    },
    {
        id: "ring_2",
        name: "Celestial Rose Band",
        category: "Rings",
        price: 640,
        material: "Rose Gold & Morganite",
        tag: "Trending",
        description: "Elegant rose band with a central morganite stone, reflecting celestial light with unmatched warmth.",
        image: "/images/rings/ring_02.jpg"
    },
    {
        id: "ring_3",
        name: "Onyx Sovereign",
        category: "Rings",
        price: 1100,
        material: "Black Gold & Onyx",
        tag: "Exclusive",
        description: "A powerful statement piece with a polished black onyx centerpiece set in dark metal for an unmistakable presence.",
        image: "/images/rings/ring_03.png"
    },
    {
        id: "ring_4",
        name: "Aurora Diamond Halo",
        category: "Rings",
        price: 1950,
        material: "Platinum & Diamonds",
        tag: "Premium",
        description: "A mesmerizing halo design with a central diamond surrounded by a constellation of micro-pavé diamonds.",
        image: "/images/rings/ring_04.jpg"
    },
    {
        id: "ring_5",
        name: "Velvet Signet",
        category: "Rings",
        price: 490,
        material: "14k Gold",
        tag: "Essential",
        description: "A smooth, polished signet with a flat top — understated luxury for everyday refinement.",
        image: "/images/rings/ring_05.jpg"
    },
    {
        id: "ring_6",
        name: "Moonlit Sapphire Crown",
        category: "Rings",
        price: 2400,
        material: "White Gold & Sapphire",
        tag: "Masterpiece",
        description: "A regal crown-setting featuring a deep blue sapphire flanked by tapered baguette diamonds.",
        image: "/images/rings/ring_06.png"
    },
    {
        id: "ring_7",
        name: "Infinity Twist Band",
        category: "Rings",
        price: 680,
        material: "Sterling Silver & CZ",
        tag: "New",
        description: "A delicate infinity twist band studded with cubic zirconia — symbolizing eternal connection.",
        image: "/images/rings/ring_07.png"
    },
    {
        id: "ring_8",
        name: "Heritage Double Band",
        category: "Rings",
        price: 820,
        material: "18k Gold",
        tag: "Handcrafted",
        description: "Two interlocking bands, hand-polished to perfection for a modern take on a classic silhouette.",
        image: "/images/rings/ring_08.png"
    },
    {
        id: "ring_9",
        name: "Eclipse Tension",
        category: "Rings",
        price: 1450,
        material: "Titanium & Diamond",
        tag: "Avant-Garde",
        description: "A floating diamond held by invisible tension in a sleek titanium band — engineering meets artistry.",
        image: "/images/rings/ring_09.jpg"
    },
    {
        id: "ring_10",
        name: "Amber Cocktail",
        category: "Rings",
        price: 580,
        material: "Gold & Baltic Amber",
        tag: "Bohemian",
        description: "A bold cocktail piece featuring a warm Baltic amber cabochon in a gold bezel setting.",
        image: "/images/rings/ring_10.png"
    },
    {
        id: "ring_11",
        name: "Stardust Stackable Trio",
        category: "Rings",
        price: 980,
        material: "Mixed Gold",
        tag: "Trending",
        description: "Three delicate stacking bands in yellow, white, and rose tones — each embedded with micro-diamond dust.",
        image: "/images/rings/ring_11.png"
    },
    {
        id: "ring_12",
        name: "Victorian Garnet Cluster",
        category: "Rings",
        price: 1250,
        material: "Antique Gold & Garnet",
        tag: "Vintage",
        description: "A Victorian-inspired cluster featuring deep red garnets set in intricately detailed antique metal.",
        image: "/images/rings/ring_12.png"
    },
    {
        id: "ring_13",
        name: "Emerald Sovereign",
        category: "Rings",
        price: 1800,
        material: "Gold & Colombian Emerald",
        tag: "Exclusive",
        description: "A magnificent emerald-cut Colombian emerald in a thick band — fit for royalty.",
        image: "/images/rings/ring_13.png"
    },
    {
        id: "ring_14",
        name: "Pearl Embrace",
        category: "Rings",
        price: 450,
        material: "Silver & Freshwater Pearl",
        tag: "Elegant",
        description: "A lustrous freshwater pearl cradled in a minimalist silver setting — pure, refined elegance.",
        image: "/images/rings/ring_14.png"
    },
    {
        id: "ring_15",
        name: "Noir Whisper Band",
        category: "Rings",
        price: 380,
        material: "Matte Black Titanium",
        tag: "Minimalist",
        description: "Ultra-thin matte black titanium band — the quiet luxury of the Noir Éclat philosophy.",
        image: "/images/rings/ring_01.jpg"
    },
    // New Rings
    { id: "ring_16", name: "Solitaire Pave", category: "Rings", price: 1200, material: "18k Gold", tag: "New", description: "Refined solitaire with a brilliant pave band.", image: "/images/rings/ring_02.jpg" },
    { id: "ring_17", name: "Sapphire Halo", category: "Rings", price: 1450, material: "White Gold", tag: "Limited", description: "Royal blue sapphire surrounded by a diamond halo.", image: "/images/rings/ring_03.png" },
    { id: "ring_18", name: "Modern Twist", category: "Rings", price: 650, material: "Rose Gold", tag: "Modern", description: "Sculptural twist band with a soft satin finish.", image: "/images/rings/ring_04.jpg" },
    { id: "ring_19", name: "Emerald Cut Luxe", category: "Rings", price: 2100, material: "Platinum", tag: "Premium", description: "Stunning emerald-cut diamond in a minimalist setting.", image: "/images/rings/ring_05.jpg" },
    { id: "ring_20", name: "Vintage Engraved", category: "Rings", price: 890, material: "Antique Gold", tag: "Vintage", description: "Intricate floral engravings on a heavy gold band.", image: "/images/rings/ring_06.png" },
    { id: "ring_21", name: "Midnight Band", category: "Rings", price: 420, material: "Black Zirconium", tag: "Minimalist", description: "Sleek and stealthy black band for the modern age.", image: "/images/rings/ring_07.png" },
    { id: "ring_22", name: "Imperial Ruby", category: "Rings", price: 1750, material: "18k Gold & Ruby", tag: "Exclusive", description: "Vibrant Burmese ruby set in high-polish gold.", image: "/images/rings/ring_08.png" },
    { id: "ring_23", name: "Aura Cluster", category: "Rings", price: 920, material: "Yellow Gold", tag: "Artisan", description: "A cluster of brilliant diamonds that glow like an aura.", image: "/images/rings/ring_09.jpg" },
    { id: "ring_24", name: "Oceanic Pearl", category: "Rings", price: 540, material: "Silver & Pearl", tag: "Elegant", description: "Deep sea pearl cradled in a wave-inspired silver band.", image: "/images/rings/ring_10.png" },
    { id: "ring_25", name: "Sovereign Signet", category: "Rings", price: 780, material: "18k Gold", tag: "Classical", description: "Heavy signet ring inspired by royal heritage.", image: "/images/rings/ring_11.png" },


    // ═══════════════════════════════════════════
    //  EARRINGS (25 Pieces)
    // ═══════════════════════════════════════════
    {
        id: "ear_1",
        name: "Aura Hoops",
        category: "Earrings",
        price: 320,
        material: "14k Gold",
        tag: "Essential",
        description: "Classic hoops with a modern, high-polish finish that catches the light from every angle.",
        image: "/images/earrings/earring_01.png"
    },
    {
        id: "ear_2",
        name: "Starlight Drops",
        category: "Earrings",
        price: 720,
        material: "White Gold & Diamonds",
        tag: "New",
        description: "Shimmering diamond drops that capture the essence of a starlit night.",
        image: "/images/earrings/earring_02.png"
    },
    {
        id: "ear_3",
        name: "Emerald Vine Studs",
        category: "Earrings",
        price: 850,
        material: "Gold & Emerald",
        tag: "Handcrafted",
        description: "Delicate gold-pressed emerald studs inspired by organic vine patterns.",
        image: "/images/earrings/earring_03.png"
    },
    { id: "ear_4", name: "Pearl Cascade", category: "Earrings", price: 540, material: "Silver & Pearl", tag: "Elegant", description: "Graduated pearls cascading with grace.", image: "/images/earrings/earring_04.jpg" },
    { id: "ear_5", name: "Chandelier Royale", category: "Earrings", price: 1650, material: "18k Gold", tag: "Premium", description: "Exquisite tiered diamond drops for special occasions.", image: "/images/earrings/earring_05.png" },
    { id: "ear_6", name: "Eclipse Studs", category: "Earrings", price: 280, material: "Rose Gold", tag: "Modern", description: "Geometric studs with a brushed finish.", image: "/images/earrings/earring_06.png" },
    { id: "ear_7", name: "Midnight Threads", category: "Earrings", price: 420, material: "Black Gold", tag: "Edgy", description: "Long threader earrings with a noir touch.", image: "/images/earrings/earring_07.png" },
    { id: "ear_8", name: "Crystal Prism", category: "Earrings", price: 340, material: "Silver", tag: "Classic", description: "Precision-cut crystals that refract the rainbow.", image: "/images/earrings/earring_08.png" },
    { id: "ear_9", name: "Orbital Silver", category: "Earrings", price: 250, material: "Sterling Silver", tag: "Essential", description: "Contemporary double-orbit silver hoops.", image: "/images/earrings/earring_09.png" },
    { id: "ear_10", name: "Sapphire Dangles", category: "Earrings", price: 1250, material: "White Gold", tag: "Premium", description: "Pear-shaped sapphires in deep ocean hues.", image: "/images/earrings/earring_10.png" },
    { id: "ear_11", name: "Minimalist Bars", category: "Earrings", price: 190, material: "14k Gold", tag: "Minimalist", description: "Ultra-thin gold bars for subtle luxury.", image: "/images/earrings/earring_11.png" },
    { id: "ear_12", name: "Baroque Pearl Drops", category: "Earrings", price: 640, material: "Gold & Pearl", tag: "Artisan", description: "Unique organic pearls shaped by nature.", image: "/images/earrings/earring_12.png" },
    { id: "ear_13", name: "Filigree Climbers", category: "Earrings", price: 580, material: "Rose Gold", tag: "Romantic", description: "Delicate floral designs that climb the earlobe.", image: "/images/earrings/earring_13.png" },
    { id: "ear_14", name: "Silk Tassels", category: "Earrings", price: 320, material: "Gold & Silk", tag: "Bohemian", description: "Hand-wound silk on elegant gold caps.", image: "/images/earrings/earring_14.png" },
    { id: "ear_15", name: "Noir Clip Cuffs", category: "Earrings", price: 240, material: "Black Titanium", tag: "Trending", description: "Bold no-pierce cuffs in matte black.", image: "/images/earrings/earring_15.png" },
    // New Earrings (Fixed Paths)
    { id: "ear_16", name: "Diamond Studs", category: "Earrings", price: 450, material: "18k Gold", tag: "Classic", description: "Perfectly matched brilliant diamonds.", image: "/images/earrings/earring_16.png" },
    { id: "ear_17", name: "Chain Loops", category: "Earrings", price: 380, material: "14k Gold", tag: "Modern", description: "Woven chain hoops with a heavy feel.", image: "/images/earrings/earring_17.png" },
    { id: "ear_18", name: "Onyx Drops", category: "Earrings", price: 520, material: "Black Gold", tag: "Noir", description: "Polished onyx teardrops.", image: "/images/earrings/earring_07.png" },
    { id: "ear_19", name: "Ruby Studs", category: "Earrings", price: 680, material: "Yellow Gold", tag: "Exclusive", description: "Natural rubies in a crown setting.", image: "/images/earrings/earring_10.png" },
    { id: "ear_20", name: "Architectural Hoops", category: "Earrings", price: 540, material: "Silver", tag: "Modern", description: "Squircle hoops for a bold statement.", image: "/images/earrings/earring_09.png" },
    { id: "ear_21", name: "Star Studs", category: "Earrings", price: 210, material: "Gold", tag: "New", description: "Tiny sparkling stars for your ears.", image: "/images/earrings/earring_11.png" },
    { id: "ear_22", name: "Luxe Threaders", category: "Earrings", price: 390, material: "White Gold", tag: "Minimalist", description: "Ultra-fine diamond-cut threads.", image: "/images/earrings/earring_15.png" },
    { id: "ear_23", name: "Floral Studs", category: "Earrings", price: 460, material: "Rose Gold", tag: "Romantic", description: "Miniature roses with diamond centers.", image: "/images/earrings/earring_13.png" },
    { id: "ear_24", name: "Imperial Hoops", category: "Earrings", price: 820, material: "22k Gold", tag: "High Luxury", description: "Hand-hammered heavy gold hoops.", image: "/images/earrings/earring_01.png" },
    { id: "ear_25", name: "Aura Drops", category: "Earrings", price: 740, material: "Gold", tag: "Masterpiece", description: "Floating diamonds in a golden halo.", image: "/images/earrings/earring_02.png" },


    // ═══════════════════════════════════════════
    //  NECKLACES (25 Pieces)
    // ═══════════════════════════════════════════
    { id: "neck_1", name: "Imperial Chain", category: "Necklaces", price: 1800, material: "24k Gold", tag: "Premium", description: "Heavy solid gold chain.", image: "/images/necklaces/necklace_01.png" },
    { id: "neck_2", name: "Pearl Pendant", category: "Necklaces", price: 950, material: "Silver & Pearl", tag: "Elegant", description: "Radiant South Sea pearl.", image: "/images/necklaces/necklace_02.jpg" },
    { id: "neck_3", name: "Sapphire Locket", category: "Necklaces", price: 1350, material: "White Gold", tag: "Romantic", description: "Blue sapphire locket.", image: "/images/necklaces/necklace_03.jpg" },
    { id: "neck_4", name: "Pure Cascade", category: "Necklaces", price: 1200, material: "18k Gold", tag: "Trending", description: "Cascading gold layers.", image: "/images/necklaces/necklace_04.jpg" },
    { id: "neck_5", name: "Diamond Drop", category: "Necklaces", price: 2400, material: "Platinum", tag: "Masterpiece", description: "Brilliant solitary diamond.", image: "/images/necklaces/necklace_05.png" },
    { id: "neck_6", name: "Velvet Choker", category: "Necklaces", price: 380, material: "Gold & Velvet", tag: "Edgy", description: "Glamorous noir choker.", image: "/images/necklaces/necklace_06.png" },
    { id: "neck_7", name: "Cameo Pendant", category: "Necklaces", price: 890, material: "Antique Gold", tag: "Vintage", description: "Hand-carved heirloom.", image: "/images/necklaces/necklace_07.png" },
    { id: "neck_8", name: "Collar of Radiance", category: "Necklaces", price: 3200, material: "18k Gold", tag: "Gala", description: "Diamond-encrusted collar.", image: "/images/necklaces/necklace_08.png" },
    { id: "neck_9", name: "Arisan Twist", category: "Necklaces", price: 1450, material: "22k Gold", tag: "Handcrafted", description: "Twisted gold wire sculpture.", image: "/images/necklaces/necklace_09.png" },
    { id: "neck_10", name: "Moonstone Drop", category: "Necklaces", price: 620, material: "Silver", tag: "Bohemian", description: "Ethereal moonstone lariat.", image: "/images/necklaces/necklace_10.png" },
    { id: "neck_11", name: "Pearl Strand", category: "Necklaces", price: 1950, material: "Tahitian Pearls", tag: "Classic", description: "Long strand of black pearls.", image: "/images/necklaces/necklace_11.png" },
    { id: "neck_12", name: "Ruby Cathedral", category: "Necklaces", price: 2800, material: "Gold", tag: "Exclusive", description: "Ruby centerpiece on heavy gold.", image: "/images/necklaces/necklace_12.png" },
    { id: "neck_13", name: "Diamond Station", category: "Necklaces", price: 1550, material: "White Gold", tag: "New", description: "Evenly spaced diamonds.", image: "/images/necklaces/necklace_05.png" },
    { id: "neck_14", name: "Sleek Lariat", category: "Necklaces", price: 780, material: "14k Gold", tag: "Modern", description: "Minimalist Y-chain design.", image: "/images/necklaces/necklace_01.png" },
    { id: "neck_15", name: "Venetian Bead", category: "Necklaces", price: 540, material: "Gold & Glass", tag: "Artisan", description: "Hand-blown Murano glass.", image: "/images/necklaces/necklace_02.jpg" },
    // New Necklaces
    { id: "neck_16", name: "Aura Choker", category: "Necklaces", price: 850, material: "Gold", tag: "New", description: "Modern choker with a soft glow.", image: "/images/necklaces/necklace_04.jpg" },
    { id: "neck_17", name: "Luxe Link", category: "Necklaces", price: 1100, material: "18k Gold", tag: "Solid", description: "Bold links for powerful looks.", image: "/images/necklaces/necklace_01.png" },
    { id: "neck_18", name: "Emerald Drop", category: "Necklaces", price: 1650, material: "Yellow Gold", tag: "Exclusive", description: "Deep emerald pendant.", image: "/images/necklaces/necklace_12.png" },
    { id: "neck_19", name: "Star Dust", category: "Necklaces", price: 420, material: "Rose Gold", tag: "Delicate", description: "Diamond-dusted fine chain.", image: "/images/necklaces/necklace_10.png" },
    { id: "neck_20", name: "Pearl Orbit", category: "Necklaces", price: 720, material: "Silver", tag: "Modern", description: "Floating pearl in a silver circle.", image: "/images/necklaces/necklace_02.jpg" },
    { id: "neck_21", name: "Imperial V", category: "Necklaces", price: 1400, material: "24k Gold", tag: "Regal", description: "V-shaped heavy gold statement.", image: "/images/necklaces/necklace_01.png" },
    { id: "neck_22", name: "Midnight Chain", category: "Necklaces", price: 580, material: "Black Zirconium", tag: "Noir", description: "Dark sleek chain for daily wear.", image: "/images/necklaces/necklace_06.png" },
    { id: "neck_23", name: "Floral Locket", category: "Necklaces", price: 690, material: "Gold", tag: "Vintage", description: "Engraved locket with room for memory.", image: "/images/necklaces/necklace_03.jpg" },
    { id: "neck_24", name: "Celestial Star", category: "Necklaces", price: 480, material: "White Gold", tag: "Dainty", description: "Tiny star pendant with diamond.", image: "/images/necklaces/necklace_08.png" },
    { id: "neck_25", name: "Sovereign Pendant", category: "Necklaces", price: 1250, material: "18k Gold", tag: "Heraldic", description: "Crested pendant in solid gold.", image: "/images/necklaces/necklace_09.png" },


    // ═══════════════════════════════════════════
    //  BRACELETS (25 Pieces)
    // ═══════════════════════════════════════════
    { id: "brac_1", name: "Link Archive", category: "Bracelets", price: 1200, material: "18k Gold", tag: "Signature", description: "Interlocking gold links.", image: "/images/bracelets/bracelet_01.png" },
    { id: "brac_2", name: "Constellation Cuff", category: "Bracelets", price: 2400, material: "Platinum", tag: "Masterpiece", description: "Galaxy of paved diamonds.", image: "/images/bracelets/bracelet_02.png" },
    { id: "brac_3", name: "Hinged Bangle", category: "Bracelets", price: 680, material: "Rose Gold", tag: "Elegant", description: "Precision design bangle.", image: "/images/bracelets/bracelet_03.png" },
    { id: "brac_4", name: "Garden Charm", category: "Bracelets", price: 540, material: "Silver", tag: "Playful", description: "Botanical gold charms.", image: "/images/bracelets/bracelet_04.png" },
    { id: "brac_5", name: "Tennis Line", category: "Bracelets", price: 3200, material: "White Gold", tag: "Premium", description: "Round-cut diamond line.", image: "/images/bracelets/bracelet_05.png" },
    { id: "brac_6", name: "Stacking Bangles", category: "Bracelets", price: 850, material: "Mixed Gold", tag: "Trending", description: "Ultra-thin mixed gold stack.", image: "/images/bracelets/bracelet_06.png" },
    { id: "brac_7", name: "Wave Cuff", category: "Bracelets", price: 1100, material: "18k Gold", tag: "Artisan", description: "Sculpted organic gold cuff.", image: "/images/bracelets/bracelet_07.png" },
    { id: "brac_8", name: "Chain Mail Wrap", category: "Bracelets", price: 1350, material: "Gold & Silver", tag: "Avant-Garde", description: "Woven mixed metal wrap.", image: "/images/bracelets/bracelet_08.png" },
    { id: "brac_9", name: "Serpent Bangle", category: "Bracelets", price: 950, material: "Gold", tag: "Exclusive", description: "Ruby-set serpent bangle.", image: "/images/bracelets/bracelet_09.png" },
    { id: "brac_10", name: "Hammered Cuff", category: "Bracelets", price: 480, material: "14k Gold", tag: "Handcrafted", description: "Wide hand-textured gold.", image: "/images/bracelets/bracelet_10.png" },
    { id: "brac_11", name: "Pearl Station", category: "Bracelets", price: 420, material: "Gold", tag: "Classic", description: "Delicate freshwater pearls.", image: "/images/bracelets/bracelet_11.png" },
    { id: "brac_12", name: "Turquoise Cuff", category: "Bracelets", price: 340, material: "Silver", tag: "Bohemian", description: "Natural turquoise on silver.", image: "/images/bracelets/bracelet_12.png" },
    { id: "brac_13", name: "Noir Slider", category: "Bracelets", price: 380, material: "Black Titanium", tag: "Minimalist", description: "Adjustable matte black bangle.", image: "/images/bracelets/bracelet_13.png" },
    { id: "brac_14", name: "Bar Bracelet", category: "Bracelets", price: 1300, material: "White Gold", tag: "Modern", description: "Geometric horizontal diamond bar.", image: "/images/bracelets/bracelet_14.png" },
    { id: "brac_15", name: "Coil Spring", category: "Bracelets", price: 280, material: "Gold Plated", tag: "Essential", description: "Flexible gold-tone coil.", image: "/images/bracelets/bracelet_01.png" },
    // New Bracelets
    { id: "brac_16", name: "Aura Bangle", category: "Bracelets", price: 750, material: "14k Gold", tag: "New", description: "Seamless gold bangle with a soft glow.", image: "/images/bracelets/bracelet_02.png" },
    { id: "brac_17", name: "Luxe Rope", category: "Bracelets", price: 520, material: "Silver", tag: "New", description: "Bold rope chain for daily wear.", image: "/images/bracelets/bracelet_03.png" },
    { id: "brac_18", name: "Emerald Cuff", category: "Bracelets", price: 1850, material: "18k Gold", tag: "Exclusive", description: "Heavy cuff set with single emerald.", image: "/images/bracelets/bracelet_04.png" },
    { id: "brac_19", name: "Midnight Cuff", category: "Bracelets", price: 420, material: "Titanium", tag: "Noir", description: "Matte black architectual cuff.", image: "/images/bracelets/bracelet_05.png" },
    { id: "brac_20", name: "Starlight Chain", category: "Bracelets", price: 1100, material: "White Gold", tag: "Premium", description: "Diamond-dusted fine chain.", image: "/images/bracelets/bracelet_06.png" },
    { id: "brac_21", name: "Imperial Link", category: "Bracelets", price: 1600, material: "22k Gold", tag: "Regal", description: "Solid link bracelet in pure gold.", image: "/images/bracelets/bracelet_07.png" },
    { id: "brac_22", name: "Pearl Wrap", category: "Bracelets", price: 580, material: "Silver", tag: "Romantic", description: "Multi-wrap bracelet with seed pearls.", image: "/images/bracelets/bracelet_08.png" },
    { id: "brac_23", name: "Geometric Band", category: "Bracelets", price: 480, material: "Gold", tag: "Modern", description: "Brushed gold band with angular cuts.", image: "/images/bracelets/bracelet_09.png" },
    { id: "brac_24", name: "Ruby Charm", category: "Bracelets", price: 920, material: "Rose Gold", tag: "Exclusive", description: "Fine chain with ruby heart charm.", image: "/images/bracelets/bracelet_10.png" },
    { id: "brac_25", name: "Sovereign Cuff", category: "Bracelets", price: 2100, material: "Platinum", tag: "Masterpiece", description: "Engraved platinum high-luxury cuff.", image: "/images/bracelets/bracelet_11.png" },


    // ═══════════════════════════════════════════
    //  COMPLETE SETS (25 Pieces)
    // ═══════════════════════════════════════════
    { id: "set_1", name: "Royal Suite", category: "Sets", price: 4200, material: "22k Gold", tag: "Limited", description: "Full gold gala ensemble.", image: "/images/cart/set_01.png" },
    { id: "set_2", name: "Eternal Bride", category: "Sets", price: 5400, material: "White Gold", tag: "Bridal", description: "Premium diamond bridal set.", image: "/images/cart/set_02.png" },
    { id: "set_3", name: "Soirée Ensemble", category: "Sets", price: 2800, material: "Black Gold", tag: "Evening", description: "Dark onyx evening glamour.", image: "/images/cart/set_03.png" },
    { id: "set_4", name: "Pearl Harmony", category: "Sets", price: 2100, material: "Gold & Pearl", tag: "Classic", description: "Akoya pearl trio.", image: "/images/cart/set_04.png" },
    { id: "set_5", name: "Dynasty Ensemble", category: "Sets", price: 6500, material: "Gold & Emerald", tag: "Exclusive", description: "Emerald set for modern royalty.", image: "/images/cart/set_05.jpg" },
    { id: "set_6", name: "Gala Archive", category: "Sets", price: 3200, material: "24k Gold", tag: "Gala", description: "Engineered for the spotlight.", image: "/images/cart/set_06.png" },
    { id: "set_7", name: "Moonlight Suite", category: "Sets", price: 1350, material: "Silver", tag: "Essential", description: "Moonlit silver minimalism.", image: "/images/cart/set_07.png" },
    { id: "set_8", name: "Rose Collection", category: "Sets", price: 2600, material: "Rose Gold", tag: "Vintage", description: "Morganite and gold romance.", image: "/images/cart/set_08.png" },
    { id: "set_9", name: "Blush Suite", category: "Sets", price: 1950, material: "Rose Gold", tag: "Romantic", description: "Pink sapphire and gold trio.", image: "/images/cart/set_09.png" },
    { id: "set_10", name: "Eternity Archive", category: "Sets", price: 9200, material: "Platinum", tag: "Masterpiece", description: "The pinnacle of jewelry art.", image: "/images/cart/set_10.png" },
    { id: "set_11", name: "Artrio Suite", category: "Sets", price: 1100, material: "14k Gold", tag: "Minimalist", description: "Refined daily gold simplicity.", image: "/images/cart/set_11.png" },
    { id: "set_12", name: "Twilight Suite", category: "Sets", price: 5200, material: "White Gold", tag: "Premium", description: "Deep blue twilight sapphires.", image: "/images/cart/set_12.png" },
    { id: "set_13", name: "Spirit Collection", category: "Sets", price: 920, material: "Silver", tag: "Bohemian", description: "Natural stone bohemian luxury.", image: "/images/cart/set_13.png" },
    { id: "set_14", name: "Power Statement", category: "Sets", price: 3600, material: "18k Gold", tag: "Trending", description: "Bold geometric power set.", image: "/images/cart/set_14.png" },
    { id: "set_15", name: "Noir Collection", category: "Sets", price: 7200, material: "Black Diamond", tag: "Limited", description: "Definitive black diamond suite.", image: "/images/cart/set_15.png" },
    // New Sets
    { id: "set_16", name: "Aura Set", category: "Sets", price: 2400, material: "Gold", tag: "New", description: "Radiant golden glow ensemble.", image: "/images/cart/set_01.png" },
    { id: "set_17", name: "Luxe Minimalist", category: "Sets", price: 1100, material: "Silver", tag: "New", description: "Modern sleek silver trio.", image: "/images/cart/set_07.png" },
    { id: "set_18", name: "Imperial Ruby Set", category: "Sets", price: 4800, material: "18k Gold", tag: "Exclusive", description: "Ruby and gold royal suite.", image: "/images/cart/set_06.png" },
    { id: "set_19", name: "Celestial Star Set", category: "Sets", price: 2100, material: "White Gold", tag: "Dainty", description: "Diamond star necklace and studs.", image: "/images/cart/set_10.png" },
    { id: "set_20", name: "Modern Noir Set", category: "Sets", price: 3900, material: "Black Gold", tag: "Avant-Garde", description: "Geometric black gold and onyx.", image: "/images/cart/set_15.png" },
    { id: "set_21", name: "Regal Pearl Set", category: "Sets", price: 5800, material: "Platinum", tag: "High Luxury", description: "Tahitian pearl and diamond ensemble.", image: "/images/cart/set_04.png" },
    { id: "set_22", name: "Floral Romance Set", category: "Sets", price: 3400, material: "Rose Gold", tag: "Romantic", description: "Intricate floral gold set with rubies.", image: "/images/cart/set_08.png" },
    { id: "set_23", name: "Midnight Stealth Set", category: "Sets", price: 1800, material: "Titanium", tag: "Modern", description: "All-black tech-jewelry suite.", image: "/images/cart/set_03.png" },
    { id: "set_24", name: "Stardust Gala Set", category: "Sets", price: 7200, material: "Gold", tag: "Masterpiece", description: "Luxury set shimmering with micro-diamonds.", image: "/images/cart/set_02.png" },
    { id: "set_25", name: "Sovereign Gold Set", category: "Sets", price: 6400, material: "22k Gold", tag: "Heraldic", description: "Heirloom-quality pure gold collection.", image: "/images/cart/set_01.png" },

];

export const CATEGORIES = [
    "Rings", "Earrings", "Necklaces", "Bracelets", "Sets"
];
