"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth, googleProvider } from "@/firebase/client";
import { handleGoogleAuth } from "@/lib/actions/auth.action";
import { signIn, signUp } from "@/lib/actions/auth.action";

const authFormSchema = (type: FormType) => {
  return z.object({
    name:
      type === "sign-up" ? z.string().min(3).max(10) : z.string().optional(),
    email: z.string().email(),
    password: z.string().min(3).max(12),
  });
};
const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await handleGoogleAuth({
        uid: user.uid,
        email: user.email!,
        name: user.displayName || "Anonymous",
        idToken,
      });

      if (!res?.success) {
        toast.error(res.message);
        return;
      }

      toast.success("Signed in with Google!");
      router.push("/");
    } catch (error) {
      console.error("Google sign-in failed:", error);
      toast.error("Google Sign-In failed");
    }
  };

  // z.infer<typeof formSchema>  this line tells TypeScript that "I want to use the shape (types) of formSchema to type my form."
  // type formValues={
  //   name:string ,
  //   email:string,
  //   password:string
  // }
  type formValues = z.infer<typeof formSchema>;
  // 1. define your form
  // const form = useForm<formValues>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     name: "",
  //     email: "",
  //     password: "",
  //   },
  // });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // function onSubmit(values: formValues) {
    try {
      if (type === "sign-up") {
        // console.log("'Signed-up", values);

        // flow of authentication of user goes like this
        const { name, email, password } = values;
        const userCredentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // signing-up the user goes like this
        const result = await signUp({
          uid: userCredentials.user.uid,
          name: name!,
          email: email,
          password: password,
        });
        if (!result?.success) {
          toast.error(result?.message);
        }
        toast.success("Account created Successfully .Please sign-In");
        router.push("/sign-in");
        // toast.loading("wait a minute") loading toast to process the data
      } else {
        const { email, password } = values;
        // signInWithEmailAndPassword() function gives us userCredentials ,out of which we retrieve idToken by userCredentials.user.getIdToken()and passes it to signIn function
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const idToken = await userCredentials.user.getIdToken();
        if (!idToken) {
          toast.error("Sign-In failed");
          return;
        }
        await signIn({
          email,
          idToken,
        });
        // console.log("Signed-In", values);
        toast.success("Signed-In successfully");
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      toast.error(`There was an error:${error}`);
    }
  }
  const isSignIn = type === "sign-in";
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col items-center gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center ">
          <Image src="logo.svg" alt="logo" height={50} width={45} />
          <h2 className="text-primary-100 ">PrepWise</h2>
        </div>
        <h3>Practice job interview with Ai</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="name"
                label="Name :"
                placeholder="Your Name"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email :"
              placeholder="Your Email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Password :"
              placeholder="Your password"
              type="password"
            />

            <Button className="btn" type="submit">
              {isSignIn ? "Sign-In" : "Create an Account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "Not Have Account Yet !" : "Already Have An Account ?"}
          <Link
            href={!isSignIn ? "/sign-in" : "/sign-up"}
            className="font-bold text-user-primary ml-1"
          >
            {!isSignIn ? "Click to Sign-in" : " Click to Sign-up"}
          </Link>
        </p>
        <hr className="bg-white" />
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex justify-center items-center gap-2.5 bg-white border border-gray-25 rounded-4xl py-4 text-base text-dark-100 font-semibold cursor-pointer -tracking-[0.8px];"
        >
          <Image
            src={"/google.svg"}
            alt="google"
            width={32}
            height={32}
          ></Image>
          Sign-in With Google
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
