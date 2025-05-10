// LazyLoadedQuestionChart.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // and your CustomTooltip

// eslint-disable-next-line no-unused-vars
const LazyLoadedQuestionChart = ({ questionData, CustomTooltipComponent }) => {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef(null);

  useEffect(() => {
    const currentRef = placeholderRef.current; // Capture the ref's value
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(placeholderRef.current); // Important: stop observing once loaded
        }
      },
      { rootMargin: "100px" }
    ); // Load when 100px away from viewport

    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  if (!isVisible) {
    return (
      <div
        ref={placeholderRef}
        style={{
          height: "160px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Loading Chart...
      </div>
    ); // Matches your h-40
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={questionData.data} isAnimationActive={false}>
        {" "}
        {/* Apply isAnimationActive */}
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip content={<CustomTooltipComponent />} />
        <Bar
          dataKey="count"
          fill="#6366F1"
          radius={[4, 4, 0, 0]}
          barSize={20}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default LazyLoadedQuestionChart;

// In GradeDistributionCharts.js:
// {questionGradeData.map((question) => (
//   <div key={question.questionNumber} className="card">
//     <h3 className="text-sm font-medium mb-2">Question {question.questionNumber}</h3>
//     <div className="h-40">
//       <LazyLoadedQuestionChart questionData={question} CustomTooltipComponent={CustomTooltip} />
//     </div>
//   </div>
// ))}
