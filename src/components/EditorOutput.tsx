'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import Image from 'next/image';

const Output = dynamic(async () => (await import('editorjs-react-renderer')).default,{ ssr: false,})


interface EditorOutputProps {
 content : any
}

const style = {
  paragraph : {
    fontSize : '0.875rem',
    lineHeight : '1.25rem',
  }
}

const renderers = {
  image : CustomImageRenderer,
  // code : CustomCodeRenderer,
}

const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
  <Output data={content} style={style} className='text-sm' renderers={renderers} />
   );
}

function CustomImageRenderer({ data } : any) {
  const src = data.file.url;

  return (
    <div className='relative w-full min-h-[15rem]'>
      <Image src={src} alt="image" fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority />
    </div>
  )
}

function CustomCodeRenderer({ data } : any) {
  return (
    <pre className='bg-gray-800 p-4 rounded-md'>
      <code className='text-sm text-gray-100'>{data.code}</code>
    </pre>
  )
}

export default EditorOutput;