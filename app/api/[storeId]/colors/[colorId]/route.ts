import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.colorId)
      return new NextResponse("colorId is required", { status: 400 });

    const color = await prismaDb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ COLOR_GET ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    console.log(params);
    const { userId } = auth();
    const body: { name: string; value: string } = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 400 });

    if (!value) return new NextResponse("value is required", { status: 400 });

    if (!params.colorId)
      return new NextResponse("colorId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    const color = await prismaDb.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ COLOR_PATCH ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    if (!params.colorId)
      return new NextResponse("colorId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });

    const color = await prismaDb.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ COLOR_DELETE ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
