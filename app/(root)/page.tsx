import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import InterviewCard from "../../components/InterviewCard";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const page = async ({ children }: { children: ReactNode }) => {
  const user = await getCurrentUser();
  if(!user){
    redirect("/login");
  }
  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);

  // const userInterviews = await getInterviewByUserId(user?.id!);
  // const latestInterviews=await getLatestInterviews({userId:user?.id!})
  

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Get Interview-ready with AI-powered practice session & feedback
          </h2>
          <p className="text-lg text-justify">
            Practice on real interviews questions and get instant feedback ,
            click below to prepare an interview according to your Skills
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Prepare an Interview </Link>
          </Button>
          {/* as child treat link as main tag not the button so all the css of the button applies to the Link tag.“Don’t make a <button> tag. Just apply your styles and behavior to the <a> inside.And this helps avoid wrong HTML and gives you more flexibility */}
        </div>
        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className="max-sm:hidden"
        ></Image>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.interviewId} />
            ))
          ) : (
            <p>You haven&apos;t take any interviews yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take any Interview to get a reality check </h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard {...interview} key={interview.interviewId} />
            ))
          ) : (
            <p> There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
