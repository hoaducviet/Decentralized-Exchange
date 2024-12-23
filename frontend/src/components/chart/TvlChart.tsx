"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatPrice } from "@/utils/formatPrice"
import { TVL } from '@/lib/type'
export const description = "A linear area chart"

interface Props { 
    tvls: TVL[];
}

const chartConfig = {
    tvl: {
        label: "TVL",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function TVLChart({ tvls }: Props) {
    const chartData = tvls?.map(({ date, tvl }) => ({ date, tvl: parseFloat(tvl || "0") }))

    return (
        <Card className="border-none outline-none shadow-none">
            <CardHeader className="px-0 space-y-3">
                <CardTitle>TVL</CardTitle>
                <div className="text-5xl font-medium">${formatPrice(chartData[chartData.length - 1]?.tvl)}</div>
                <CardDescription>
                    Past month
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 36,
                            right: 48,
                        }}
                    >
                        <defs>
                            <linearGradient id="areaGradient" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" className="text-blue-200" stopColor="currentColor" /> {/* Màu bắt đầu */}
                                <stop offset="50%" className="text-blue-500" stopColor="currentColor" /> {/* Màu giữa */}
                                <stop offset="100%" className="text-blue-800" stopColor="currentColor" /> {/* Màu kết thúc */}
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={0}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            defaultIndex={1}
                            content={({ payload, label }) => {
                                if (!payload || payload.length === 0) return null;
                                const tvl = payload.find((item) => item.dataKey === "tvl")?.value as number;

                                return (
                                    <div className="bg-white/30 dark:bg-transparent dark:border-white dark:border-[1px] dark:border-opacity-20 shadow-xl p-4 min-w-[6vw] space-y-1 rounded-2xl">
                                        <p className="font-semibold">{`${new Date(label).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}`}
                                        </p>
                                        <div className="flex flex-row justify-between">
                                            <div className="opacity-70">TVL</div>
                                            <div className="font-semibold">{`$${formatPrice(tvl)}`}</div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Area
                            dataKey="tvl"
                            type="linear"
                            fill="url(#areaGradient)"
                            fillOpacity={0.4}
                            stroke="url(#areaGradient)"
                            stackId="a"
                            dot={false}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
