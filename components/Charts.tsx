"use client";
import { AI, QueryResult } from "@/app/action";
import { Card } from "@tremor/react";

import { ChartType } from "@/lib/validation";
import {
  AreaComp,
  BarComp,
  BarListComp,
  DonutComp,
  LineComp,
  NumberComp,
  ProgressComp,
  ScatterComp,
  TableComp,
} from "./llm-charts";

interface ChartProps {
  queryResult: QueryResult;
  format: ChartType;
  title?: string;
  description?: string;
  timeField?: string;
  categories?: string[];
  index?: string;
  yaxis?: string;
  size?: string;
}

export function Chart({
  queryResult,
  format,
  title,
  timeField,
  categories = [],
  index,
  yaxis,
  size,
}: ChartProps) {
  try {
    switch (format) {
      case "area":
        return (
          <AreaComp
            queryResult={queryResult}
            title={title}
            timeField={timeField}
            categories={categories}
          />
        );
      case "number":
        return <NumberComp queryResult={queryResult} title={title} />;
      case "table":
        return <TableComp queryResult={queryResult} title={title} />;
      case "line":
        return (
          <LineComp
            queryResult={queryResult}
            title={title}
            index={timeField}
            categories={categories}
          />
        );
      case "bar":
        return (
          <BarComp
            queryResult={queryResult}
            title={title}
            index={index}
            categories={categories}
          />
        );

      case "scatter":
        return (
          <ScatterComp
            queryResult={queryResult}
            title={title}
            index={index}
            category={categories[0]}
            yaxis={yaxis!}
            size={size!}
          />
        );
      case "donut":
        return (
          <DonutComp
            queryResult={queryResult}
            title={title}
            index={index}
            category={categories[0]}
          />
        );
      case "barlist":
        return <BarListComp queryResult={queryResult} title={title} />;

      // case "progress":
      //   return <ProgressComp queryResult={queryResult} title={title} />;

      default:
        throw new Error(`Unsupported chart type: ${format}`);
    }
  } catch (error) {
    console.error(error);
    return (
      <div className="flex items-center justify-center">
        <Card>
          <p className="text-tremor-default font-medium text-tremor-content dark:text-dark-tremor-content">
            Error rendering chart
          </p>
        </Card>
      </div>
    );
  }
}
