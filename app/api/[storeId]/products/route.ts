import { prismaDb } from "@/lib/prismaDb";
// import { slugify } from "@/lib/utils";
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
    const {
      name,
      price,
      categoryId,
      sizeId,
      colorId,
      isFeatured,
      isArchived,
      images,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 403 });

    if (!name) return new NextResponse("name is required", { status: 400 });
    
    if (!images || !images.length) {
      return new NextResponse("Images are requred", { status: 400 });
    }
    if (!price) return new NextResponse("price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("category id is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("size id is required", { status: 400 });
    if (!colorId)
      return new NextResponse("color id is required", { status: 400 });
    // if (!isFeatured)
    //   return new NextResponse("isFeatured is required", { status: 400 });
    // if (!isArchived)
    //   return new NextResponse("isArchived is required", { status: 400 });

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
    const product = await prismaDb.product.create({
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        // slug: slugify(name),
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { searchParams } = new URL(req.url);
  // const slug = searchParams.get("slug") || undefined;
  const categoryId = searchParams.get("categoryId") || undefined;
  const colorId = searchParams.get("colorId") || undefined;
  const sizeId = searchParams.get("sizeId") || undefined;
  const isFeatured = searchParams.get("isFeatured") || undefined;
  // const isArchived = searchParams.get("isArchived") || undefined;

  try {
    if (!params.storeId)
      return new NextResponse("storeId is required", { status: 400 });

    const products = await prismaDb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        // slug,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        color: true,
        size: true,
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });


    return NextResponse.json(products);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ POST ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}
