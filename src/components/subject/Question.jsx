import React from "react";
import {
  Card,
  Button,
  CardBody,
  CardHeader,
  CardFooter,
  Divider,
  User,
} from "@nextui-org/react";
import CustomInput from "../UI/CustomInput";
import { useSession } from "next-auth/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";
import { IoIosClose } from "react-icons/io";

const createAnswerSchema = Yup.object().shape({
  content: Yup.string().required("Content is required"),
});

const Question = ({ question, mutate   }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      content: "",
    },
    validationSchema: createAnswerSchema,
    onSubmit: async ({ content }) => {
      setLoading(true);
      try {
        await axios.post(`/api/v2/question/${question.id}/answer`, { content });
        toast.success("Successfully Created answer");
        mutate();
        formik.resetForm();
      } catch (error) {
        toast.error("Error Creating Answer");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleDeleteAnswer = async (id) => {
    try {
        console.log(question.answer)
      await axios.delete(`/api/v2/question/${question.id}/answer/${id}`);
      toast.success("Successfully Deleted answer");
      mutate();
    } catch (error) {
      toast.error("Error Deleting Answer");
    }
  }

  const handleDeleteQuestion = async () => {
    try {
      await axios.delete(`/api/v2/lecture/${question.lectureId}/question/${question.id}`);
      toast.success("Successfully Deleted question");
      mutate();
    } catch (error) {
      toast.error("Error Deleting Question");
    }
  }

  return (
    <Card fullWidth isBlurred className="p-4">
      <CardHeader className="flex flex-row justify-start items-start gap-4 relative">
        <User
          name={question.student.user.name}
          description={question.date.split("T")[0]}
          avatarProps={{
            src: question.student.user.image,
          }}
        />
        <span className=" first-letter:text-green-500">{question.content}</span>
        {session && (session.user.student === question.student.id ) && (
            <Button
                variant="flat"
                color="danger"
                onPress={handleDeleteQuestion}
                className="absolute right-0 top-0 rounded-full"
                isIconOnly
            >
                <IoIosClose size={24} />
            </Button>
        )}
      </CardHeader>
      <cardBody >

        {question.answer.map((answer , index) => (
          <div className="flex  flex-col justify-start items-start gap-4 px-8">
            <div className="flex gap-4 flex-col justify-start  items-start relative w-full">
              <User
                name={answer.teacher.user.name}
                description={` Date : ${answer.date.split("T")[0]}`}
                avatarProps={{
                  src: answer.teacher.user.image,
                }}
              />
              
              <span className=" first-letter:text-green-500 mx-10">{`|  ${answer.content}`}</span>
                {session && session.user.id === answer.teacher.user.id && (
                <Button 
                    variant="flat"
                    color="danger"
                    onPress={()=>{handleDeleteAnswer(answer.id)}}
                    className="absolute right-0 top-4 rounded-full"
                    isIconOnly
                >
                    <IoIosClose size={24} />
                </Button>
                )}
            </div>
            <Divider className="w-11/12 m-auto" />
            </div>
        ))}
      </cardBody>

        <CardFooter >
        {session &&
      (session.user.type === "PROFESSOR" || session.user.type === "TEACHER") ? (<div className="flex justify-center items-center gap-5 w-full">
          <CustomInput label="Answer" formik={formik} fieldName="content" />
          <Button
            isIconOnly
            isLoading={loading}
            variant="flat"
            color="success"
            className="  flex justify-center items-center   px-10 py-4"
            size="lg"
            onPress={formik.handleSubmit}
          >
            Send
          </Button></div>
      ) : <div></div>}

        </CardFooter>
    </Card>
  );
};

export default Question;
