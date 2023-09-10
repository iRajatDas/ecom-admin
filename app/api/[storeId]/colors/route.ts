import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    console.log(params); // output: { params: { storeId: '5ecb91b4-12c0-4e78-a5ea-a4de2a4758ae' } }
    const { userId } = auth();
    const body: { name: string; value: string } = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 400 });

    if (!value) return new NextResponse("value is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    const color = await prismaDb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const colors = await prismaDb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}
