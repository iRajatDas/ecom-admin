import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const billboard = await prismaDb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ BILLBOARD_GET ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    console.log(params);
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!label) return new NextResponse("label is required", { status: 400 });

    if (!imageUrl)
      return new NextResponse("imageUrl is required", { status: 400 });

    if (!params.billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    const billboard = await prismaDb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ BILLBOARD_PATCH ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    if (!params.billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });

    const billboard = await prismaDb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ BILLBOARD_DELETE ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
