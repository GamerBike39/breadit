"use client";
import { UserNameRequest, UserNameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { FC } from "react";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

interface UserNameFormProps {
  user: Pick<User, "id" | "username">;
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserNameRequest>({
    resolver: zodResolver(UserNameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  const router = useRouter();

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UserNameRequest) => {
      const payload: UserNameRequest = { name };

      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "name already exists",
            description: "Please choose a different name",
            variant: "destructive",
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid name",
            description: "Please choose a name between 3 and 32 characters",
            variant: "destructive",
          });
        }

        toast({
          title: "An error occurred",
          description: "Please try again later",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      toast({
        title: "Name updated",
        description: "Your name has been updated",
        variant: "default",
      });
      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((e) => updateUsername(e))}>
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Please enter a display name you are confortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center ">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label htmlFor="name" className="sr-only">
              Username
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register("name")}
            />
            {errors?.name && (
              <p className="px-1 text-xs text-red-600">
                {errors?.name?.message?.replaceAll("name", "username") ||
                  "Invalid username"}
              </p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button isLoading={isLoading}>Change Name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
function loginToast(): unknown {
  throw new Error("Function not implemented.");
}
