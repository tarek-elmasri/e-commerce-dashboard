import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// TODO: check if authentication is required
export const GET = async (
  _req: Request,
  { params }: { params: { productId: string } }
) => {
  try {
    const product = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return serverError(error, "ERROR_PRODUCT_GET");
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) => {
  try {
    const body = await req.json();
    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (
      !name ||
      !price ||
      !categoryId ||
      !colorId ||
      !sizeId ||
      !images ||
      !images.length
    ) {
      return new NextResponse("INVALID PARAMETERS", { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colorId,
        isFeatured,
        isArchived,
        images: {
          deleteMany: {},
        },
      },
    });

    const product = await prismadb.product.update({
      where: { id: params.productId },
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
    return serverError(error, "ERROR_PRODUCT_PATCH");
  }
};

export const DELETE = async (
  _req: Request,
  {
    params: { storeId, productId },
  }: { params: { storeId: string; productId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const storeByUser = await prismadb.store.findFirst({
      where: {
        id: storeId,
        userId,
      },
    });

    if (!storeByUser) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    return serverError(error, "ERROR_PRODUCT_DELETE");
  }
};

const serverError = (error: unknown, label: string) => {
  console.log(error, label);
  return new NextResponse("Server Error", { status: 500 });
};
