import { ProductForm } from "@/components/forms/product-form";
import { getAllPackaging } from "@/lib/services/packaging.service";

export default async function NewProductPage() {
  const packagingOptions = await getAllPackaging();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new product to the catalog
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <ProductForm packagingOptions={packagingOptions} />
      </div>
    </div>
  );
}
