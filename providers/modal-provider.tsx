"use client";

import { useEffect, useState } from "react";
import StoreModal from "@/components/modals/store-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMouted] = useState(false);

  useEffect(() => {
    setIsMouted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <StoreModal />
    </>
  );
};
