"use client";

import React, { FC, useEffect, useState } from "react";
import Modal from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Modal
      title="Are you sure?"
      description="The action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 space-x-2 justify-end flex items-center w-full">
        <Button disabled={loading} onClick={onClose} variant={"outline"}>
          Cancel
        </Button>
        <Button disabled={loading} onClick={onConfirm} variant={"destructive"}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default AlertModal;
