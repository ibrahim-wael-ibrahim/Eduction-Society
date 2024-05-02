import { useState, useRef } from 'react';
import XLSX from 'xlsx';

const useExcel = () => {

  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('');

  const fileRef = useRef();

  const isExcelFile = (file) => {
    const allowedExtensions = ['.xlsx', '.xls'];
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
    return allowedExtensions.includes(fileExtension);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (isExcelFile(file) && file.size !== 0) {
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
      toast.error('Invalid file format');
      fileRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFileName(null);
    fileRef.current.value = "";
    setData([]);
  };

  const handleDownload = (data) => {
    let keyvalues;

    if (data && data.length > 0) {
      keyvalues = data.map(item => item);
    }
    const newdata = [...keyvalues];
    const worksheet = XLSX.utils.json_to_sheet(newdata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = URL.createObjectURL(excelBlob);
    const link = document.createElement('a');
    link.href = downloadLink;
    link.download = "newdata.xlsx";
    link.click();

    setTimeout(() => {
      URL.revokeObjectURL(downloadLink);
    }, 100);
  };

  return {
    data,
    fileName,
    fileRef,
    handleFile,
    handleRemoveFile,
    handleDownload,
  };
};

export default useExcel;
