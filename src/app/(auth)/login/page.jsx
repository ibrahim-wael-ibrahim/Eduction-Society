"use client";
import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  ButtonGroup,
  Button,
  Link,
} from "@nextui-org/react";
import CustomInput from "@/components/UI/CustomInput";
import CompanyItem from "@/components/sidebar/Company-item";
import FormikLogin from "@/utils/formik/auth/FormikLogin";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
const login = () => {
  const { formik, loading } = FormikLogin();
  const router = useRouter()
  const {data : session} =useSession()
  if(session) router.replace("/")
  return (
    <>
      <Card className="min-w-[300px] w-2/6  container ">
        <CardHeader className="text-3xl FLEX-CENTER gap-8  ">
          <CompanyItem/>
        </CardHeader>
        <CardBody className="FLEX-CENTER w-full gap-5 my-4">
          <CustomInput
            type="email"
            label={"Email"}
            formik={formik}
            required
            fieldName={"email"}
          />
          <CustomInput
            type="password"
            label={"Password"}
            formik={formik}
            required
            fieldName={"password"}
          />
        </CardBody>
        <CardFooter className="flex flex-col justify-start items-start gap-3">
          <Link href="/forget" showAnchorIcon color="success">
            Forget a Password
          </Link>
          <ButtonGroup className="w-full">
            <Button
              isLoading={loading}
              onPress={formik.handleSubmit}
              className="w-full"
              variant="shadow"
              color="success"
            >
              {
                loading ? "Loading..." : "Login"
              }
            </Button>
            <Button
              as={Link}
              showAnchorIcon
              href="/register"
              variant="flat"
              color="default"
            >
              Register
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </>
  );
};

export default login;
