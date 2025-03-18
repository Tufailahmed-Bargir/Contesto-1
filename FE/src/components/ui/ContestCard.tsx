 
 
import { useRecoilValue } from "recoil";
import { motion } from "framer-motion";
import {
   
  Calendar,
  Clock,
  ExternalLink,
  Youtube,
} from "lucide-react";
import ButtonCTA from "@/pages/CTAButton";
type ContestProp = {
    id: string;
    platform: string;
    name: string;
    status: "upcoming" | "ongoing" | "completed";
    date: string;
    time: string;
    relativeTime: string;
    url: string;
    duration:string,
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
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
    };
  
    return (
      <motion.div
        className="bg-white shadow-lg rounded-2xl p-6 space-y-4 transition-all hover:shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
      >
        <div className="flex justify-between items-start">
          <span className="text-gray-500 text-sm">{contest.platform}</span>
  
          <div className="flex items-center space-x-2">
            <span
              className={`text-xs px-2 py-1 rounded-lg ${statusColors[contest.status]}`}
            >
              {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
            </span>
  
          
          </div>
        </div>
  
        <h2 className="text-lg font-semibold text-gray-900">{contest.name}</h2>
  
  <p> Starts </p>
        <div className="text-gray-500 text-sm flex items-center">
         
          <Calendar className="h-4 w-4 mr-2" /> {formatDate(contest.date)} (IST)
        </div>
  
  <p>Duration</p>
        <div className="text-gray-500 text-sm flex items-center">
          <Clock className="h-4 w-4 mr-2" /> {contest.duration}
        </div>
  
        {contest.status === "upcoming" && (
          <div className="text-blue-600 text-sm font-medium">
            Starts {contest.relativeTime}
          </div>
        )}
  
  <div className="flex justify-between">
  
  <ButtonCTA variant="secondary" size="lg">
  
       
        <a
          href={contest.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 text-sm font-medium flex items-center hover:underline"
        >
          Visit Contest <ExternalLink className="h-4 w-4 ml-1" />
        </a>
        </ButtonCTA>
  
        <ButtonCTA variant="secondary" size="lg">
          <a
            href={contest.solution}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-red-600 dark:text-red-400 flex items-center hover:underline"
          >
            Solution <Youtube className="h-3 w-3 ml-1" />
          </a>
          </ButtonCTA>
          </div>
      
      </motion.div>
    );
  }