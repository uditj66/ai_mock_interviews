import { Button } from "../../components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react";
import { dummyInterviews } from "../../constants";
import InterviewCard from "../../components/InterviewCard";

const page = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Get Interview-ready with AI-powered practice session & feedback
          </h2>
          <p className="text-lg">
            Practice on real interviews questions and get instant feedback
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
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
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
          {/* <p>You haven&apos;t take any interviews yet</p> */}
        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take any Interview</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard {...interview} key={interview.id} />
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
