"use client";
import { useRef, useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  CardFooter,
} from "@nextui-org/react";
import { GoUpload } from "react-icons/go";
import axios from "axios";
import { toast } from "sonner";
const ExcelUpload = ({testKeys , api}) => {
  const [data, setData] = useState([]);
  const [compar, setCompar] = useState({});
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false)
  const fileRef = useRef();

  function compareKeys(arrayItems, obj) {
    return arrayItems.map((item) => {
      return {
        name: item,
        exists: obj.hasOwnProperty(item),
      };
    });
  }
  

  useEffect(() => {
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const result = compareKeys(testKeys, data[0]);
      console.log(result);
      setCompar(result);
    }
  }, [data]);

  //check valid excel file
  const isExcelFile = (file) => {
    const allowedExtensions = [".xlsx", ".xls"];
    const fileName = file.name;
    const fileExtension = fileName
      .slice(fileName.lastIndexOf("."))
      .toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };


  const handleUpload = async () => {
    setLoading(true)
    try {
      compar.map((item, index) => {
        if (!item.exists) {
          toast.error(`Key ${item.name} exists in the data`);
          throw new Error(
            `Key ${item.name} exists in the data`
          )
        }
      })
      await axios.post(api, data);
      toast.success("Data uploaded successfully");
    }
    catch (error) {
      console.log(error);
      toast.error("Data upload failed");
      setLoading(false)

    } finally {
      setLoading(false)

    }
  }

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isExcelFile(file) && file.size != 0) {
      const reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = (e) => {
        const data1 = e.target.result;
        const workbook = XLSX.read(data1, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { defval: null });
        setData(parsedData);
      };
      setFileName(file.name);
    } else {
      toast.error("Invalid file type");
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    fileRef.current.value = "";
    setData([]);
  };

  const handleDownload = (data) => {
    let keyvalues = null;

    if (data && data.length > 0) {
      keyvalues = data.map((item) => flattenObject(item));
    }

    const newdata = [...keyvalues];
    const worksheet = XLSX.utils.json_to_sheet(newdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const downloadLink = URL.createObjectURL(excelBlob);
    const link = document.createElement("a");
    link.href = downloadLink;
    link.download = "Data.xlsx";
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(downloadLink);
    }, 100);
  };

  // Helper function to flatten an object
  const flattenObject = (obj, prefix = "") => {
    return Object.keys(obj).reduce((acc, k) => {
      const pre = prefix.length ? prefix + "." : "";
      if (typeof obj[k] === "object" && obj[k] !== null) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };
  return (
    <Card className="w-full h-full">
      <CardHeader className="FLEX-CENTER gap-4">
        <h1 className="text-xl text-green-500">Excel Upload</h1>

        <div className="mb-3">
          <input
            className="hidden"
            type="file"
            id="formFile"
            accept=".xlsx,.xls"
            onChange={handleFile}
            ref={fileRef}
          />
          {fileName && (
            <Button
              color="danger"
              variant="flat"
              onClick={handleRemoveFile}
              className="w-40"
            >
              {fileName} <span className="ml-2">Remove</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <br />

      <CardBody className="FLEX-CENTER h-full">
        {data && data.length > 0 ? (
          <div>
            <h3>Results</h3>

            <div className="flex flex-col justify-start items-start">
              {compar && compar.length > 0 && (
                <div>
                  <h4>Comparing keys</h4>
                  <div className="flex flex-col justify-start items-start gap-2">
                    {compar.map((item, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center w-full gap-6"
                      >
                        <span className=" capitalize first-letter:text-green-500">
                          {item.name}
                        </span>
                        <span
                          className={
                            item.exists ?  "text-green-500": "text-red-500" 
                          }
                        >
                          {item.exists ? "   not exists" :"exists" }
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Button
            as="label"
            htmlFor="formFile"
            color="success"
            variant="flat"
            className="w-full h-80"
            isIconOnly
          >
            <GoUpload size={20} />
          </Button>
        )}
      </CardBody>
      <CardFooter className="flex justify-center items-center gap-6">
        {data && data.length > 0 &&
          <Button
            color="success"
            variant="flat"
            className="w-40"
            onPress={handleUpload}
            isLoading={loading}
          >
            Upload
          </Button>
        }
      </CardFooter>
    </Card>
  );
};

export default ExcelUpload;
