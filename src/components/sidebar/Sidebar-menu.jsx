"use client"
import { Card , CardBody } from '@nextui-org/react'
import SidebarItem from './Sidebar-item'
import itemArray from '@/utils/function/itemArray'
const SidebarMenu = () => {

  return (
    <>
        <Card className='w-full' isBlurred>
            <CardBody>
                {itemArray() && itemArray().map((item, index) => (
                    <SidebarItem
                        key={index}
                        icon={item.icon}
                        title={item.title}
                        href={item.href}
                        isActive={item.active}
                    />
                ))}
            </CardBody>
        </Card>
    </>
  )
}

export default SidebarMenu