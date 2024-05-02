"use client"
import React, { useEffect, useState } from 'react'
import { BiChevronDown } from 'react-icons/bi';
import RenderCellComponent from '@/utils/function/RenderCell';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, Card, CardBody, CardHeader, CardFooter, Spinner, Input, Button, DropdownTrigger, Dropdown, DropdownMenu, DropdownItem, ButtonGroup } from "@nextui-org/react";
import { SearchIcon } from '../icons/SearchIcon';
import axios from 'axios'
import useSWR from 'swr'
import { AiOutlineDelete } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { MdOutlineFileDownload } from "react-icons/md";

import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import ModalContainer from '../UI/ModalContainer';
import * as XLSX from 'xlsx'
const TableCustomize = ({ api, idModal, Wrap, arrayCols, ColsShow, titleModal }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      setLoading(false);
    }, []);
    const { data: session } = useSession();
    const fetcher = url => axios.get(url).then(res => res.data)
    const { data, isLoading, mutate } = useSWR(session?.user.institution ? `/api/v1/institution/${session?.user?.institution}/${api}` : null, fetcher)

    const { ModalUI: ItemCreate, handleOpen: handleItemCreate } = ModalContainer(idModal);

    const { RenderCell } = RenderCellComponent()
    const [selectedKeys, setSelectedKeys] = useState(new Set([]));
    const [filterValue, setFilterValue] = React.useState("");
    const [statusFilter, setStatusFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(6);
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(ColsShow));
    const hasSearchFilter = Boolean(filterValue);
    const [page, setPage] = React.useState(1);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "name",
        direction: "ascending",
    });

    const handleDownload = (data) => {
        let keyvalues = null;
      
        if (data && data.length > 0) {
          keyvalues = data.map(item => flattenObject(item));
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
        link.download = "Data.xlsx";
        link.click();
      
        setTimeout(() => {
          URL.revokeObjectURL(downloadLink);
        }, 100);
      };
      
      // Helper function to flatten an object
      const flattenObject = (obj, prefix = '') => {
        return Object.keys(obj).reduce((acc, k) => {
          const pre = prefix.length ? prefix + '.' : '';
          if (typeof obj[k] === 'object' && obj[k] !== null) {
            Object.assign(acc, flattenObject(obj[k], pre + k));
          } else {
            acc[pre + k] = obj[k];
          }
          return acc;
        }, {});
      };



    const handleDeleteSelected = async () => {
        try {
            await axios.delete(`/api/v1/institution/${session?.user?.institution}/${api}`, {
                data: [...selectedKeys]
            });
            setSelectedKeys(new Set([]))
            mutate()
            toast.success("success delete");
        } catch (err) {
            console.log(err);
            toast.error("error Delete");
        }
    };
    const filteredItems = React.useMemo(() => {
        let filteredData = data ? data : [];

        if (hasSearchFilter) {
            filteredData = filteredData.filter((data) =>
                data.name.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredData = filteredData.filter((data) =>
                Array.from(statusFilter).includes(data.status),
            );
        }

        return filteredData;
    }, [data, filterValue, statusFilter]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

  

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return arrayCols;

        return arrayCols.filter((column) => Array.from(visibleColumns).includes(column.key));
    }, [visibleColumns]);

    useEffect

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("")
        setPage(1)
    }, [])


    return (
        <>
            <ItemCreate title={titleModal}>
                <Wrap />
            </ItemCreate>
            <Card className='w-full min-h-[600px]' isBlurred >
                {
                    loading ? <Spinner color='success' size='lg'  label='Loading...'/> :  <>
                        <CardHeader className='flex flex-col justify-start items-start gap-3' >
                    <div className='w-full flex gap-6'>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex w-full">
                                <Button endContent={<BiChevronDown size={22} />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {arrayCols.map((column) => (
                                    <DropdownItem key={column.key}>
                                        {column.label}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Input
                            classNames={{
                                base: " max-w-[10rem] sm:max-w-full h-10",
                                mainWrapper: "h-full",
                                input: "text-small",
                                inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                            }}
                            placeholder="Type to search..."
                            size="sm"
                            startContent={<SearchIcon size={18} />}
                            type="search"
                            variant="flat"
                            color="success"
                            radius="sm"
                            value={filterValue}
                            onClear={() => onClear()}
                            onValueChange={onSearchChange}
                        />
                                                    <Button size='sm' color='success' variant='flat' className='w-full' onPress={()=>{handleDownload(data)}}>
                                <MdOutlineFileDownload />
                                download All
                            </Button>
                    </div>
                    <div className='flex w-full justify-between items-center'>
                        <span>
                            {
                                `items count ${data ? data.length : "load..."}`
                            }
                        </span>
                        <div>
                            <ButtonGroup>
                                <Button isIconOnly size='sm' color='danger' variant='flat' onClick={() => {
                                    setRowsPerPage(prev => prev > 1 ? prev - 1 : prev)
                                }}>
                                    <FiMinus />
                                </Button>
                                <Button size='sm' color={"default"} variant='flat' onClick={() => setRowsPerPage(6)}>
                                    {rowsPerPage}
                                </Button>
                                <Button isIconOnly size='sm' color='success' variant='flat' onClick={() => {
                                    setRowsPerPage(prev => prev < 20 ? prev + 1 : prev)
                                }}>
                                    <FaPlus />
                                </Button>
                            </ButtonGroup>
                        </div>
                        <div className=' flex  justify-center items-center gap-4'>
                            <Button isIconOnly size='sm' color='danger' variant='flat' isDisabled={[...selectedKeys].length < 1} onClick={() => { handleDeleteSelected() }}>
                                <AiOutlineDelete />
                            </Button>
                            {/* <Button size='sm' color='success' variant='flat' onPress={()=>{handleDownload(sortedItems)}}>
                                <MdOutlineFileDownload />
                                download
                            </Button> */}
                            <Button size='sm' color='success' variant='flat' onPress={handleItemCreate}>
                                <FaPlus />
                                Add
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardBody >
                    <Table
                        isHeaderSticky
                        aria-label="Department"
                        removeWrapper
                        color={"success"}
                        selectionMode="multiple"
                        selectedKeys={selectedKeys}
                        onSelectionChange={setSelectedKeys}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    >
                        <TableHeader columns={headerColumns} >
                            {(column) => <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}
                                allowsSorting={column.sortable}>{column.label}</TableColumn>}
                        </TableHeader>
                        {items ? (
                            <TableBody emptyContent={<Spinner color='success' size='lg' label='not Found' />} items={sortedItems}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {
                                            (columnKey) => <TableCell>{RenderCell(item, columnKey)}</TableCell>
                                        }
                                    </TableRow>
                                )}
                            </TableBody>
                        ) : (
                            <TableBody emptyContent={<Spinner color='success' size='lg' label='loading...' />} items={[]}>
                            </TableBody>
                        )
                        }
                    </Table>
                </CardBody>
                <CardFooter className='FLEX-CENTER'>
                    <Pagination
                        showControls
                        showShadow
                        loop
                        size='lg'
                        color="success"
                        variant='light'
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </CardFooter>
                </>
                }
            </Card>
        </>
    )
}

export default TableCustomize