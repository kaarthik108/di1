"use client";
import { QueryResult } from "@/app/action";
import { BarChart, Card } from "@tremor/react";

interface BarChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  categories: string[];
  index?: string;
}

export function BarChartComponent({
  queryResult,
  title,
  categories,
  index,
}: BarChartComponentProps) {
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index) {
      filteredEntry[index] = entry[index.toUpperCase()];
    }

    categories.forEach((category) => {
      const upperCaseCategory = category.toUpperCase();
      if (entry.hasOwnProperty(upperCaseCategory)) {
        filteredEntry[category] = entry[upperCaseCategory];
      }
    });

    return filteredEntry;
  });
  // console.log("index is", index);
  // console.log("categories are", categories);
  // console.log("filteredData is", filteredData);

  return (
    <>
      <Card>
        <div>
          <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
            {title}
          </p>
          <BarChart
            data={filteredData}
            index={index as string}
            categories={categories}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            valueFormatter={dataFormatter}
            yAxisWidth={48}
            onValueChange={(v) => console.log(v)}
            showAnimation={true}
            animationDuration={1000}
          />
        </div>
      </Card>
    </>
  );
}
