import { QueryResult } from "@/app/action";
import { executeD1 } from "@/app/actions";
import { Chart } from "@/components/llm-charts";
import { ChartType } from "@/lib/validation";
import { Code } from "bright";
import { format as sql_format } from "sql-formatter";

interface ChartWrapperProps {
  props: {
    query: string;
    format: ChartType;
    title?: string;
    description?: string;
    timeField?: string;
    categories?: string[];
    index?: string;
    yaxis?: string;
    size?: string;
  };
}

export async function ChartWrapper({ props }: ChartWrapperProps) {
  const { query, format, title, timeField, categories, index, yaxis, size } =
    props;

  const format_query = sql_format(query, { language: "sql" });
  const res = await executeD1(format_query);
  console.log("res", res);

  const columns = Object.keys(res[0]);
  const data = res
    .map((row) => {
      const values = Object.values(row);
      if (values.some((value) => value === "" || value === null)) {
        return null;
      }
      return Object.fromEntries(
        columns.map((key, index) => [key, values[index]])
      );
    })
    .filter((row): row is { [key: string]: any } => row !== null);

  const compatibleQueryResult: QueryResult = {
    columns: columns,
    data: data,
  };
  console.log("compatibleQueryResult", compatibleQueryResult);

  return (
    <div>
      <Chart
        queryResult={compatibleQueryResult}
        format={format}
        title={title}
        timeField={timeField}
        categories={categories || []}
        index={index}
        yaxis={yaxis}
        size={size}
      />
      <div className="py-4 whitespace-pre-line">
        <Code lang="sql" className="text-xs md:text-md">
          {format_query}
        </Code>
      </div>
    </div>
  );
}
