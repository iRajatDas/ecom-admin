import { prismaDb } from "@/lib/prismaDb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React, { FC } from "react";
import SettingsForm from "@/app/(dashboard)/[storeId]/(routes)/settings/components/settings-form";

interface SettingsPageProps {
  params: { storeId: string };
}

const SettingsPage: FC<SettingsPageProps> = async ({ params: { storeId } }) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const store = await prismaDb.store.findFirst({
    where: {
      id: storeId,
    },
  });

  if (!store) redirect("/");

  return (
    <div className=" flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  );
};

export default SettingsPage;
