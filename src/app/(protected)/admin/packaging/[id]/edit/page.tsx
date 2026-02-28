import { notFound } from "next/navigation";
import { PackagingForm } from "@/components/forms/packaging-form";
import { getPackagingById } from "@/lib/services/packaging.service";

interface EditPackagingPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagingPage({
  params,
}: EditPackagingPageProps) {
  const { id } = await params;
  const packaging = await getPackagingById(id);

  if (!packaging) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Packaging</h1>
        <p className="mt-1 text-sm text-gray-500">
          Update packaging type{" "}
          <span className="font-medium">{packaging.name}</span>
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <PackagingForm packaging={packaging} />
      </div>
    </div>
  );
}
