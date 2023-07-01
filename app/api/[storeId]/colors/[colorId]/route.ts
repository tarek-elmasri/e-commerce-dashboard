import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (
  _req: Request,
  { params }: { params: { colorId: string } }
) => {
  try {
    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return serverError(error, "ERROR_COLOR_GET");
  }
};

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    const color = await prismadb.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return serverError(error, "ERROR_COLOR_PATCH");
  }
};

export const DELETE = async (
  _req: Request,
  {
    params: { storeId, colorId },
  }: { params: { storeId: string; colorId: string } }
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

    const color = await prismadb.color.delete({
      where: {
        id: colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    return serverError(error, "ERROR_COLOR_DELETE");
  }
};

const serverError = (error: unknown, label: string) => {
  console.log(error, label);
  return new NextResponse("Server Error", { status: 500 });
};
