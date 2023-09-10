"use client";
import React, { FC, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import AlertModal from "@/components/modals/alert-modal";
import { ProductColumn } from "./columns";

interface CellActionProps {
  data: ProductColumn;
}

const CellAction: FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  const [isDeleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast.success("Product ID copied!");
  };
  const onUpdate = () => {
    router.push(`/${params.storeId}/products/${data.id}`);
  };
  const onDelete = async () => {
    setDeleting(true);
    try {
      await axios.delete(
        `/api/${params.storeId}/products/${data.id}`
      );
      router.refresh();
      toast.success("Product Deleted");
    } catch (error) {
      toast.error(
        "Make sure you have removed all categories using this product first."
      );
    } finally {
      setOpen(false);
      setDeleting(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={isDeleting}
        onConfirm={onDelete}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"ghost"} className="w-8 h-8 p-0">
            <span className="sr-only">Open Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onUpdate}>
            <Edit className="h-4 w-4 mr-2" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
