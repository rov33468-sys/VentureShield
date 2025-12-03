import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RiskScoreGaugeProps {
  score: number;
  label: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

const RiskScoreGauge = ({ score, label, size = "md", animated = true }: RiskScoreGaugeProps) => {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);

  useEffect(() => {
    if (!animated) {
      setDisplayScore(score);
      return;
    }

    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, animated]);

  const sizeConfig = {
    sm: { width: 100, strokeWidth: 8, fontSize: "text-lg" },
    md: { width: 140, strokeWidth: 10, fontSize: "text-2xl" },
    lg: { width: 180, strokeWidth: 12, fontSize: "text-4xl" },
  };

  const { width, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (displayScore / 100) * circumference;

  const getScoreColor = (value: number) => {
    if (value >= 70) return "text-success stroke-success";
    if (value >= 40) return "text-warning stroke-warning";
    return "text-destructive stroke-destructive";
  };

  const getScoreLabel = (value: number) => {
    if (value >= 70) return "Low Risk";
    if (value >= 40) return "Medium Risk";
    return "High Risk";
  };

  const colorClass = getScoreColor(100 - score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg
          width={width}
          height={width}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={strokeWidth}
            className="opacity-30"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn("transition-all duration-300", colorClass)}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: circumference - progress,
            }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-bold", fontSize, colorClass.split(" ")[0])}>
            {displayScore}%
          </span>
          <span className="text-xs text-muted-foreground">{getScoreLabel(100 - score)}</span>
        </div>
      </div>
      <p className="mt-2 text-sm font-medium text-muted-foreground">{label}</p>
    </div>
  );
};

export default RiskScoreGauge;
