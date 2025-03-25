 
import { Code, Calendar, Award } from "lucide-react";
import HeroSection from "./HeroSection";
import { HeroScrollDemo } from "@/components/LandingPage/HeroScroll";
import { FeatureCard } from "@/components/LandingPage/FeatureCard";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <HeroScrollDemo />

        <section className="py-16 px-6 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Calendar className="h-8 w-8 text-primary" />}
                title="Contest Calendar"
                description="View all upcoming contests with dates, times, and countdown timers."
                delay={0}
              />
              <FeatureCard
                icon={<Code className="h-8 w-8 text-primary" />}
                title="Multi-Platform"
                description="Track contests from Codeforces, CodeChef, and LeetCode all in one place."
                delay={0.1}
              />
              <FeatureCard
                icon={<Award className="h-8 w-8 text-primary" />}
                title="Solutions"
                description="Access video solutions for past contests from our YouTube channel."
                delay={0.2}
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Contest Tracker. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
