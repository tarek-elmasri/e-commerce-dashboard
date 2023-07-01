import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// TODO: check if authentication is required
export const GET = async (
  _req: Request,
  { params }: { params: { categoryId: string } }
) => {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return serverError(error, "ERROR_CATEGORY_GET");
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) => {
  try {
    const body = await req.json();
    const { name, billboardId } = body;

    if (!name || !billboardId) {
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

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return serverError(error, "ERROR_CATEGORY_PATCH");
  }
};

export const DELETE = async (
  _req: Request,
  {
    params: { storeId, categoryId },
  }: { params: { storeId: string; categoryId: string } }
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

    const category = await prismadb.category.delete({
      where: {
        id: categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    return serverError(error, "ERROR_CATEGORY_DELETE");
  }
};

const serverError = (error: unknown, label: string) => {
  console.log(error, label);
  return new NextResponse("Server Error", { status: 500 });
};
