import { prismaDb } from "@/lib/prismaDb";
import { slugify } from "@/lib/utils";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    console.log(params);
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("billboardId is required", { status: 400 });

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

    const slug = slugify(name);

    const existingCategory = await prismaDb.category.findFirst({
      where: { slug: slug },
    });

    if (existingCategory)
      return NextResponse.json(
        {
          error: `Category with slug: '${slug}' already exists`,
          message: "Category already exists",
        },
        { status: 403 }
      );

    const category = await prismaDb.category.create({
      data: {
        name,
        slug,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
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

    const categories = await prismaDb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}
