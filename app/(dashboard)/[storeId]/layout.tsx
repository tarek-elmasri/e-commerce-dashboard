import Navbar from "@/components/Navbar";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface DahsboardLayoutProps {
  params: { storeId: string };
  children: React.ReactNode;
}

const DashboardLayout = async ({
  params: { storeId },
  children,
}: DahsboardLayoutProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const userStores = await prismadb.store.findMany({
    where: { userId },
  });

  const firstStore = userStores.find((store) => store.id === storeId);

  if (!firstStore) {
    redirect("/");
  }

  return (
    <>
      <Navbar stores={userStores} />
      {children}
    </>
  );
};

export default DashboardLayout;
