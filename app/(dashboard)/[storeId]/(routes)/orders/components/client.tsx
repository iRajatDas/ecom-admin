"use client";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import React, { FC } from "react";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "./data-table";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient: FC<OrderClientProps> = ({ data }) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store."
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
    </>
  );
};

export default OrderClient;
