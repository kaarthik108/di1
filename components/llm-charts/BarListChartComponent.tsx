"use client";

import { QueryResult } from "@/app/action";
import { BarList, Card } from "@tremor/react";

interface BarListChartComponentProps {
  queryResult: QueryResult;
  title?: string;
}
const dataFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export function BarListChartComponent({
  queryResult,
  title,
}: BarListChartComponentProps) {
  console.log("queryResult is", queryResult);

  const { columns, data } = queryResult;
  const [nameKey, valueKey] = columns;

  const filteredData = data
    .filter((entry) => entry[nameKey] && entry[valueKey])
    .map((entry) => {
      return {
        name: entry[nameKey],
        value: entry[valueKey],
      };
    })
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  console.log("filteredData is", filteredData);

  return (
    <Card>
      <div>
        <h1 className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mb-4">
          Shows a max of 10 items
        </p>
        <BarList
          data={filteredData}
          valueFormatter={dataFormatter}
          showAnimation={true}
          onValueChange={(v) => console.log(v)}
          sortOrder="descending"
        />
      </div>
    </Card>
  );
}
