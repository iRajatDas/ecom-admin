import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 403 });

    const store = await prismaDb.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}