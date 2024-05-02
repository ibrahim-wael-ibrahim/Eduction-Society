"use client";
import React from "react";
import { Button } from "@nextui-org/react";
const Stepper = ({ currentStep, numberOfSteps , setCurrentStep }) => {
  const activeColor = (index) =>
    currentStep >= index ? "bg-green-500 " : "bg-gray-300";
  const isFinalStep = (index) => index === numberOfSteps - 1;
  return (
    <div className="flex items-center">
      {Array.from({ length: numberOfSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <Button
            className={` rounded-full p-0 `}
            color={currentStep >= index ? "success" : "default"}
            isIconOnly
            variant={currentStep >= index ? "solid" : "faded"}
            onPress={() => {setCurrentStep(index)}}
          >
            {index + 1}
          </Button>
          {isFinalStep(index) ? null : (
            <div className={`w-12  h-[2px] ${activeColor(index + 1)} `}></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
