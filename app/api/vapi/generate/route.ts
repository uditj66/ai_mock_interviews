import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { google } from "@ai-sdk/google";
import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";
export async function GET() {
  return NextResponse.json(
    {
      success: true,
      data: "Thank You",
    },
    { status: 200 }
  );
}
export async function POST(req: NextRequest) {
  const { type, role, level, techstack, amount, userid, coverimage } =
    await req.json();
  try {
    const { text: questionsFromAi } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]

        Thank you! <3
    `,
    });

    // generate text return an object with various key-value pair.Most of the time we are interested in firstkey called as text which is a string ,here in our prompt we request ai to return the text in string of question array so that'why we use JSON.parse(questionFromAi) so that we can iterrate over the array
    const interview = {
      role,
      type,
      level,
      //techstack is an string seperated by comma so split(",") function return an array where each index contain the value seperated by(,) in the string
      techstack: techstack.split(","),
      /*'["Pizza", "Burger"]' → is a string.
        ["Pizza", "Burger"] → is an array.
        JSON.parse(...) converts string → actual array or object or whatever is inside.*/

      questions: JSON.parse(questionsFromAi),
      userId: userid,
      finalized: true,
      coverimage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);
    return NextResponse.json(
      {
        success: true,
        message: "Interview created successfully",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: error,
      },
      {
        status: 500,
      }
    );
  }
}

