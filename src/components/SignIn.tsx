import Link from "next/link";
import { Icons } from "./Icons";
import UserAuthForm from "./UserAuthForm";

const SignIn = () => {
  return (
    <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px] relative z-[500]">
      <div className="flex flex-col space-y-2 text-center">
        <Icons.logo className="w-6 h-6 mx-auto" />
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm max-w-xs mx-auto">
          Pour continuer, vous devez créer un compte Breadit et agréer aux
          conditions d&apos;utilisation et à la politique de confidentialité.
        </p>

        {/* sign in form  */}
        <UserAuthForm />

        <p className="px-8 text-center text-sm text-zinc-700">
          Nouveau sur Breadit{" "}
          <Link
            href="/sign-up"
            className="hover:text-zinc-800 text-sm underline underline-offset-4"
          >
            S&apos;enregistrer
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
