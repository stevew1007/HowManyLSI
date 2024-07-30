import { revalidatePath } from "next/cache";
import Parser from "~/components/block/parser";
import { SkillTable } from "~/components/block/skillTable";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  // CardDescription,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SeperatorWithLabel } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";
import { fetchAllSkillGroupsInfo } from "~/server/action";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Parser />
    </main>
  );
}
