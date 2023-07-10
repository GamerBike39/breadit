'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/Button';
import { X } from 'lucide-react';


const CloseModal= () => {

    const router = useRouter();

    return (
   <Button variant="subtle" className='h-10 w-10 p-0 rounded-md' aria-label='close button' onClick={()=>router.back()}>
    <X className='h-4 w-4' />
   </Button>
   );
}

export default CloseModal;