"use client";
import { SkillTable } from "~/components/block/skillTable";
import { Button } from "~/components/ui/button";
import { SeperatorWithLabel } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

// Server actions
import { fetchAllSkillGroupsInfo, fetchAllSkillInfo } from "~/server/action";

export default function Parser() {
  //   const skillGroups = await fetchAllSkillGroupsInfo();
  //   console.log("skillGroups::: ", skillGroups);

  const handleClick = async () => {
    //   "use server";
    // console.log(e);
    // const ret = await fetchAllSkillInfo();
    // console.log("ret::: ", ret);
  };

  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          {/* <CardDescription>
            Paste the skill list you want to learn...
          </CardDescription> */}
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-1 md:gap-2">
          <p className="text-sm text-slate-400">
            Paste the skill you need from skill plan or queue.
          </p>
          <Textarea placeholder="" />
          <Button
            size="sm"
            className="mt-2"
            // onClick={() => handleClick()}
            onClick={() => handleClick()}
          >
            Parse
          </Button>
          {/* <div className="relative py-4 align-middle">
            <Separator className="absolute inset-0 my-auto flex items-center" />
            <div className="relative flex justify-center">
              <span className="bg-white px-2 text-sm text-slate-400 md:px-4">
                results
              </span>
            </div>
          </div> */}
          <SeperatorWithLabel className="py-5">Results</SeperatorWithLabel>
          {/* <SkillTable /> */}
        </CardContent>
      </Card>
    </>
  );
}
