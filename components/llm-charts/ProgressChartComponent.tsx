"use client";

import { QueryResult } from "@/app/action";
import { Card, ProgressCircle, ProgressCircleProps } from "@tremor/react";
import { useRef } from "react";
import { Button } from "../ui/button";

interface ProgressCircleComponentProps {
  queryResult: QueryResult;
  title?: string;
  index?: string;
  category?: string;
}

export function ProgressCircleComponent({
  queryResult,
  title,
  index,
  category,
}: ProgressCircleComponentProps) {
  const dataFormatter = (number: number) =>
    Intl.NumberFormat("us").format(number).toString();

  const ProgressCircleProps: ProgressCircleProps = {
    value: 50,
    showAnimation: true,
  };

  console.log("donutChartProps", ProgressCircleProps);

  console.log("index is", index);
  console.log("category is", category);
  console.log("filteredData is", queryResult);

  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <ProgressCircle {...ProgressCircleProps} size="lg" />
      </Card>
    </>
  );
}
