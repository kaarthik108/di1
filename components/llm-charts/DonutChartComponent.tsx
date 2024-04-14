"use client";
import { QueryResult } from "@/app/action";
import { Card, DonutChart, DonutChartProps } from "@tremor/react";
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
    queryResult.columns.forEach((column) => {
      filteredEntry[column] = entry[column];
    });
    return filteredEntry;
  });

  const donutChartProps: DonutChartProps = {
    data: filteredData,
    index: index,
    category: category as string,
    variant: "donut",
    valueFormatter: dataFormatter,
    onValueChange: (v: any) => console.log(v),
    showAnimation: true,
    animationDuration: 1000,
  };

  console.log("donutChartProps", donutChartProps);

  console.log("index is", index);
  console.log("category is", category);
  console.log("filteredData is", filteredData);

  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <DonutChart {...donutChartProps} />
      </Card>
    </>
  );
}
