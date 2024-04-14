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
    queryResult.columns.forEach((column) => {
      if (entry.hasOwnProperty(column)) {
        filteredEntry[column] = entry[column];
      } else {
        filteredEntry[column] = 0;
      }
    });
    return filteredEntry;
  });
  console.log("index is", index);
  console.log("categories are", categories);
  console.log("filteredData is", filteredData);

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
            autoMinValue={true}
          />
        </div>
      </Card>
    </>
  );
}
