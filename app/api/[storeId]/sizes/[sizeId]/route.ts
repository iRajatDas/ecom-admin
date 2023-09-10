import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("sizeId is required", { status: 400 });

    const size = await prismaDb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ SIZE_GET ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    console.log(params);
    const { userId } = auth();
    const body: { name: string; value: string } = await req.json();
    const { name, value } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 400 });

    if (!value) return new NextResponse("value is required", { status: 400 });

    if (!params.sizeId)
      return new NextResponse("sizeId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    const size = await prismaDb.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ SIZE_PATCH ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    if (!params.sizeId)
      return new NextResponse("sizeId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });

    const size = await prismaDb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ SIZE_DELETE ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
