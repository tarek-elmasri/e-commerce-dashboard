import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { BillBoardClient } from "./components/BillBoardClient";
import { BillboardColumn } from "./components/Columns";

const BillBoardPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billBoard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillBoardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillBoardPage;
