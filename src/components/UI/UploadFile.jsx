'use client'
import { useState, useEffect } from "react";
import {  Card, CardBody, CardFooter, CardHeader, Button, CircularProgress, ButtonGroup, Spinner, Divider } from '@nextui-org/react'
import useFileUpload from '@/hooks/useUploadFile';
import { IoCloseCircleOutline } from "react-icons/io5";

const UploadFile = ({formik}) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, [isClient]);

    const {
        files,
        response,
        loading,
        progress,
        handleFile,
        handleDelete,
        handleUpload
    } = useFileUpload(formik);
    const UI = () => {
        return (
            <Card className='w-full h-full FLEX-CENTER'>
                <CardHeader className='w-full FLEX-CENTER'>Upload File</CardHeader>
                <CardBody className='w-full h-80 FLEX-CENTER'>
                    <input type='file' multiple onChange={handleFile} className='hidden' name='files' id='files' />
                    {loading ?
                        <CircularProgress
                            aria-label="Upload..."
                            size="lg"
                            value={progress}
                            color="success"
                            showValueLabel={true}
                        />
                        : <div className="w-full h-full flex flex-col justify-start  items-start gap-4 overflow-auto" >
                            {files.map((file, index) => (
                                <div key={index} className='FLEX-CENTER  w-full h-full p-2' >
                                    <div className="w-full flex  items-center justify-between pb-2">
                                    <p className=" truncate ... ">{file.name}</p>
                                    <Button onPress={() => handleDelete(index)} className="p-0" variant="light" color="danger" isIconOnly>
                                        <IoCloseCircleOutline size={24} />
                                    </Button>
                                    </div>
                                    <Divider className="my-1"/>
                                </div>
                            ))}
                        </div>

                    }

                </CardBody>
                <CardFooter className='w-full  FLEX-CENTER'>
                    <ButtonGroup className='w-full'>
                        <Button onClick={handleUpload} disabled={loading} color="success"
                            variant="flat" >Upload</Button>
                        <Button as='label' htmlFor='files' className='w-full' variant="shadow" color="success">
                            Select File
                        </Button>
                    </ButtonGroup>

                </CardFooter>
            </Card>
        )
    }
    return isClient ? UI() : <Spinner label="Loading..." color="success" />


}

export default UploadFile