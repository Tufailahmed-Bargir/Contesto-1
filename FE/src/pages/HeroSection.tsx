import React, { useEffect, useRef } from "react";

import { ArrowRight } from "lucide-react";
import ContentCard from "./contentCard";
import ButtonCTA from "./CTAButton";
import UserAvatars from "./avatars";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headingRef.current) {
      const heading = headingRef.current;
      const text = heading.innerText;
      heading.innerHTML = "";

      Array.from(text).forEach((char, i) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.setProperty("--index", i.toString());
        span.className = "reveal-text";
        heading.appendChild(span);
      });
    }
  }, []);

  return (
    <section className="min-h-screen pt-32 pb-16 grid-pattern relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 animated-gradient" />

      {/* Small Badge */}
      <div className="container mx-auto px-6 md:px-8">
        <div className="animate-slide-in mb-6 inline-flex">
          <div className="bg-white dark:bg-gray-800 text-xs md:text-sm border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full font-medium flex items-center gap-2 shadow-sm">
            <span className="text-gray-500 dark:text-gray-400">
              Introducing Contesto
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Left Content - 3 columns */}
          <div className="lg:col-span-3 space-y-8 z-10">
            {/* Main Heading */}
            <h1
              ref={headingRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Your Ultimate Coding Contest Tracker!
            </h1>

            {/* Subheading */}
            <p
              className="text-gray-600 dark:text-gray-400 text-lg md:text-xl max-w-2xl animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              Never miss a coding contest again. Track upcoming, ongoing, and
              past contests from Codeforces, CodeChef, and LeetCode in one
              place.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <ButtonCTA variant="secondary" size="lg">
                <Link to={"/dashboard"}>Get Started</Link>
              </ButtonCTA>
              <ButtonCTA variant="secondary" size="lg">
                 <a target="_blank" href={"https://github.com/Tufailahmed-Bargir/Contesto-1"}> Documentation</a>
              </ButtonCTA>
            </div>
          </div>

          {/* Right Content - 2 columns */}
          <div
            className="lg:col-span-2 space-y-6 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {/* Dark Card */}
            <ContentCard glowEffect className="mb-6">
              <h3 className="text-xl font-semibold mb-1">
                One Dashboard for Every Coding Contest!
              </h3>
              <p className="text-gray-400 mb-3 text-sm">
                Track contests from Codeforces, LeetCode, CodeChef, and more!
              </p>

              <div className="relative mt-6 h-16 overflow-hidden rounded-lg bg-gray-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">
                    ✅ Stay updated with upcoming contests <br />
                    ✅ Set reminder to a contest <br />✅ Compete & climb the
                    leaderboard
                  </p>
                </div>
              </div>
            </ContentCard>

            <div
              className="flex items-center gap-3 mb-6 animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            >
              <UserAvatars />
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Joined by 20k+ developers
              </div>
            </div>

            {/* Showcase Images */}
            <div
              className="grid grid-cols-2 gap-4 animate-fade-in"
              style={{ animationDelay: "0.7s" }}
            >
              <div className="bg-blue-500 rounded-xl aspect-square p-3 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600" />
                <div className="relative z-10 text-white font-medium text-center">
                  <p className="text-lg font-bold">LeetCode</p>
                  <p className="text-xl font-bold">CodeChef</p>
                  <p className="text-lg font-bold">CodeForces</p>
                </div>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-2">
                <img
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
                  alt="Work example 1"
                  className="rounded-lg object-cover aspect-square animate-image-reveal"
                  style={{ animationDelay: "0.8s" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
                  alt="Work example 2"
                  className="rounded-lg object-cover aspect-square animate-image-reveal"
                  style={{ animationDelay: "0.9s" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
                  alt="Work example 3"
                  className="rounded-lg object-cover aspect-square animate-image-reveal"
                  style={{ animationDelay: "1s" }}
                />
                <img
                  src="https://images.unsplash.com/photo-1483058712412-4245e9b90334?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80"
                  alt="Work example 4"
                  className="rounded-lg object-cover aspect-square animate-image-reveal"
                  style={{ animationDelay: "1.1s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
