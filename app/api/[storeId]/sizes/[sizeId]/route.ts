import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { sizeId: string } }
) => {
  try {
    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    return serverError(error, "ERROR_SIZE_GET");
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) => {
  try {
    const body = await req.json();
    const { name, value } = body;

    if (!name || !value) {
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

    const size = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    return serverError(error, "ERROR_SIZE_PATCH");
  }
};

export const DELETE = async (
  _req: Request,
  {
    params: { storeId, sizeId },
  }: { params: { storeId: string; sizeId: string } }
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

    const size = await prismadb.size.delete({
      where: {
        id: sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    return serverError(error, "ERROR_SIZE_DELETE");
  }
};

const serverError = (error: unknown, label: string) => {
  console.log(error, label);
  return new NextResponse("Server Error", { status: 500 });
};
