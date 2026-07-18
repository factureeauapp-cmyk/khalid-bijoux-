import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateAdminCredentials, buildAdminToken } from "@/lib/server/admin-auth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Accept both "email" and "identifier" for flexibility
    const email = String(body.email ?? body.identifier ?? "").trim();
    const password = String(body.password ?? "").trim();

    console.log("[LOGIN DEBUG] Incoming request:", { email, password: password ? "***" : "empty" });

    // Validation simple
    if (!email || !password) {
      console.log("[LOGIN DEBUG] Missing fields - email:", email, "password:", password ? "set" : "missing");
      return NextResponse.json(
        {
          error: {
            code: "MISSING_FIELDS",
            message: "Email and password are required",
          },
        },
        { status: 400 }
      );
    }

    // First try local authentication (for testing)
    console.log("[LOGIN DEBUG] Attempting local authentication...");
    const isValid = await validateAdminCredentials(email, password);
    console.log("[LOGIN DEBUG] Local auth result:", isValid);
    
    if (isValid) {
      console.log("[LOGIN DEBUG] ✅ Local auth successful!");
      const token = await buildAdminToken(email);
      const cookieStore = await cookies();
      cookieStore.set("kb-admin-token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 8 * 60 * 60, // 8 hours in seconds
      });

      return NextResponse.json({
        success: true,
        email,
      });
    }

    console.log("[LOGIN DEBUG] Local auth failed, attempting Spring Boot backend...");
    
    // Fallback: Try Spring Boot backend if available
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("[LOGIN DEBUG] Spring Boot response status:", response.status);

      if (response.ok) {
        const authData = await response.json();
        console.log("[LOGIN DEBUG] ✅ Spring Boot auth successful!");
        const cookieStore = await cookies();
        cookieStore.set("kb-admin-token", authData.token, {
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          path: "/",
          maxAge: authData.expiresIn || 28800,
        });

        return NextResponse.json({
          success: true,
          email: authData.email,
        });
      }
    } catch (backendError) {
      console.log("[LOGIN DEBUG] Spring Boot backend error:", backendError);
    }

    // Both failed
    console.log("[LOGIN DEBUG] ❌ All authentication methods failed!");
    return NextResponse.json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password",
        },
      },
      { status: 401 }
    );

  } catch (error) {
    console.error("[LOGIN DEBUG] ❌ FATAL ERROR:", error);

    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}