'use client';
import { FC } from 'react';
import { User } from 'next-auth';
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuContent} from './ui/dropdown-menu';
import UserAvatar from './UserAvatar';
import Link from 'next/link';
import { signOut } from 'next-auth/react';

interface UserAccountNavProps {
 user : Pick<User, "name" | "email" | "image"> 
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  return (
  <DropdownMenu>
    <DropdownMenuTrigger>
        <UserAvatar
        className="w-10 h-10"
        user={{
            name: user.name || null,
            image: user.image || null
        }}/>
    </DropdownMenuTrigger>

    <DropdownMenuContent className='bg-white' align='end'>
        <div className='flex items-center justify-start gap-2 p-2 '>
            <div className='flex flex-col space-y-1 leading-none'>
                {user.name && 
                <p className='font-medium'>
                    {user.name}
                </p>}
                {user.email &&
                <p className='text-sm text-zinc-700 w-[200px]'>
                    {user.email}
                </p>}

            </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
                <Link href='/'>
                    Feed
                </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
                <Link href='/r/create'>
                    Create community
                </Link>
        </DropdownMenuItem>
       
        <DropdownMenuItem asChild>
                <Link href='/settings'>
                    Settings
                </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
        onSelect={(event) => {
            event.preventDefault()
            signOut({
                callbackUrl: `${window.location.origin}/sign-in}`
            })
        }}
        className='cursor-pointer'>
            Sign out
        </DropdownMenuItem>
    
    </DropdownMenuContent>

  </DropdownMenu>
   );
}

export default UserAccountNav;