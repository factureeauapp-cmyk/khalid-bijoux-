import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("kb-admin-token");
    
    return NextResponse.json({ 
      success: true,
      message: "Logged out successfully" 
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    
    return NextResponse.json(
      {
        error: {
          code: "LOGOUT_FAILED",
          message: "Failed to logout",
        },
      },
      { status: 500 }
    );
  }
}
