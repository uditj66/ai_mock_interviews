// "use client";

// import { z } from "zod";
// import Link from "next/link";
// import Image from "next/image";
// import { toast } from "sonner";
// import { auth } from "@/firebase/client";
// import { useForm } from "react-hook-form";
// import { useRouter } from "next/navigation";
// import { zodResolver } from "@hookform/resolvers/zod";

// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
// } from "firebase/auth";

// import { Form } from "@/components/ui/form";
// import { Button } from "@/components/ui/button";

// import { signIn, signUp } from "@/lib/actions/auth.action";
// import FormField from "./FormField";

// const authFormSchema = (type: FormType) => {
//   return z.object({
//     name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
//     email: z.string().email(),
//     password: z.string().min(3),
//   });
// };

// const AuthForm = ({ type }: { type: FormType }) => {
//   const router = useRouter();

//   const formSchema = authFormSchema(type);
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: z.infer<typeof formSchema>) => {
//     try {
//       if (type === "sign-up") {
//         const { name, email, password } = data;

//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );

//         const result = await signUp({
//           uid: userCredential.user.uid,
//           name: name!,
//           email,
//           password,
//         });

//         if (!result.success) {
//           toast.error(result.message);
//           return;
//         }

//         toast.success("Account created successfully. Please sign in.");
//         router.push("/sign-in");
//       } else {
//         const { email, password } = data;

//         const userCredential = await signInWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );

//         const idToken = await userCredential.user.getIdToken();
//         if (!idToken) {
//           toast.error("Sign in Failed. Please try again.");
//           return;
//         }

//         await signIn({
//           email,
//           idToken,
//         });

//         toast.success("Signed in successfully.");
//         router.push("/");
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(`There was an error: ${error}`);
//     }
//   };

//   const isSignIn = type === "sign-in";

//   return (
//     <div className="card-border lg:min-w-[566px]">
//       <div className="flex flex-col gap-6 card py-14 px-10">
//         <div className="flex flex-row gap-2 justify-center">
//           <Image src="/logo.svg" alt="logo" height={32} width={38} />
//           <h2 className="text-primary-100">PrepWise</h2>
//         </div>

//         <h3>Practice job interviews with AI</h3>

//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="w-full space-y-6 mt-4 form"
//           >
//             {!isSignIn && (
//               <FormField
//                 control={form.control}
//                 name="name"
//                 label="Name"
//                 placeholder="Your Name"
//                 type="text"
//               />
//             )}

//             <FormField
//               control={form.control}
//               name="email"
//               label="Email"
//               placeholder="Your email address"
//               type="email"
//             />

//             <FormField
//               control={form.control}
//               name="password"
//               label="Password"
//               placeholder="Enter your password"
//               type="password"
//             />

//             <Button className="btn" type="submit">
//               {isSignIn ? "Sign In" : "Create an Account"}
//             </Button>
//           </form>
//         </Form>

//         <p className="text-center">
//           {isSignIn ? "No account yet?" : "Have an account already?"}
//           <Link
//             href={!isSignIn ? "/sign-in" : "/sign-up"}
//             className="font-bold text-user-primary ml-1"
//           >
//             {!isSignIn ? "Sign In" : "Sign Up"}
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AuthForm;
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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase/client";

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
      </div>
    </div>
  );
};

export default AuthForm;
