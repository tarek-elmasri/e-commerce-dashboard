import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse("INVALID PARAMETERS", { status: 400 });
    }

    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log(params.storeId);

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return serverError(error, "ERROR_STORE_PATCH");
  }
};

export const DELETE = async (
  _req: Request,
  { params: { storeId } }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return serverError(error, "ERROR_STORE_DELETE");
  }
};

const serverError = (error: unknown, label: string) => {
  console.log(error, label);
  return new NextResponse("Server Error", { status: 500 });
};
