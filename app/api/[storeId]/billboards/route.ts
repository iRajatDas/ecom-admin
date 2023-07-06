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
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!label) return new NextResponse("label is required", { status: 400 });

    if (!imageUrl)
      return new NextResponse("imageUrl is required", { status: 400 });

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
    const billboard = await prismaDb.billboard.create({
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: { storeId: string } }) {
  try {
    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const billboards = await prismaDb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}
