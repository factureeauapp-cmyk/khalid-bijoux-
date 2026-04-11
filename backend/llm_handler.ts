import { PRODUCTS, Product } from "../lib/data";

export interface ChatResponse {
    role: "assistant";
    content: string;
    products?: Product[];
    action?: {
        type: "ADD_TO_CART";
        product: Product;
    };
}

export const processAIInquiry = async (message: string): Promise<ChatResponse> => {
    const text = message.toLowerCase();
    let filtered = PRODUCTS;
    let response = "";

    // 1. Check for Buy/Order Intent
    const buyIntent = text.match(/\b(buy|order|add|get)\b/);
    const priceIntent = text.match(/\b(price|cost|how much|value)\b/);

    // 2. Name Matching Logic (Fuzzy/Substring)
    const mentionedProduct = PRODUCTS.find(p =>
        text.includes(p.name.toLowerCase()) ||
        (p.name.toLowerCase().split(' ').some(word => word.length > 3 && text.includes(word)))
    );

    if (mentionedProduct) {
        if (buyIntent) {
            return {
                role: "assistant",
                content: `Splendid choice. I have added the ${mentionedProduct.name} to your collection. Shall we continue browsing or proceed to checkout?`,
                products: [mentionedProduct],
                action: { type: "ADD_TO_CART", product: mentionedProduct }
            };
        }

        if (priceIntent) {
            return {
                role: "assistant",
                content: `The ${mentionedProduct.name} is currently valued at $${mentionedProduct.price}. It is a signature piece from our ${mentionedProduct.category} collection.`,
                products: [mentionedProduct]
            };
        }
    }

    // 3. Category & Budget Filters (Existing logic refined)
    const isBudgetSearch = text.match(/\$?(\d+)/);
    if (isBudgetSearch) {
        const budget = parseInt(isBudgetSearch[1]);
        filtered = filtered.filter(p => p.price <= budget);
        response = `Consulting the archives for pieces within $${budget}... `;
    }

    if (/\bearrings?\b/.test(text)) {
        filtered = filtered.filter(p => p.category === "Earrings");
        response += "Behold our radiant selection of studs and drops. ";
    } else if (/\brings?\b/.test(text)) {
        filtered = filtered.filter(p => p.category === "Rings");
        response += "Presenting our artisan rings, crafted for elegance. ";
    } else if (/\bnecklaces?\b/.test(text)) {
        filtered = filtered.filter(p => p.category === "Necklaces");
        response += "Exploring our signature necklaces and pendants. ";
    } else if (/\bbracelets?\b/.test(text)) {
        filtered = filtered.filter(p => p.category === "Bracelets");
        response += "Here are our finest bracelets for your consideration. ";
    } else if (/\bsets?\b/.test(text)) {
        filtered = filtered.filter(p => p.category === "Sets");
        response += "Behold complete matching sets from our high-jewellery collections. ";
    }

    // If we have a specific product match but no specific intent, prioritize it
    if (mentionedProduct && !response) {
        return {
            role: "assistant",
            content: `The ${mentionedProduct.name} is a magnificent piece. Would you like to view its full details or add it to your cart?`,
            products: [mentionedProduct]
        };
    }

    // Default response for simple greetings
    if (!isBudgetSearch && !mentionedProduct && (text.includes("hello") || text.includes("hi") || text.includes("hey"))) {
        return {
            role: "assistant",
            content: "Greetings to the world of Noir Éclat. I am your concierge. How may I assist your discovery today? You may ask for specific pieces by name, or browse by category."
        };
    }

    if (filtered.length === 0) {
        return {
            role: "assistant",
            content: "I have consulted the archives, but no pieces currently match your exact criteria. Shall we explore a different category or price point?"
        };
    }

    return {
        role: "assistant",
        content: response || "I've curated some exceptional pieces that match your request:",
        products: filtered.slice(0, 4)
    };
};
