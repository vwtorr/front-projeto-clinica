import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const token = await cookies();

  return NextResponse.json({ token:  token.get("@token")?.value || null }); // Retorna o token no formato JSON
}

export async function POST(request: Request) {
  const { token } = await request.json();

  const response = NextResponse.json({ message: "Save cookie" });
  response.cookies.set("@token", token);
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ message: "Theme cookie deleted" });
  response.cookies.set("@token", "", { maxAge: -1 });
  return response;
}

export async function PUT(request: Request) {
  const { theme } = await request.json();
  const response = NextResponse.json({ message: "Theme updated" });
  response.cookies.set("theme", theme);
  return response;
}
