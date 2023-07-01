import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const GET = async (
  _req: Request,
  { params }: { params: { storeId: string } }
) => {
  try {
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error, "ERROR_CATEGORIES_GET");
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

    const { name, billboardId } = body;

    if (!name || !billboardId) {
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

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: storeByUser.id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error, "ERROR_CATEGORIES_POST");
    return new NextResponse("Server Error", { status: 500 });
  }
};
