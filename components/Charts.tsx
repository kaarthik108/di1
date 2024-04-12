"use client";
import { AI, QueryResult } from "@/app/action";
import { Card } from "@tremor/react";

import { ChartType } from "@/lib/validation";
import {
  AreaComp,
  BarComp,
  DonutComp,
  LineComp,
  NumberComp,
  ScatterComp,
  TableComp,
} from "./llm-charts";

interface ChartProps {
  queryResult: QueryResult;
  chartType: ChartType;
  title?: string;
  description?: string;
  timeField?: string;
  categories: string[];
  index?: string;
  yaxis?: string;
  size?: string;
}

export function Chart({
  queryResult,
  chartType,
  title,
  timeField,
  categories,
  index,
  yaxis,
  size,
}: ChartProps) {
  try {
    switch (chartType) {
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

      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
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
