"use client";

import dynamic from "next/dynamic";
import AreaSkeleton from "./AreaSkeleton";
import NumberSkeleton from "./NumberSkeleton";

export { Chart } from "@/components/Charts";

const AreaComp = dynamic(
  () => import("./AreaChartComponent").then((mod) => mod.AreaChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const NumberComp = dynamic(
  () =>
    import("./NumberChartComponent").then((mod) => mod.NumberChartComponent),
  {
    ssr: false,
    loading: () => <NumberSkeleton />,
  }
);

const TableComp = dynamic(
  () => import("./TableChartComponent").then((mod) => mod.TableChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const LineComp = dynamic(
  () => import("./LineChartComponent").then((mod) => mod.LineChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const DonutComp = dynamic(
  () => import("./DonutChartComponent").then((mod) => mod.DonutChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const ScatterComp = dynamic(
  () =>
    import("./ScatterChartComponent").then((mod) => mod.ScatterChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

const BarComp = dynamic(
  () => import("./BarChartComponent").then((mod) => mod.BarChartComponent),
  {
    ssr: false,
    loading: () => <AreaSkeleton />,
  }
);

export {
  AreaComp,
  BarComp,
  DonutComp,
  LineComp,
  NumberComp,
  ScatterComp,
  TableComp,
};
