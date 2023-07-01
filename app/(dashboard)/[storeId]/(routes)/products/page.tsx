import prismadb from "@/lib/prismadb";
import { format } from "date-fns";
import { ProductColumn } from "./components/Columns";
import { priceFormatter } from "@/lib/utils";
import { ProductClient } from "./components/ProductClient";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      color: true,
      size: true,
    },
  });

  const formattedProducts: ProductColumn[] = products.map(
    ({
      id,
      name,
      price,
      isFeatured,
      isArchived,
      createdAt,
      category,
      size,
      color,
    }) => ({
      id,
      name,
      price: priceFormatter.format(price.toNumber()),
      isFeatured,
      isArchived,
      category: category.name,
      size: size.name,
      color: color.value,
      createdAt: format(createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col ">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
