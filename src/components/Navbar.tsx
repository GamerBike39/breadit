import  Link  from "next/link"
import { Icons } from "./Icons"
import { buttonVariants } from "./ui/Button"
import { getAuthSession } from "@/lib/auth"
import UserAccountNav from "./UserAccountNav"

const Navbar = async () => {

    const session = await getAuthSession()
 

    return (
        <div className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-zinc-300 z-[500] py-2">
            <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
                {/* logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Icons.logo className="w-8 h-8 sm:h-6 sm:w-6" />
                    <p className="hidden text-zinc-700 text-sm font-medium md:block">
                        Breadit
                    </p>
                </Link>
                {/* TODO search bar */}
                {/* search bar */}

                {/* auth */}
               {session?.user? (
                <p>
                    <UserAccountNav user={session.user} />
                </p>
               ) : (
                <Link href={'/sign-in'} className={buttonVariants()}>
                Sign In
            </Link>
               )}
            </div>
        </div>
    )
}

export default Navbar