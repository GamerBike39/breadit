"use client";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import type EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import "@/styles/editor.css";
import { toast } from "./ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

interface EditEditorProps {
  postId: string;
  title: string;
  content: any;
  subRedditId: any;
}

const EditEditor: FC<EditEditorProps> = ({
  postId,
  title,
  content,
  subRedditId,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      postId,
      title: "",
      content: content,
      subRedditId,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLInputElement>();
  const pathname = usePathname();
  const router = useRouter();

  const initializedEditor = useCallback(async () => {
    const EditorJs = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJs({
        holder: "editeditor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Start...",
        inlineToolbar: true,
        data: {
          blocks: content?.blocks || [],
        },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          embed: Embed,
          table: Table,
          list: List,
          code: Code,
          inlineCode: InlineCode,
        },
      });
    }
  }, [content]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong ",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializedEditor();
      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializedEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subRedditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        title,
        content,
        subRedditId,
        postId,
      };
      const { data } = await axios.post("/api/subreddit/post/patch", payload);
      return data;
    },
    onError: (err) => {
      toast({
        title: "Something went wrong",
        description:
          "Maybe, you are not joined to this community ? Or try again later.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.back();
      router.refresh();
      return toast({
        description: "Your post has been published!",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subRedditId: subRedditId,
    };

    createPost(payload);
  }

  useEffect(() => {
    if (pathname === "/r/[slug]/edit/[id]") {
      _titleRef.current?.focus();
    }
    router.refresh();
  }, [pathname, router]);
  if (!isMounted) return null;

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={titleRef}
            id="title"
            defaultValue={title}
            value={title}
            {...rest}
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <hr />
          <div id="editeditor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default EditEditor;
