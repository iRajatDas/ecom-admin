"use client";

import React, { FC } from "react";
import Modal from "@/components/ui/modal";
import { useStoreModal } from "@/hooks/useStoreModal";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "react-hot-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
});

const StoreModal: FC = ({}) => {
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // await new Promise((resolve) => setTimeout(() => resolve(""), 3000));
    try {
      const createStoreRes = await axios.post("/api/stores", values);

      window.location.assign(`${createStoreRes.data.id}`);
    } catch (error) {
      toast.error("Something went wrong.");
      console.log("🚀 ~ file: store-modal.tsx:41 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <Modal
      title="Create store"
      description="Hello"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="">
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={form.formState.isSubmitting}
                        placeholder="E-Commerce"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button variant="outline" onClick={storeModal.onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
