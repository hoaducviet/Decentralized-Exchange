"use client"
import { useEffect, useState } from "react"
import { Area, AreaChart, Dot, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatPrice } from '@/utils/formatPrice'
import { ReservePool, Token } from "@/lib/type"

interface Props {
    reserves: ReservePool[];
    switchToken: boolean;
    token1: Token | undefined;
    token2: Token | undefined;
}
 
const chartConfig = {
    price: {
        label: "price",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig
export default function PoolChart({ reserves, switchToken, token1, token2 }: Props) {
    const [amount, setAmount] = useState<string>('')
    const chartData = reserves.map(({ createdAt, reserve1, reserve2 }) => {
        const newPrice = !switchToken ? (parseFloat(reserve1) / parseFloat(reserve2)).toString() : (parseFloat(reserve2) / parseFloat(reserve1)).toString()
        return ({ date: createdAt, price: newPrice.slice(0, newPrice.indexOf('.') + 7) })
    })
    const minPrice = chartData.length ? Math.min(...chartData.map(item => parseFloat(item.price || '0'))) : 0;
    const maxPrice = chartData.length ? Math.max(...chartData.map(item => parseFloat(item.price || '0'))) : 0;

    useEffect(() => {
        if (chartData.length) {
            setAmount(chartData[chartData.length - 1].price)
        }
    }, [chartData, switchToken])

    return (
        <Card className="border-none outline-none shadow-none">
            <CardHeader className="px-0">
                <CardTitle className="text-3xl ">{`1 ${token1?.symbol} = ${amount} ${token2?.symbol}`}</CardTitle>
                <CardDescription>
                    The reserve of pool last month
                </CardDescription>
            </CardHeader>
            {reserves.length ?
                <CardContent className="px-0">
                    <ChartContainer config={chartConfig}>
                        <AreaChart
                            accessibilityLayer
                            data={chartData}
                            margin={{
                                left: 0,
                                right: 48,
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
                                tickMargin={8}
                                minTickGap={0}
                                interval={Math.floor(chartData.length / 10)}
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
                                padding={{ top: 20, bottom: 0 }}
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
                                content={({ payload, label }) => {
                                    if (!payload || payload.length === 0) return null;

                                    const price = payload.find((item) => item.dataKey === "price")?.value as string;
                                    const date = new Date(label)

                                    return (
                                        <div className="bg-white/30 dark:bg-transparent dark:border-white dark:border-[1px] dark:border-opacity-20 shadow-xl p-4 space-y-1 rounded-2xl">
                                            <p className="font-semibold">{`${date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })} ${date.toLocaleTimeString("en-US", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}`}
                                            </p>
                                            <div className="flex flex-row justify-between">
                                                <div className="opacity-70">Price</div>
                                                <div className="font-semibold">{`$${formatPrice(parseFloat(price ?? ""))}`}</div>
                                            </div>
                                        </div>
                                    );
                                }}
                            />
                            <Area
                                dataKey="price"
                                type="monotone"
                                fill="url(#lineGradient)"
                                fillOpacity={0.4}
                                stroke="url(#lineGradient)"
                                stackId="a"
                                dot={(props) => {
                                    if (props.index === chartData.length - 1) { // Chỉ hiển thị dot cho điểm cuối
                                        return <Dot
                                            {...props}
                                            key={`dot-${props.index}`}
                                            fill="rgba(255, 0, 0, 0.991)"
                                            r={5} // Kích thước lớn hơn dot
                                            stroke="rgba(255, 0, 0, 0.991)" // Viền sáng
                                            strokeWidth={1} // Độ dày viền
                                            style={{ boxShadow: '0px 0px 10px rgba(255, 0, 0, 0.991)' }} // Thêm hiệu ứng phát sáng
                                        />;
                                    }
                                    return <g key={`empty-dot-${props.index}`} />;;
                                }}
                            />
                            <ReferenceLine y={chartData[chartData.length - 1].price} stroke="rgba(255, 0, 0, 0.991)" strokeOpacity={0.5} strokeWidth={1} />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                : <div className="flex flex-row justify-center items-center p-4">Not yet exchange</div>
            }
        </Card>
    )
}
