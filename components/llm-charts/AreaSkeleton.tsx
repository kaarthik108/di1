"use client";
import React from "react";
import { BotCard, BotMessage, SystemMessage } from "../message";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function AreaSkeleton() {
  return (
    <>
      <BotCard showAvatar={false}>
        <Card className="w-full bg-[#30302d] outline-none border-0">
          <div className="space-y-2">
            <Skeleton className="h-6 w-3/4 bg-[#2b2b27]/90" />
            <Skeleton className="h-80 bg-[#2b2b27]/90" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/5 bg-[#2b2b27]/90" />
              <Skeleton className="h-4 w-1/5 bg-[#2b2b27]/90" />
            </div>
          </div>
        </Card>
      </BotCard>
    </>
  );
}
