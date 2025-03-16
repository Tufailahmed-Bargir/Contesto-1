import { useState, useEffect } from "react";
import { fetchAllContests } from "@/lib/api";
import { Contest } from "@/lib/types";
import ContestCard from "@/components/ContestCard";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, Filter, List, Search } from "lucide-react";

const PastContests = () => {
  const [pastContests, setPastContests] = useState<Contest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "oldest">("recent");
  const { toast } = useToast();

  const itemsPerPage = 9;

  // Fetch all contests
  useEffect(() => {
    const fetchContests = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const allContests = await fetchAllContests();

        // Filter to only completed contests
        const completed = allContests.filter(
          (contest) => contest.status === "completed",
        );

        setPastContests(completed);

        toast({
          title: "Success",
          description: `Loaded ${completed.length} past contests`,
          duration: 2000,
        });
      } catch (error) {
        console.error("Error fetching past contests:", error);
        setError("Failed to fetch past contests. Please try again later.");
        toast({
          title: "Error",
          description: "Failed to fetch past contests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContests();
  }, [toast]);

  // Filter contests based on search
  const filteredContests = pastContests.filter((contest) =>
    contest.name.toLowerCase().includes(search.toLowerCase()),
  );

  // Sort contests
  const sortedContests = [...filteredContests].sort((a, b) => {
    const aDate = new Date(a.startTime);
    const bDate = new Date(b.startTime);

    return sortBy === "recent"
      ? bDate.getTime() - aDate.getTime()
      : aDate.getTime() - bDate.getTime();
  });

  // Paginate contests
  const totalPages = Math.ceil(sortedContests.length / itemsPerPage);
  const paginatedContests = sortedContests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Past Coding Contests</h1>
        <p className="text-lg text-foreground/70">
          Browse through completed contests from various platforms
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contests..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex gap-2 items-center">
          <Tabs defaultValue="recent" className="w-[200px]">
            <TabsList>
              <TabsTrigger value="recent" onClick={() => setSortBy("recent")}>
                Recent First
              </TabsTrigger>
              <TabsTrigger value="oldest" onClick={() => setSortBy("oldest")}>
                Oldest First
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <Calendar className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode("table")}
            className={
              viewMode === "table" ? "bg-primary text-primary-foreground" : ""
            }
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <motion.div
          className="p-4 mb-6 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p>{error}</p>
          <Button
            variant="destructive"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Try Again
          </Button>
        </motion.div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="glass-card rounded-xl p-5 animate-pulse h-64"
            />
          ))}
        </div>
      ) : (
        <>
          {filteredContests.length === 0 ? (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xl text-foreground/70">
                No past contests found matching your criteria
              </p>
              <Button onClick={() => setSearch("")} className="mt-4">
                Clear Search
              </Button>
            </motion.div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedContests.map((contest, index) => (
                    <ContestCard
                      key={contest.id}
                      contest={contest}
                      index={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Contest Name</TableHead>
                        <TableHead>Platform</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedContests.map((contest) => (
                        <TableRow key={contest.id}>
                          <TableCell className="font-medium">
                            {contest.name}
                          </TableCell>
                          <TableCell className="capitalize">
                            {contest.platform}
                          </TableCell>
                          <TableCell>{formatDate(contest.startTime)}</TableCell>
                          <TableCell>
                            {Math.floor(contest.duration / 3600)} hours{" "}
                            {Math.floor((contest.duration % 3600) / 60)} minutes
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={contest.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Visit
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {totalPages > 1 && (
                <Pagination className="mt-8">
                  <PaginationContent>
                    {currentPage > 1 && (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                        />
                      </PaginationItem>
                    )}

                    {[...Array(totalPages)].map((_, i) => {
                      // Show first, last, and current page, plus one page before and after current
                      const pageNum = i + 1;
                      if (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - 1 &&
                          pageNum <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={i}>
                            <PaginationLink
                              isActive={pageNum === currentPage}
                              onClick={() => setCurrentPage(pageNum)}
                            >
                              {pageNum}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <PaginationItem key={i}>...</PaginationItem>;
                      }
                      return null;
                    })}

                    {currentPage < totalPages && (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages),
                            )
                          }
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PastContests;
