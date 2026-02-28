import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getAllPackaging } from "@/lib/services/packaging.service";
import { DeleteButton } from "@/components/ui/delete-button";
import { deletePackagingAction } from "@/server/actions/packaging.actions";

export default async function PackagingPage() {
  const packagingList = await getAllPackaging();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Packaging</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage packaging and unit types
          </p>
        </div>
        <Link
          href="/admin/packaging/new"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Packaging
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {packagingList.map((pkg) => (
              <tr key={pkg.id} className="hover:bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {pkg.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {new Date(pkg.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/packaging/${pkg.id}/edit`}
                      className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <DeleteButton
                      onDelete={async () => {
                        "use server";
                        return deletePackagingAction(pkg.id);
                      }}
                      entityName="packaging"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {packagingList.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">
            No packaging types yet.{" "}
            <Link
              href="/admin/packaging/new"
              className="text-indigo-600 hover:underline"
            >
              Create your first packaging type
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
