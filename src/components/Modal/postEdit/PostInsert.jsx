"use client";
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Textarea, Switch, Image, Card, Link } from "@nextui-org/react";
import FormikPost from "@/utils/formik/FormikPost";
import { IoEarthOutline } from "react-icons/io5";
import { IoIosFingerPrint, IoIosClose } from "react-icons/io";
import useEmblaCarousel from "embla-carousel-react";
import { FaUpload } from "react-icons/fa6";

const PostInsert = () => {
  const { formik, loading } = FormikPost();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false })
  // __________________________________________

  const [selectedSnap, setSelectedSnap] = useState(0)
  const [snapCount, setSnapCount] = useState(0)

  const updateScrollSnapState = useCallback((emblaApi) => {
    setSnapCount(emblaApi.scrollSnapList().length)
    setSelectedSnap(emblaApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    updateScrollSnapState(emblaApi)
    emblaApi.on('select', updateScrollSnapState)
    emblaApi.on('reInit', updateScrollSnapState)
  }, [emblaApi, updateScrollSnapState])


  // ________________________________
  return (
    <>
      <Textarea
        label={`content ${formik.values.content.length}/191`}
        variant="underline"
        color={
          formik.touched.content && formik.errors.content ? "danger" : "success"
        }
        isInvalid={formik.errors.content && formik.touched.content}
        errorMessage={
          formik.errors.content && formik.touched.content
            ? formik.errors.content
            : null
        }
        onValueChange={(value) => {
          if (value.length <= 191) {
            formik.setFieldTouched("content", true);
            formik.handleChange("content")(value);
          }
        }}
        onBlur={() => formik.handleBlur("content")}
        value={formik.values.content}
      />
      <div className="text-red-500 text-center py-2">
        {formik.values.content.length == 191 && "max letter is 191 "}
      </div>
      <input
        type="file"
        multiple
        onChange={(e) => {
          formik.setFieldValue("files", [
            ...formik.values.files,
            ...e.target.files,
          ]);
        }}
        className="hidden"
        name="files"
        id="files"
      />
      {formik.values.files.length > 0 ? (
        <div className="embla w-full" ref={emblaRef}>
          <div className="embla__container">
            {formik.values.files.map((file, index) => {
              const extension = file.name.split(".").pop().toLowerCase();
              let fileType;

              if (["jpg", "jpeg", "png", "gif"].includes(extension)) {
                fileType = "Photo";
              } else if (["mp4", "avi", "mov"].includes(extension)) {
                fileType = "Video";
              } else {
                fileType = "Docs";
              }

              return (
                <div key={index} className="embla__slide relative p-4">
                  {fileType === "Photo" && (
                    <Image
                      src={URL.createObjectURL(file)}
                      className="z-0 w-full h-full object-cover"
                    />
                  )}
                  {fileType === "Video" && (
                    <video
                      className="z-0 w-full h-full object-cover"
                      controls
                      preload="none"
                      poster="/video.svg"
                    >
                      <source
                        src={URL.createObjectURL(file)}
                        type="video/mp4"
                      />
                    </video>
                  )}
                  {fileType === "Docs" && (
                    <Card
                      isBlurred
                      className="z-0 w-full h-full object-cover FLEX-CENTER gap-10 my-10 py-10 bg-green-500/10"
                    >
                      <span className="select-none">This Documents</span>
                      <Link href={URL.createObjectURL(file)} download>
                        <Image src="/docs.svg" width={100} />
                        <Button color="success" variant="light">
                          {file.name} Download
                        </Button>
                      </Link>
                    </Card>
                  )}
                  <Button
                    variant="flat"
                    color="danger"
                    isIconOnly
                    className="rounded-full absolute z-[10] top-0 right-0"
                    onPress={() => {
                      formik.setFieldValue(
                        "files",
                        formik.values.files.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    <IoIosClose />
                  </Button>
                </div>
              );
            })}
          </div>
          
          <div>{`Count ${selectedSnap+1} / ${snapCount}`}</div>
        </div>
      ) : (
        <Card className="h-[300px] w-full">
          <Button
            htmlFor="files"
            as="label"
            color="success"
            variant="flat"
            className="w-full h-full  p-0 FLEX-CENTER"
            isIconOnly
          >
            <FaUpload size={60} />
          </Button>
        </Card>
      )}

      <Switch
        size="lg"
        color="success"
        startContent={<IoEarthOutline />}
        endContent={<IoIosFingerPrint />}
        isSelected={formik.values.publicChoose}
        onValueChange={(e) => {
          formik.setFieldValue("publicChoose", e);
        }}
      >
        Public
      </Switch>
      <Button
        color="success"
        variant="ghost"
        onPress={() => {
          formik.handleSubmit();
        }}
        className="w-full mt-4"
        isLoading={loading}
      >
        publish
      </Button>
    </>
  );
};

export default PostInsert;
