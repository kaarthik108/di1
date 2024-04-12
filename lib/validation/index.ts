import { z } from "zod";

const chartTypes = z.enum([
  "area",
  "number",
  "table",
  "bar",
  "line",
  "donut",
  "scatter",
]);
export type ChartType = z.infer<typeof chartTypes>;

export const querySchema = z.object({
  query: z.string().describe(`
    Creates a sqlite SQL query based on the context and given query.
  `),
  format: chartTypes.describe(
    "The format of the result, which determines the type of chart to generate."
  ),
  title: z
    .string()
    .describe(
      "The title for the chart, which is displayed prominently above the chart."
    ),
  timeField: z
    .string()
    .optional()
    .describe(
      "Used for time series data, designating the column that represents the time dimension. This field is used as the x-axis in charts like area and bar (if the bar chart is time-based), and potentially as the x-axis in scatter charts."
    ),
  categories: z
    .array(z.string())
    .describe(
      "An array of strings that represent the numerical data series names to be visualized on the chart for 'area', 'bar', and 'line' charts. These should correspond to fields in the data that contain numerical values to plot."
    ),
  index: z
    .string()
    .optional()
    .describe(
      "For 'bar' and 'scatter' charts, this denotes the primary categorical axis or the x-axis labels. For time series bar charts, this can often be the same as timeField."
    ),
  // Fields specific to scatter chart
  category: z
    .string()
    .optional()
    .describe(
      "The category field for scatter charts, defining how data points are grouped."
    ),
  yaxis: z
    .string()
    .optional()
    .describe(
      "The field representing the y-axis value in scatter charts. (THIS IS REQUIRED FOR SCATTER CHARTS)"
    ),
  size: z
    .string()
    .optional()
    .describe(
      "The field representing the size of the data points in scatter charts. (THIS IS REQUIRED FOR SCATTER CHARTS)"
    ),
});
