import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId)
      return new NextResponse("Product id is required", { status: 400 });

    const product = await prismaDb.product.findUnique({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:21 ~ PRODUCT_GET ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    console.log(params);
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

    if (!params.productId)
      return new NextResponse("product id is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });
    await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        colorId,
        categoryId,
        sizeId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismaDb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:24 ~ PRODUCT_PATCH ~ error:", error);
    return new NextResponse("Internal error occured", { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthorized", { status: 403 });
    if (!params.productId)
      return new NextResponse("product id is required", { status: 400 });

    const storeByUserId = await prismaDb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Action not allowed", { status: 403 });

    const product = await prismaDb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("🚀 ~ file: route.ts:8 ~ PRODUCT_DELETE ~ error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
