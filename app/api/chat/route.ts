import { NextResponse } from "next/server";
import { processAIInquiry } from "@/backend/llm_handler";

export async function POST(request: Request) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const springApiBaseUrl = process.env.SPRING_API_BASE_URL;
        if (springApiBaseUrl) {
            try {
                const springResponse = await fetch(`${springApiBaseUrl}/api/v1/chat/recommendations`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message }),
                    cache: "no-store",
                });

                if (springResponse.ok) {
                    const springData = await springResponse.json();
                    return NextResponse.json(springData);
                }
            } catch (springError) {
                console.warn("Spring chat fallback triggered:", springError);
            }
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
