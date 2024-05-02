'use client'
import TableTest from '@/components/dashboard/TableTest'
import React from 'react'
import ItemDepartment from '@/components/dashboard/itemModal/ItemDepartment'
import { useSession } from 'next-auth/react'
const page = () => {
  const { data : session} = useSession()
  return (
    <TableTest Wrap={ItemDepartment} idModal={"department"} ColsShow={["name","hours"]} arrayCols={
      [{
        label: "Name",
        key : "name",
        sortable: true,
      },
      {
        label: "Hours",
        key : "hours",
        sortable: true,
      }
    ]
    }
    api={`/api/v1/institution/${session?.user?.institution}/department`} 
    />
  )
}

export default page