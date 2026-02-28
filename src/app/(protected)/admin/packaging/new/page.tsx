import { PackagingForm } from "@/components/forms/packaging-form";

export default function NewPackagingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Packaging</h1>
        <p className="mt-1 text-sm text-gray-500">
          Add a new packaging/unit type
        </p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <PackagingForm />
      </div>
    </div>
  );
}
