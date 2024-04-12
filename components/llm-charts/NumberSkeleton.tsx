import { Card } from "@tremor/react";
import React from "react";

function NumberSkeleton() {
  return (
    <Card
      className="mx-auto max-w-xs"
      decoration="top"
      decorationColor="indigo"
    >
      <p className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
        {"xxxxxx"}
      </p>
      <p className="text-3xl text-tremor-content-strong dark:text-dark-tremor-content-strong font-semibold animate-pulse">
        . . .
      </p>
    </Card>
  );
}

export default NumberSkeleton;
