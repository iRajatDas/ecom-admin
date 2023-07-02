import { UserButton, auth } from "@clerk/nextjs";
import React, { FC } from "react";
import MainNav from "@/components/main-nav";
import StoreSwitcher from "@/components/store-switcher";
import { prismaDb } from "@/lib/prismaDb";
import { redirect } from "next/navigation";

interface NavbarProps {}

const Navbar: FC<NavbarProps> = async ({}) => {
  const { userId } = auth();

  if (!userId) redirect("/");

  const stores = await prismaDb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <StoreSwitcher className="mx-6" items={stores} />
        <MainNav className="mx-6 w-full " />
        <div className="ml-auto flex items-center space-x-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
