"use client";
import { useState , useEffect , memo } from "react";
import Stepper from "./Stepper";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ButtonGroup,
  Button,
  Spinner,
  Link
} from "@nextui-org/react";
import { usePathname } from 'next/navigation'

const ContainerStep = ({ children, numberOfStep , formik , loading}) => {
  const pathname = usePathname()
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  
  const goToNextStep = () => {
    setIsLoading(true); // Set loading state to true when going to next step
    setCurrentStep((prev) => (prev === numberOfStep - 1 ? prev : prev + 1));
  };
  
  const goToPreviousStep = () => {
    setIsLoading(true); // Set loading state to true when going to previous step
    setCurrentStep((prev) => (prev <= 0 ? prev : prev - 1));
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // Set loading state to false after a delay
    }, 1000); // Adjust delay as needed
  
    return () => clearTimeout(timer); // Clean up on unmount
  }, [currentStep]);
  useEffect(() => {
    setIsLoading(false); // Set loading state to false after a delay
  }, []);
  

  return (
    <>
      <Card className="min-w-[300px] w-[450px] h-[800px]">
        <CardHeader className="flex items-center justify-center">
          <Stepper
            currentStep={currentStep}
            numberOfSteps={numberOfStep}
            setCurrentStep={setCurrentStep}
          />
        </CardHeader>
        <CardBody className="h-full w-full  FLEX-CENTER ">
        {
          isLoading ? <Spinner color='success' size='lg'  label='Loading...'/> : children[currentStep]
        }
        </CardBody>
        <CardFooter className="FLEX-CENTER !items-start gap-2">
{
  pathname === "/register" ?         <Link href="/login" showAnchorIcon color="success">
  i have account
</Link> : null
}
          <ButtonGroup className="w-full">
            <Button
              onPress={goToPreviousStep}
              variant="flat"
              color={currentStep === 0 ? "default" : "success"}
              isDisabled={currentStep === 0}
            >
              Previous
            </Button>
            <Button
              className="w-full"
              variant="shadow"
              onPress={formik.handleSubmit}
              isLoading={loading}
              isDisabled={currentStep !== numberOfStep - 1}
              color={currentStep !== numberOfStep - 1 ? "default" : "success"}
            >
              Submit
            </Button>
            <Button
              onPress={goToNextStep}
              variant="flat"
              color={currentStep !== numberOfStep - 1 ? "success" : "default"}
              isDisabled={currentStep === numberOfStep - 1}
            >
              Next
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};

export default memo(ContainerStep);
