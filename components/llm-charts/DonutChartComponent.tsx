"use client";
import { QueryResult } from "@/app/action";
import { Card, DonutChart } from "@tremor/react";
import { useRef } from "react";
import { Button } from "../ui/button";

interface DonutChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  index?: string;
  category?: string;
}

export function DonutChartComponent({
  queryResult,
  title,
  index,
  category,
}: DonutChartComponentProps) {
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index && entry.hasOwnProperty(index)) {
      filteredEntry[index] = entry[index];
    }

    if (category && entry.hasOwnProperty(category)) {
      filteredEntry[category] = entry[category];
    }

    return filteredEntry;
  });

  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <DonutChart
          data={filteredData}
          index={index as string}
          category={category as string}
          variant="donut"
          colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          valueFormatter={dataFormatter}
          onValueChange={(v) => console.log(v)}
          showAnimation={true}
          animationDuration={1000}
        />
      </Card>
    </>
  );
}
