import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { OrderClient } from "./components/OrderClient";
import { OrderColumn } from "./components/Columns";
import { priceFormatter } from "@/lib/utils";

const OrderPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrder: OrderColumn[] = orders.map(
    ({ id, phone, address, orderItems, isPaid, createdAt }) => ({
      id,
      phone,
      address,
      isPaid,
      products: orderItems
        .map((orderItem) => orderItem.product.name)
        .join(", "),
      totalPrice: priceFormatter.format(
        orderItems.reduce(
          (total, orderItem) => total + Number(orderItem.product.price),
          0
        )
      ),
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrder} />
      </div>
    </div>
  );
};

export default OrderPage;
