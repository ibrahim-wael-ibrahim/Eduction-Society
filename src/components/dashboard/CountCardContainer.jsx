'use client'
import {useEffect , useState} from 'react'
import CardNumber from '@/components/dashboard/CardNumber'
import { Card , CardBody  , Spinner} from '@nextui-org/react';
import CardArray from '@/utils/function/CardArray';
const CountCardContainer = () => {
  const cards = CardArray();
  const [loading , setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  
  return (
    <Card className='w-full min-h-[120px]' isBlurred>
      <CardBody className='w-full h-full flex flex-row flex-wrap justify-evenly items-center gap-8'>
        {
          loading ? <Spinner color='success' size='lg'  label='Loading...'/> :
            cards && cards.map((card) => (
              <CardNumber key={card.api} Icon={card.icon} title={card.title} api={card.api} />
            ))
           
        }
      </CardBody>
    </Card>
  );
}

export default CountCardContainer