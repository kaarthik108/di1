"use client";

import { QueryResult } from "@/app/action";
import { AreaChart, Card } from "@tremor/react";

interface FilteredEntry {
  [key: string]: number | string;
}

export function AreaChartComponent({
  queryResult,
  title,
  timeField,
  categories,
}: {
  queryResult: QueryResult;
  title?: string;
  timeField?: string;
  categories: string[];
  onSelectionChange?: (selectedData: any) => void;
}) {
  const dataFormatter = (number: number): string =>
    `$${Intl.NumberFormat("us").format(number)}`;

  if (!timeField) {
    console.error("timeField is undefined");
    return null;
  }

  const filteredData: FilteredEntry[] = queryResult.data.map(
    (entry): FilteredEntry => {
      const filteredEntry: FilteredEntry = {};
      for (const [key, value] of Object.entries(entry)) {
        const lowercaseKey = key.toLowerCase();
        if (lowercaseKey === timeField.toLowerCase()) {
          filteredEntry[timeField] = value as string;
        } else {
          const matchedCategory = categories.find(
            (category) => category.toLowerCase() === lowercaseKey
          );
          if (matchedCategory) {
            filteredEntry[matchedCategory] = value as number;
          }
        }
      }
      return filteredEntry;
    }
  );

  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <AreaChart
          data={filteredData}
          index={timeField}
          categories={categories}
          colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          valueFormatter={dataFormatter}
          yAxisWidth={50}
          showAnimation={true}
          animationDuration={1000}
          showLegend
          onValueChange={(v: any) => console.log(v)}
        />
      </Card>
    </>
  );
}
