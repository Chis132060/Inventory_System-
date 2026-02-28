import { notFound } from "next/navigation";
import { ProductForm } from "@/components/forms/product-form";
import { getProductById } from "@/lib/services/products.service";
import { getAllPackaging } from "@/lib/services/packaging.service";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, packagingOptions] = await Promise.all([
    getProductById(id),
    getAllPackaging(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update product details for{" "}
          <span className="font-medium">{product.name}</span>
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <ProductForm product={product} packagingOptions={packagingOptions} />
      </div>
    </div>
  );
}
