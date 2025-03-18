// import { useState } from "react";
// import { Contest } from "@/lib/types";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useToast } from "@/components/ui/use-toast";
// import { saveSolutionUrl } from "@/lib/api";
// import { motion } from "framer-motion";
// import { Check, Youtube } from "lucide-react";
// import { useRecoilStateLoadable, useRecoilValueLoadable } from "recoil";
// import { updateLink } from "@/store/atoms/atom";

// interface SolutionFormProps {
//   contests: Contest[];
// }

// const SolutionForm = ({ contests }: SolutionFormProps) => {
  
//   const [selectedContestId, setSelectedContestId] = useState<string>("");
//   const [solutionUrl, setSolutionUrl] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
//   const [success, setSuccess] = useState<boolean>(false);
//   const { toast } = useToast();
//   const selectedContest = contests.find((c) => c.id === selectedContestId);
//   console.log("selected contest is", selectedContest);
//   console.log("selected contest id is", selectedContestId);
//   const data = {
//     link:solutionUrl,
//     id:selectedContestId
//   }
//   const [item] = useRecoilStateLoadable(updateLink(data));


//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!selectedContestId || !solutionUrl) {
//       toast({
//         title: "Error",
//         description: "Please select a contest and enter a solution URL",
//         variant: "destructive",
//       });
//       return;
//     }

//     // Validate YouTube URL
//     if (
//       !solutionUrl.includes("youtube.com") &&
//       !solutionUrl.includes("youtu.be")
//     ) {
//       toast({
//         title: "Error",
//         description: "Please enter a valid YouTube URL",
//         variant: "destructive",
//       });
//       return;
//     }

//     setIsSubmitting(true);

//     try {
     
// console.log('link updates success', item.contents);
     
//       saveSolutionUrl(selectedContestId, solutionUrl);

//       // Show success message
//       setSuccess(true);
//       toast({
//         title: "Success",
//         description: "Solution URL saved successfully",
//       });

//       // Reset form after 2 seconds
//       setTimeout(() => {
//         setSelectedContestId("");
//         setSolutionUrl("");
//         setSuccess(false);
//       }, 2000);
//     } catch (error) {
//       console.error("Error saving solution URL:", error);
//       toast({
//         title: "Error",
//         description: "Failed to save solution URL",
//         variant: "destructive",
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <motion.div
//       className="glass-card rounded-xl p-6"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <h2 className="text-2xl font-bold mb-6">Add Solution URL</h2>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="space-y-2">
//           <Label htmlFor="contest">Select Contest</Label>
//           <Select
//             value={selectedContestId}
//             onValueChange={setSelectedContestId}
//           >
//             <SelectTrigger id="contest" className="w-full">
//               <SelectValue placeholder="Select a completed contest" />
//             </SelectTrigger>
//             <SelectContent>
//               {contests.length === 0 ? (
//                 <SelectItem value="none" disabled>
//                   No completed contests available
//                 </SelectItem>
//               ) : (
//                 contests.map((contest) => (
//                   <SelectItem key={contest.id} value={contest.id}>
//                     {contest.name} ({contest.platform})
//                   </SelectItem>
//                 ))
//               )}
//             </SelectContent>
//           </Select>
//         </div>

//         {selectedContest && (
//           <motion.div
//             className="p-4 rounded-lg bg-secondary/20"
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//           >
//             <p className="font-medium">{selectedContest.name}</p>
//             <p className="text-sm text-muted-foreground">
//               Platform: {selectedContest.platform}
//             </p>
//             <p className="text-sm text-muted-foreground">
//               Date: {new Date(selectedContest.startTime).toLocaleDateString()}
//             </p>
//             {selectedContest.solutionUrl && (
//               <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-2">
//                 This contest already has a solution URL
//               </p>
//             )}
//           </motion.div>
//         )}

//         <div className="space-y-2">
//           <Label htmlFor="solutionUrl">YouTube Solution URL</Label>
//           <div className="flex">
//             <div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
//               <Youtube className="h-4 w-4 text-red-500" />
//             </div>
//             <Input
//               id="solutionUrl"
//               placeholder="https://youtube.com/watch?v=..."
//               value={solutionUrl}
//               onChange={(e) => setSolutionUrl(e.target.value)}
//               className="rounded-l-none"
//             />
//           </div>
//         </div>

//         <Button
//           type="submit"
//           className="w-full"
//           disabled={isSubmitting || !selectedContestId || !solutionUrl}
//         >
//           {isSubmitting ? (
//             "Saving..."
//           ) : success ? (
//             <>
//               <Check className="mr-2 h-4 w-4" /> Saved Successfully
//             </>
//           ) : (
//             "Save Solution URL"
//           )}
//         </Button>
//       </form>
//     </motion.div>
//   );
// };

// export default SolutionForm;




import { useState } from "react";
import { Contest } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { Check, Youtube } from "lucide-react";
import useUpdateContest from "@/hooks/UpdateLink";
// import useUpdateContest from "@/hooks/useUpdateContest";

interface SolutionFormProps {
  contests: Contest[];
}

const SolutionForm = ({ contests }: SolutionFormProps) => {
  const [selectedContestId, setSelectedContestId] = useState<string>("");
  const [solutionUrl, setSolutionUrl] = useState<string>("");
  const { toast } = useToast();
  const { updateContestSolution, isLoading, success, error } = useUpdateContest();

  const selectedContest = contests.find((c) => c.id === selectedContestId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedContestId || !solutionUrl) {
      toast({
        title: "Error",
        description: "Please select a contest and enter a solution URL",
        variant: "destructive",
      });
      return;
    }

    // Validate YouTube URL
    if (
      !solutionUrl.includes("youtube.com") &&
      !solutionUrl.includes("youtu.be")
    ) {
      toast({
        title: "Error",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      });
      return;
    }

    await updateContestSolution(selectedContestId, solutionUrl);

    if (success) {
      toast({
        title: "Success",
        description: "Solution URL updated successfully!",
      });

      setTimeout(() => {
        setSelectedContestId("");
        setSolutionUrl("");
      }, 2000);
    }
  };

  return (
    <motion.div
      className="glass-card rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold mb-6">Add Solution URL</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contest">Select Contest</Label>
          <Select
            value={selectedContestId}
            onValueChange={setSelectedContestId}
          >
            <SelectTrigger id="contest" className="w-full">
              <SelectValue placeholder="Select a completed contest" />
            </SelectTrigger>
            <SelectContent>
              {contests.length === 0 ? (
                <SelectItem value="none" disabled>
                  No completed contests available
                </SelectItem>
              ) : (
                contests.map((contest) => (
                  <SelectItem key={contest.id} value={contest.id}>
                    {contest.name} ({contest.platform})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="solutionUrl">YouTube Solution URL</Label>
          <div className="flex">
            <div className="bg-muted flex items-center px-3 rounded-l-md border-y border-l">
              <Youtube className="h-4 w-4 text-red-500" />
            </div>
            <Input
              id="solutionUrl"
              placeholder="https://youtube.com/watch?v=..."
              value={solutionUrl}
              onChange={(e) => setSolutionUrl(e.target.value)}
              className="rounded-l-none"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !selectedContestId || !solutionUrl}
        >
          {isLoading ? (
            "Saving..."
          ) : success ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Saved Successfully
            </>
          ) : (
            "Save Solution URL"
          )}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </motion.div>
  );
};

export default SolutionForm;
