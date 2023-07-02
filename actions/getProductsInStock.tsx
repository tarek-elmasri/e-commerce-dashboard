import prismadb from "@/lib/prismadb";

const getProductsInStock = async (storeId: string) => {
  const productsCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  });

  return productsCount;
};

export default getProductsInStock;
