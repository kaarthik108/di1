"use client";
import { QueryResult } from "@/app/action";
import { Card, LineChart } from "@tremor/react";

export function LineChartComponent({
  queryResult,
  title,
  categories,
  index,
}: {
  queryResult: QueryResult;
  title?: string;
  categories: string[];
  index?: string;
}) {
  const dataFormatter = (number: number) =>
    `$${Intl.NumberFormat("us").format(number).toString()}`;
  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index) {
      if (entry.hasOwnProperty(index)) {
        filteredEntry[index] = entry[index];
      }
    }

    categories.forEach((category) => {
      if (entry.hasOwnProperty(category)) {
        filteredEntry[category] = entry[category];
      }
    });

    return filteredEntry;
  });
  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <div className="relative">
          <LineChart
            className="h-80"
            data={filteredData}
            index={index as string}
            categories={categories}
            colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
            valueFormatter={dataFormatter}
            yAxisWidth={60}
            showAnimation={true}
            animationDuration={1000}
          />
        </div>
      </Card>
    </>
  );
}
