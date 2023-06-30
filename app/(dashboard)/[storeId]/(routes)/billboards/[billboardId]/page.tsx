import prismadb from "@/lib/prismadb";
import BillboardForm from "./components/BillboardForm";

const BillBoardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billBoard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <div>
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <BillboardForm initialData={billboard} />
        </div>
      </div>
    </div>
  );
};

export default BillBoardPage;
