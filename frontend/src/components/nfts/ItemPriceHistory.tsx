'use client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowTrendingUpIcon } from '@heroicons/react/24/outline'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { NFTActiveTransaction } from "@/lib/type"

interface Props {
    prices: NFTActiveTransaction[] | [];
}

const chartConfig = {
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig
export default function ItemPriceHistory({ prices }: Props) {
    const chartData = prices.map(({ createdAt, price }) => ({ date: createdAt, price }))
    const minPrice = chartData.length ? Math.min(...chartData.map(item => parseFloat(item.price || '0'))) : 0;
    const maxPrice = chartData.length ? Math.max(...chartData.map(item => parseFloat(item.price || '0'))) : 0;

    return (
        <Card className="rounded-2xl my-0">
            <CardHeader className="my-0 py-4 rounded-t-2xl text-md font-semibold border-b-[1px]">
                <CardTitle className="flex flex-row space-x-2">
                    <ArrowTrendingUpIcon className="w-4 h-4" />
                    <div>Price History</div>
                </CardTitle>
            </CardHeader>
            {prices.length ? 
                <CardContent className="py-3 px-0">
                    <ChartContainer config={chartConfig}>
                        <LineChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 36,
                            }}
                        >
                            <defs>
                                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" className="text-blue-200" stopColor="currentColor" /> {/* Màu bắt đầu */}
                                    <stop offset="50%" className="text-blue-600" stopColor="currentColor" /> {/* Màu giữa */}
                                    <stop offset="100%" className="text-blue-900" stopColor="currentColor" /> {/* Màu kết thúc */}
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} />
                            <XAxis
                                dataKey="date"
                                tickLine={false}
                                axisLine={false}
                                interval={0}
                                tickMargin={8}
                                minTickGap={0}
                                domain={['auto', 'auto']}
                                tickFormatter={(value) => {
                                    const date = new Date(value)
                                    return date.toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                    })
                                }}
                            />
                            <YAxis
                                padding={{ top: 0, bottom: 0 }}
                                domain={[
                                    0,
                                    Math.round((maxPrice + (maxPrice - minPrice) * 0.1) / 10) * 10
                                ]}
                                tickLine={false}
                                axisLine={false}
                                tickCount={5}
                                tick={true}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent
                                    className="w-full"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        const date = new Date(value)
                                        return date.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }) + " " + date.toLocaleTimeString("en-US", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        });
                                    }}
                                />}
                            />
                            <Line
                                dataKey="price"
                                type="linear"
                                stroke="url(#lineGradient)"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
                : <div className="flex flex-row justify-center items-center p-4">Not yet exchange</div>
            }
        </Card>
    )
}