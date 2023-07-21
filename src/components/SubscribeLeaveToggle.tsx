'use client';

import { FC, startTransition } from 'react';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToast } from '@/hooks/useCustomToast';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps {
    subRedditId : string,
    subRedditName : string,
    isSubscribed : boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subRedditId, subRedditName, isSubscribed }) => {
    
    const {loginToast} = useCustomToast();
    const router = useRouter();

    const {mutate: subscribe, isLoading : isSubLoading} = useMutation({
        mutationFn: async () => {
            const payload : SubscribeToSubredditPayload = {
                subRedditId
            }
            
            const { data } = await axios.post('/api/subreddit/subscribe', payload)

            return data as string
        },

        onError: (error) => {
            if(error instanceof AxiosError){
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title : 'There was a problem',
                description : 'There was a problem, please try again later',
                variant : 'destructive'
            })
        },

        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title : 'Subscribed',
                description : `You have subscribed to ${subRedditName}`,
            })
        },

    });
    const {mutate: unsubscribe, isLoading : isUnSubLoading} = useMutation({
        mutationFn: async () => {
            const payload : SubscribeToSubredditPayload = {
                subRedditId
            }
            
            const { data } = await axios.post('/api/subreddit/unsubscribe', payload)

            return data as string
        },

        onError: (error) => {
            if(error instanceof AxiosError){
                if (error.response?.status === 401) {
                    return loginToast()
                }
            }
            return toast({
                title : 'There was a problem',
                description : 'There was a problem, please try again later',
                variant : 'destructive'
            })
        },

        onSuccess: () => {
            startTransition(() => {
                router.refresh()
            })

            return toast({
                title : 'UnSubscribed',
                description : `You have unsubscribed from ${subRedditName}`,
            })
        },

    });
  
    return isSubscribed ? (
        <Button onClick={()=>unsubscribe()} isLoading={isUnSubLoading} className='w-full mb-4 mt-1'>Leave</Button>
    ) : (
        <Button onClick={()=>subscribe()} isLoading={isSubLoading} className='w-full mb-4 mt-1'>Join to post</Button>
    ); 

}

export default SubscribeLeaveToggle;