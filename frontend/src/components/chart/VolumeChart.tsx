"use client"
import * as React from "react"
import { Bar, Area, CartesianGrid, XAxis, ComposedChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Volume } from "@/lib/type"
import { formatPrice } from "@/utils/formatPrice"
export const description = "An interactive bar chart"

const chartConfig = {
    volume: {
        label: "Volume",
        color: "hsl(var(--chart-1))",
    },
    transaction_count: {
        label: "Transaction", 
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

interface Props {
    volumes: Volume[] | []
}

export default function VolumeChart({ volumes }: Props) {
    const chartData = volumes?.map(({ date, volume, transaction_count }) => ({ date, volume: parseFloat(volume || "0"), transaction_count }))
    const totalVolume = chartData.reduce((sum, item) => sum + item.volume, 0)

    return (
        <Card className="border-none outline-none shadow-none">
            <CardHeader className="px-0 space-y-3">
                <CardTitle>Volume</CardTitle>
                <div className="text-5xl font-medium">${formatPrice(totalVolume)}</div>
                <CardDescription>
                    Past month
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <ChartContainer config={chartConfig}>
                    <ComposedChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 0,
                            right: 0,
                        }}
                    >
                        <defs>
                            <linearGradient id="lineGradient" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" className="text-red-100" stopColor="currentColor" /> {/* Màu bắt đầu */}
                                <stop offset="50%" className="text-red-400" stopColor="currentColor" /> {/* Màu giữa */}
                                <stop offset="100%" className="text-red-700" stopColor="currentColor" /> {/* Màu kết thúc */}
                            </linearGradient>
                        </defs>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" className="text-blue-100" stopColor="currentColor" /> {/* Màu bắt đầu */}
                                <stop offset="50%" className="text-blue-400" stopColor="currentColor" /> {/* Màu giữa */}
                                <stop offset="100%" className="text-blue-700" stopColor="currentColor" /> {/* Màu kết thúc */}
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
                            content={({ payload, label }) => {
                                if (!payload || payload.length === 0) return null;

                                const volume = payload.find((item) => item.dataKey === "volume")?.value as number;
                                const transactionCount = payload.find((item) => item.dataKey === "transaction_count")?.value as number;

                                return (
                                    <div className="bg-white/30 dark:bg-transparent dark:border-white dark:border-[1px] dark:border-opacity-20 shadow-xl p-4 space-y-1 rounded-2xl">
                                        <p className="font-semibold">{`${new Date(label).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}`}
                                        </p>
                                        <div className="flex flex-row justify-between">
                                            <div className="opacity-70">Volume</div>
                                            <div className="font-semibold">{`$${formatPrice(volume)}`}</div>
                                        </div>
                                        <div className="flex flex-row justify-between space-x-2">
                                            <div className="opacity-70">Number of Transactions</div>
                                            <div className="font-semibold">{transactionCount}</div>
                                        </div>
                                    </div>
                                );
                            }}
                        />
                        <Area dataKey="transaction_count" type="monotone" fill="url(#lineGradient)" fillOpacity={0.4} stroke="url(#lineGradient)" stackId="a" dot={false} />
                        <Bar dataKey="volume" fill="url(#barGradient)" barSize={20} />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
