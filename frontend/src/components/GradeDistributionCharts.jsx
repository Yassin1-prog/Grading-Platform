import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const GradeDistributionCharts = ({
  gradeDistribution,
  studentGrade = null,
}) => {
  // Format data for the total grade distribution chart
  const totalGradeData = gradeDistribution.totalGradeDistribution.map(
    (count, grade) => ({
      grade: grade.toString(),
      count,
      isStudentGrade: studentGrade && grade === studentGrade.totalGrade,
    })
  );

  // Format data for the question-specific grade distribution charts
  const questionGradeData = gradeDistribution.questionDistributions.map(
    (distribution, questionIndex) => {
      return {
        questionNumber: questionIndex + 1,
        data: distribution.map((count, grade) => ({
          grade: grade.toString(),
          count,
          isStudentGrade:
            studentGrade &&
            grade === studentGrade.gradeByQuestion[questionIndex],
        })),
      };
    }
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-200 shadow-md">
          <p className="font-medium">{`Grade: ${label}`}</p>
          <p className="text-indigo-600">{`Count: ${payload[0].value}`}</p>
          {payload[0].payload.isStudentGrade && (
            <p className="text-green-600 font-medium">Your Grade</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">Final Grade Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={totalGradeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                fill="#6366F1"
                radius={[4, 4, 0, 0]}
                barSize={30}
                // Highlight the student's grade if available
                {...(studentGrade && {
                  fill: (entry) =>
                    entry.isStudentGrade ? "#10B981" : "#6366F1",
                })}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {questionGradeData.map((question) => (
          <div key={question.questionNumber} className="card">
            <h3 className="text-sm font-medium mb-2">
              Question {question.questionNumber}
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={question.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="count"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                    barSize={20}
                    // Highlight the student's grade if available
                    {...(studentGrade && {
                      fill: (entry) =>
                        entry.isStudentGrade ? "#10B981" : "#6366F1",
                    })}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GradeDistributionCharts;
