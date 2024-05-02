'use client'
import React, { useState, useContext , useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@nextui-org/react";
import { Context } from "@/provider/Context";

const ModalContainer = (modalId) => {
  const { modalData, setModalData } = useContext(Context);
  const { isOpen, onOpen, onClose ,onOpenChange } = useDisclosure();
  const [currentModalId, setCurrentModalId] = useState(null); // Add state for the current modal ID

  const handleOpen = (data) => {
    setModalData(data);
    setCurrentModalId(modalId);
    onOpen();
  };

  const handleClose = () => {
    setModalData({});
    setCurrentModalId(null);
    onClose();
  };

  const ModalUI = ({children, title }) => (
    <Modal
      isOpen={isOpen && modalId === currentModalId}
      onClose={handleClose}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="top"
      radius="lg"
      shadow="lg"
      motionProps={{ 
        variants: { 
            enter: { 
                scale: "var(--scale-enter)", 
                y: "var(--slide-enter)", 
                opacity: 1, 
                transition: { 
                    scale: { duration: 0.4, ease: [0.36, 0.66, 0.4, 1] }, 
                    opacity: { duration: 0.4, ease: [0.36, 0.66, 0.4, 1] }, 
                    y: { type: "spring", bounce: 0, duration: 0.6 } 
                } 
            }, 
            exit: { 
                scale: "var(--scale-exit)", 
                y: "var(--slide-exit)", 
                opacity: 0, 
                transition: { duration: 0.3, ease: [0.36, 0.66, 0.4, 1] } 
            } 
        } 
    }}
    >
      <ModalContent>
        <ModalHeader className="flex justify-center items-center">
          {title}
        </ModalHeader>
        <ModalBody>
          {children}
        </ModalBody>
      </ModalContent>
    </Modal>
  );

  return { ModalUI, handleOpen, handleClose  , modalData };
};

export default ModalContainer;
