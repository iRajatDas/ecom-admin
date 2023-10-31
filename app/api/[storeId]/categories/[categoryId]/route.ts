import { prismaDb } from "@/lib/prismaDb";
// import { slugify } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("categoryId is required", { status: 400 });

    const category = await prismaDb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ CATEGORY_GET ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    console.log(params);
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("label is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("imageUrl is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("categoryId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    const category = await prismaDb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        // slug: slugify(name),
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ CATEGORY_PATCH ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    if (!params.categoryId)
      return new NextResponse("categoryId is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });

    const category = await prismaDb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ CATEGORY_DELETE ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
