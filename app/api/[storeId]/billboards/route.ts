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

    const billboards = await prismadb.billBoard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log(error, "ERROR_BILLBOARD_GET");
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

    const { label, imageUrl } = body;

    if (!label || !imageUrl) {
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

    const billboard = await prismadb.billBoard.create({
      data: {
        label,
        imageUrl,
        storeId: storeByUser.id,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log(error, "ERROR_BILLBOARD_POST");
    return new NextResponse("Server Error", { status: 500 });
  }
};
