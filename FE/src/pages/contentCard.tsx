import React from "react";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  children: React.ReactNode;
  className?: string;
  glassEffect?: boolean;
  hoverEffect?: boolean;
  glowEffect?: boolean;
}

export const ContentCard = ({
  children,
  className,
  glassEffect = false,
  hoverEffect = false,
  glowEffect = false,
}: ContentCardProps) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-aceternity-dark text-white p-6",
        glassEffect && "blur-card bg-opacity-80",
        hoverEffect && "content-card-hover",
        glowEffect && "card-glow",
        className,
      )}
    >
      {children}
    </div>
  );
};

export interface ContentRevealCardProps {
  title: string;
  description: string;
  revealText?: string;
}

export const ContentRevealCard = ({
  title,
  description,
  revealText,
}: ContentRevealCardProps) => {
  return (
    <ContentCard className="relative overflow-hidden group" glowEffect>
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity" />

      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 mb-4 text-sm">{description}</p>

      {revealText && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-aceternity-dark to-transparent p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
          <p className="text-white text-sm">{revealText}</p>
        </div>
      )}
    </ContentCard>
  );
};

export default ContentCard;
