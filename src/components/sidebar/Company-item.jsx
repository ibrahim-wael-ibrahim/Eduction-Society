import {Card, CardBody, Divider} from "@nextui-org/react";
import Logo from '../icons/logo';
const CompanyItem = () => {
  return (
    <>
    <Card className='w-full' isBlurred isPressable>
        <CardBody className=' flex justify-center items-center'>
        <div className="flex h-20 items-center space-x-4 text-small">
        <Logo size={50} />

        <Divider orientation="vertical" className='h-10' />

<div className='flex flex-col text-xl'>
<span className=' first-letter:text-green-400'>
    Eduction
</span>

<span className=' first-letter:text-green-400'>
    Society
</span>
</div>

      </div>
        </CardBody>
    </Card>
    </>
    )
}

export default CompanyItem