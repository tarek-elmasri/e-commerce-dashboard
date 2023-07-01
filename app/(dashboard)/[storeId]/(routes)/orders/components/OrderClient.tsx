"use client";

import { useParams, useRouter } from "next/navigation";
import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient: React.FC<OrderClientProps> = ({ data: orders }) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <Heading
        title={`Orders (${orders.length})`}
        description="Manage Store Orders"
      />
      <Separator />
      <DataTable columns={columns} data={orders} searchKey="phone" />
    </>
  );
};
