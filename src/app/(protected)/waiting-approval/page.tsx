import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { WaitingRealtimeClient } from "@/components/waiting-realtime-client";

export default async function WaitingApprovalPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <WaitingRealtimeClient userId={user.id} />;
}
