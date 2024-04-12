"use client";

import { QueryResult } from "@/app/action";
import {
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";

export function TableChartComponent({
  queryResult,
  title,
}: {
  queryResult: QueryResult;
  title?: string;
}) {
  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <h3 className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold">
          {title}
        </h3>
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              {queryResult.columns.map((column) => (
                <TableHeaderCell key={column}>{column}</TableHeaderCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {queryResult.data.map((item, rowIndex) => (
              <TableRow key={rowIndex}>
                {queryResult.columns.map((column) => (
                  <TableCell key={`${rowIndex}-${column}`}>
                    {item[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
