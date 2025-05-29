import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import InterviewCard from "../../components/InterviewCard";
import ClientPagination from "../../components/ClientPagination";
import {
  getInterviewByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { redirect } from "next/navigation";

const ITEMS_PER_PAGE = 6;

const page = async ({
  searchParams,
}: {
  searchParams: {
    userPage?: string;
    latestPage?: string;
  };
}) => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const userPage = Number(searchParams.userPage) || 1;
  const latestPage = Number(searchParams.latestPage) || 1;

  const [userInterviews, latestInterviews] = await Promise.all([
    await getInterviewByUserId(user?.id!),
    await getLatestInterviews({ userId: user?.id! }),
  ]);

  // const userInterviews = await getInterviewByUserId(user?.id!);
  // const latestInterviews=await getLatestInterviews({userId:user?.id!})

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  // Calculate pagination for user interviews
  const userTotalPages = Math.ceil(
    (userInterviews?.length || 0) / ITEMS_PER_PAGE
  );
  const userStartIndex = (userPage - 1) * ITEMS_PER_PAGE;
  const userEndIndex = userStartIndex + ITEMS_PER_PAGE;
  const paginatedUserInterviews = userInterviews?.slice(
    userStartIndex,
    userEndIndex
  );

  // Calculate pagination for latest interviews
  const latestTotalPages = Math.ceil(
    (latestInterviews?.length || 0) / ITEMS_PER_PAGE
  );
  const latestStartIndex = (latestPage - 1) * ITEMS_PER_PAGE;
  const latestEndIndex = latestStartIndex + ITEMS_PER_PAGE;
  const paginatedLatestInterviews = latestInterviews?.slice(
    latestStartIndex,
    latestEndIndex
  );

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
          {/* as child treat link as main tag not the button so all the css of the button applies to the Link tag.“Don't make a <button> tag. Just apply your styles and behavior to the <a> inside.And this helps avoid wrong HTML and gives you more flexibility */}
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
            <>
              {paginatedUserInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.interviewId} />
              ))}
              <div className="w-full flex justify-center mt-6">
                <ClientPagination
                  currentPage={userPage}
                  totalPages={userTotalPages}
                  paramName="userPage"
                />
              </div>
            </>
          ) : (
            <p>You haven&apos;t take any interviews yet</p>
          )}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take any Interview to get a reality check </h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            <>
              {paginatedLatestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.interviewId} />
              ))}
              <div className="w-full flex justify-center mt-6">
                <ClientPagination
                  currentPage={latestPage}
                  totalPages={latestTotalPages}
                  paramName="latestPage"
                />
              </div>
            </>
          ) : (
            <p> There are no new interviews available</p>
          )}
        </div>
      </section>
    </>
  );
};

export default page;
