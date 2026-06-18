"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogContent,
  DialogDescription
} from "@/components/ui/dialog";

import { useSuccessModal } from "../store/use-success-modal";
import { Button } from "@/components/ui/button";

export const SuccessModal = () => {
  const router = useRouter();
  const { isOpen, onClose } = useSuccessModal();

  const handleClose = () => {
    router.replace("/");
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!top-1/2 !-translate-y-1/2">
        <DialogHeader>
          <Image
            className="mx-auto"
            src="/logo.svg"
            alt="Logo"
            width={36}
            height={36}
          />
          <DialogTitle className="text-center">
            订阅成功！
          </DialogTitle>
          <DialogDescription className="text-center">
            你已成功订阅我们的服务
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="pt-2 mt-4 gap-y-2">
          <Button
            className="w-full"
            onClick={handleClose}
          >
            继续
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
