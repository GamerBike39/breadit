import { FC } from 'react';
import { User } from 'next-auth';
import { Avatar, AvatarFallback } from './ui/avatar';
import Image from 'next/image';
import { Icons } from './Icons';
import { AvatarProps } from '@radix-ui/react-avatar';

interface UserAvatarProps extends AvatarProps {
    user : Pick<User,  "name" |"image"> 
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
   <Avatar {...props}>
    {user.image ? (
        <div className='relative aspect-square w-full h-full'>
            <Image fill src={user.image} alt='profile picture' referrerPolicy='no-referrer' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
        </div>
    ) 
    : (
        <AvatarFallback>
            <span className='sr-only'>{user?.name}</span>
            <Icons.user className="h-4 w-4"/>
        </AvatarFallback> 
    )
    }
    </Avatar>
   );
}

export default UserAvatar;