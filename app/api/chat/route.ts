import { NextResponse } from "next/server";
import { processAIInquiry } from "@/backend/llm_handler";

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const response = await processAIInquiry(message);

        // Simulating a slight delay for "AI thinking"
        await new Promise(resolve => setTimeout(resolve, 1000));

        return NextResponse.json(response);
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: "INTERNAL_SERVER_ERROR" }, { status: 500 });
    }
}
