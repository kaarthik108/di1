"use client";
import { QueryResult } from "@/app/action";
import { Card, ScatterChart } from "@tremor/react";

interface ScatterChartComponentProps {
  queryResult: QueryResult;
  title?: string;
  index?: string;
  category: string;
  yaxis: string;
  size: string;
}

export function ScatterChartComponent({
  queryResult,
  title,
  index,
  category,
  yaxis,
  size,
}: ScatterChartComponentProps) {
  const filteredData = queryResult.data.map((entry) => {
    const filteredEntry: { [key: string]: string | number } = {};

    if (index && entry.hasOwnProperty(index)) {
      filteredEntry[index] = entry[index];
    }

    if (category && entry.hasOwnProperty(category)) {
      filteredEntry[category] = entry[category];
    }

    if (yaxis && entry.hasOwnProperty(yaxis)) {
      filteredEntry[yaxis] = entry[yaxis];
    }

    if (size && entry.hasOwnProperty(size)) {
      filteredEntry[size] = entry[size];
    }

    return filteredEntry;
  });
  // console.log("index is", index);
  // console.log("category is", category);
  // console.log("yaxis is", yaxis);
  // console.log("size is", size);
  // console.log("filteredData is", filteredData);

  return (
    <>
      <Card>
        <p className="text-lg text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold mb-4">
          {title}
        </p>
        <ScatterChart
          className="-ml-2 mt-6 h-80"
          yAxisWidth={50}
          data={filteredData}
          category={category}
          x={index as string}
          y={yaxis as string}
          size={size as string}
          showOpacity={true}
          minYValue={60}
          enableLegendSlider
          colors={["blue", "cyan", "indigo", "violet", "fuchsia"]}
          onValueChange={(v) => console.log(v)}
          showAnimation={true}
          animationDuration={1000}
        />
      </Card>
    </>
  );
}
