"use server";
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// Session duration (1 week)
const SESSION_DURATION = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  //  uid => is generateed by Auth of firebase's client SDK  by calling the createUserWithEmailAndPassword(auth,email,password) function
  const { uid, name, email } = params;

  try {
    // check if user exists in db
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists)
      return {
        success: false,
        message: "User already exists. Please sign in instead ",
      };

    // save user to db
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating a user:", error);

    // Handle Firebase specific errors
    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create an account. Please try again.",
    };
  }
}
// Set session cookie
export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  // Create session cookie
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_DURATION * 1000, // milliseconds
  });

  // Set cookie in the browser
  cookieStore.set("session", sessionCookie, {
    maxAge: SESSION_DURATION,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

// signIn  will generate a token which will be setted in browser's cookie
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord)
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    await setSessionCookie(idToken);
  } catch (error: any) {
    console.error(error);
    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// Sign out user by clearing the session cookie
export async function signOut() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

// Get current user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  //  getCurrentUser has return type PROMISE and Promise is a type of User and null
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;
  // if cookie doesn't exists return null
  if (!sessionCookie) return null;
  //  If cookie exists then flow goes like this
  try {
    // try to decode the session to check wheteher we have valid  user or not
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    // passing True in verifySessionCookie(true) to check wheteher session is revoked or not

    // get user info from db
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();
    if (!userRecord.exists) return null;
    //  if user exists then return object in which we spread the user data and also return id which is our uid
    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);

    // Invalid or expired session
    return null;
  }
}

// Check if user is authenticated and return type of thi s function  is boolean
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
