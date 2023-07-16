import EditEditor from "@/components/EditEditor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface pageProps {
 params: {  
    id: string
 }
}

const page= async ({ params } : pageProps) => {

    
    const content = await db.post.findFirst({
        where: {
            id: params.id,
        },
        
    });

    if(!content) {
        return notFound();
    }

    content.authorId = content.authorId.toString();

    

   
  return (
   <div className="flex flex-col items-start gap-6">
       <div className="border-b border-gray-200 pb-5">
            <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
                <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
                    Update post
                </h3>
                <p className="ml-2 mt-1 truncate text-sm text-gray-500">
                  {content?.authorId}
                </p>
            </div>
       </div>

        {/* form */}
        <EditEditor  />

        <div className="flex w-full justify-end">
            <Button type="submit" className="w-full" form="subreddit-post-form">
                Post
            </Button>
        </div>

   </div>
   );
}

export default page;