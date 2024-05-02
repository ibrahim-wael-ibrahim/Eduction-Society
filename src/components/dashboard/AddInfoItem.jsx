"use client"
import React from 'react'
import { Card  } from '@nextui-org/react'
import ModalContainer from '../UI/ModalContainer';
const AddInfoItem = ({title , Icon , id , Wrap}) => {
    const { ModalUI:ItemCreate , handleOpen: handleItemCreate } = ModalContainer(id);
    return (
    <>
    <ItemCreate title={title}>
        <Wrap/>
    </ItemCreate>
    <Card className='w-full h-full  FLEX-CENTER' isBlurred isPressable onPress={handleItemCreate}>
    <Icon size={32} />
    <span className='capitalize first-letter:text-green-500 text-center'>{title}</span>
</Card>
</>
  )
}

export default AddInfoItem