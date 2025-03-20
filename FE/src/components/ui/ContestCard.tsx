import { motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Clock,
  ExternalLink,
  Youtube,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { CountdownTimer } from "./";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  createCalendarEventDescription,
  generateGoogleCalendarUrl,
} from "@/lib/calender";
import { cn } from "@/lib/utils";
import { CountdownTimer } from "../CountdownTimer";

type ContestProp = {
  id: string;
  platform: string;
  name: string;
  status: "Upcoming" | "ongoing" | "Finished";
  date: string;
  time: string;
  relativeTime: string;
  url: string;
  duration: string;
  solution?: string;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Kolkata",
  }).format(date);
};

export function ContestCard({
  contest,
  index,
}: {
  contest: ContestProp;
  index: number;
}) {
  const statusColors = {
    Upcoming: "bg-blue-100 text-blue-800 border border-blue-200",
    ongoing: "bg-green-100 text-green-800 border border-green-200",
    Finished: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  const statusIcons = {
    Upcoming: <Trophy className="h-3.5 w-3.5 mr-1" />,
    ongoing: <Clock className="h-3.5 w-3.5 mr-1" />,
    Finished: <Trophy className="h-3.5 w-3.5 mr-1" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="relative"
    >
      <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-t-4 border-t-blue-500">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              <span className="font-medium text-sm text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                {contest.platform}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  "text-xs px-2.5 py-1 rounded-full font-medium flex items-center",
                  statusColors[contest.status],
                )}
              >
                {statusIcons[contest.status]}
                {contest.status}
              </span>
            </div>
          </div>

          <h2 className="text-lg font-semibold mt-3 text-gray-900 line-clamp-2">
            {contest.name}
          </h2>
        </CardHeader>

        <CardContent className="space-y-4 pb-3">
          <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
            <div className="text-sm text-gray-500 mb-1 font-medium">Starts</div>
            <div className="flex items-center text-gray-700">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              <span className="font-medium">
                {formatDate(contest.date)} (IST)
              </span>
            </div>

            <div className="mt-3">
              <CountdownTimer targetDate={contest.date} />
            </div>
          </div>

          <div className="flex items-center text-gray-700 pl-1">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <div>
              <span className="text-sm text-gray-500 mr-1">Duration:</span>
              <span className="font-medium">{contest.duration}</span>
            </div>
          </div>

          {contest.status === "Upcoming" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              asChild
            >
              <a
                href={generateGoogleCalendarUrl(
                  contest.name,
                  createCalendarEventDescription(
                    contest.name,
                    contest.platform,
                    contest.solution,
                  ),
                  contest.url,
                  contest.time,
                  "30", // 30 minutes reminder
                )}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center justify-center gap-1.5"
              >
                <Bell className="h-4 w-4" />
                <span>Add to Calendar</span>
              </a>
            </Button>
          )}
        </CardContent>

        <CardFooter className="flex gap-2 pt-2 border-t">
          <Button
            variant="default"
            className="flex-1 bg-blue-500 hover:bg-blue-600"
            size="sm"
            asChild
          >
            <a
              href={contest.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <span>Visit Contest</span>
              <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
            </a>
          </Button>

          {contest.solution && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
              asChild
            >
              <a
                href={contest.solution}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center"
              >
                <span>Solution</span>
                <Youtube className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
