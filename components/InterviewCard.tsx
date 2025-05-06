import React from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "../lib/utils";
import { Button } from "./ui/button";
import Link from "next/link";
import DisplayTechIcons from "./DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
const InterviewCard = async ({
  interviewId,
  userId,
  type,
  role,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  /* In TypeScript, this kind of type assertion (as Feedback | null) is often used when:
   1.You want to explicitly declare the type for clarity or for future assignment.
   2.You're initializing a variable with null, but you plan to assign a proper Feedback object to it later. 
   3. other way to do samething is => let feedback: Feedback | null = null;*/
  // const feedback = null as Feedback | null;
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({ interviewId, userId })
      : null;

  /* It checks if the string stored in the type variable contains the word “mix” (case-insensitive).
  1./mix/gi is a regular expression:
  2.mix matches the substring "mix".
  3.g means "global" (check all matches, though not really needed here).
  4.i means "case-insensitive" (so it matches "Mix", "MIX", etc.).
  5..test(type) returns true if the type string contains "mix" (in any case).
  6.If it does, normalizedType is set to "Mixed".
  7.If it does not, normalizedType is set to the original type. */
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const formatedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D,YYYY");
  return (
    <>
      <div className="card-border w-[360px] max-sm:w-full min-h-96">
        <div className="card-interview">
          <div>
            <div className="absolute top-0 right-0 w-fit px-4 py-2 rounded-bl-lg bg-light-600">
              <p className="badge-text">{normalizedType}</p>
            </div>
            <Image
              src={getRandomInterviewCover()}
              alt="cover-image"
              width={90}
              height={90}
              className="rounded-full object-fit size-14"
            />
            <h3 className="mt-5 capitalize">{role} Interview</h3>
            <div className="flex flex-row gap-5 mt-3">
              <div className="flex flex-row gap-2">
                <Image
                  src="/calendar.svg"
                  alt="calender"
                  width={22}
                  height={22}
                />
                <p>{formatedDate}</p>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Image src="star.svg" alt="star" width={22} height={22} />

                {/* ?? => nullish coalescing operator works on [null ,undefined, "  empty string ",0]
                    ?. => optional chaining 
                    || => fallback works on [null and undefined]
                    ? : => ternary opeartor   */}
                <p>{feedback?.totalScore ?? "---"}/100</p>
              </div>
            </div>
            <p className="line-clamp-2 mt-5">
              {feedback?.finalAssessment ??
                "You haven't taken the interview yet .Take it now  to improve your skills "}
            </p>
          </div>
          <div className="flex flex-row justify-between">
            {/* <p>Tech Icons</p> */}
            <DisplayTechIcons techStack={techstack} />
            <Button asChild className="bt-primary">
              <Link
                href={
                  feedback
                    ? `/interview/${interviewId}/feedback`
                    : `/interview/${interviewId}`
                }
              >
                {feedback ? "check feedback" : "Take Interview"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InterviewCard;
