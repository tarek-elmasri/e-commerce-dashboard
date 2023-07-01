import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(colors);
  } catch (error) {
    console.log(error, "ERROR_COLORS_GET");
    return new NextResponse("Server Error", { status: 500 });
  }
};

export const POST = async (
  req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    const body = await req.json();

    const { name, value } = body;

    if (!name || !value) {
      return new NextResponse("INVALID PARAMETERS", { status: 400 });
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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: storeByUser.id,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log(error, "ERROR_COLORS_POST");
    return new NextResponse("Server Error", { status: 500 });
  }
};
