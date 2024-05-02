"use client";
import React, { useState, useEffect } from "react";
import useSWR from "swr";
import { fetcher } from "@/utils/function/fetcher";
import CustomInput from "@/components/UI/CustomInput"
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Checkbox,
  Button,
  Divider,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";

const page = () => {
  const { data: session } = useSession();
  const { data: takes, isLoading: loadingTakes , mutate : mutateTake} = useSWR(
    `/api/v2/take`,
    fetcher
  );
  const { data: payment, isLoading: loadingPayment  , mutate : mutatePayment } = useSWR(
    `/api/v2/take/payment`,
    fetcher
  );

  const formik = useFormik({
    initialValues: {
      cardNumber: "",
      cardCvv: "",
      cardExpiration: "",
    },
    validationSchema: Yup.object().shape({
      cardNumber: Yup.string().required("Required"),
      cardCvv: Yup.string().required("Required"),
      cardExpiration: Yup.string().required("Required"),}),
      onSubmit: async (values) => {
        setLoading(true);
        try {
          values.amount = payment.amount;
          await axios.post("/api/v2/take/payment", values);
          toast.success("Payment added successfully");
          mutatePayment();
          mutateTake();
        } catch (error) {
          toast.error("Unexpected error");
        } finally {
          setLoading(false);}
      },
  })
  const [choose, setChoose] = useState([]);
  const [loading, setLoading] = useState(false);
  const submitAction = async () => {
    setLoading(true);
    try {
      await axios.post("/api/v2/take/choose", choose);
      toast.success("Takes added successfully");
                mutatePayment();
          mutateTake();
    } catch (error) {
      toast.error("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  if (loadingTakes && loadingPayment) return <div>Loading...</div>;

  return payment && payment.amount ? (
    <Card
    className="w-[300px] h-full flex flex-col justify-center items-center gap-4 "
    isBlurred
  >
    <CardBody className="w-full h-full flex flex-col justify-start items-center gap-6  ">
        <span>Enter Data To Payment</span>
        <span>
          {`Amount : ${payment.amount}`}
        </span>
        <CustomInput
          label={"Card Number"}
          formik={formik}
          required
          fieldName={"cardNumber"}
          labelPlace="outside"/>
        <CustomInput
            label={"Card CVV"}
            formik={formik}
            required
            fieldName={"cardCvv"}
            labelPlace="outside"/>
        <CustomInput
            label={"Expiration Date"}
            formik={formik}
            required
            fieldName={"cardExpiration"}
            labelPlace="outside"/>
    </CardBody>
    <CardFooter>
        <Button
          onPress={formik.handleSubmit}
          variant="shadow"
          color="success"
          size="lg"
          className="w-full"
          isLoading={loading}
        >
          submit
        </Button>
      </CardFooter>
  </Card>
  ) : payment && payment.length > 0 ? (
    <Card isBlurred className="w-[600px]  aspect-square fle flex-col justify-center items-center ">
      <CardBody className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-3xl first-letter:text-green-500">Payment added successfully</h1>
      </CardBody>
    </Card>
  ) :  (
    <Card
      className="w-[300px] h-full flex flex-col justify-center items-center gap-4 "
      isBlurred
    >
      <CardHeader className="flex w-full justify-center items-center">
        <h1 className="text-xl ">Choose your takes</h1>
      </CardHeader>
      <CardBody className="flex justify-center items-start gap-4">
        {takes &&
          takes.map((take) => (
            <div
              key={take.id}
              className="w-full flex flex-col justify-center  items-center gap-2"
            >
              <div className="flex justify-between  items-center gap-2 w-full py-4">
                {take.optional ? (
                  <Checkbox
                    color="success"
                    value={take.id}
                    lineThrough
                    size="lg"
                    onValueChange={(value) => {
                      value
                        ? setChoose((prev) => [...prev, take.id])
                        : setChoose((prev) =>
                            prev.filter((id) => id !== take.id)
                          );
                    }}
                  >
                    {take.subject.name}
                  </Checkbox>
                ) : (
                  <Checkbox
                    isDisabled
                    color="success"
                    value={take.id}
                    lineThrough
                    isSelected
                    size="lg"
                  >
                    {take.subject.name}
                  </Checkbox>
                )}
                <span className=" first-letter:text-green-500">{`Counter Hour  : ${take.hourCount}`}</span>
              </div>
              <Divider />
            </div>
          ))}
      </CardBody>
      <CardFooter>
        <Button
          onPress={() => submitAction()}
          variant="shadow"
          color="success"
          size="lg"
          className="w-full"
          isLoading={loading}
          isDisabled={choose.length === 0}
        >
          submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default page;
