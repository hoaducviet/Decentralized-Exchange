"use client"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Dot, ReferenceLine, Text } from "recharts"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { formatPrice } from "@/utils/formatPrice"
import { TokenPrice, Token } from "@/lib/type"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { AvatarFallback } from "@/components/ui/avatar"
import { TriangleDownIcon, TriangleUpIcon } from "@radix-ui/react-icons"
export const description = "A simple area chart"

const chartConfig = {
    price: {
        label: "Price",
        color: "hsl(var(--chart-1))", 
    },
} satisfies ChartConfig

interface Props {
    prices: TokenPrice[];
    token: Token | undefined;
}

export default function TokenChart({ prices, token }: Props) {
    const chartData = prices.map(({ createdAt, price }) => ({ date: createdAt, price }))
    const minPrice = chartData.length ? Math.min(...chartData.map(item => parseFloat(item.price || '0'))) : 0;
    const maxPrice = chartData.length ? Math.max(...chartData.map(item => parseFloat(item.price || '0'))) : 0;
    const percentChange = (parseFloat(token?.price || "") - parseFloat(token?.price_reference || "")) / parseFloat(token?.price_reference || "")

    return (
        <Card className="border-none outline-none shadow-none">
            <CardHeader className="px-0">
                <div className="flex flex-row justify-start items-center space-x-[0.5vw]">
                    <Avatar>
                        <AvatarImage src={token?.img} className="w-[2vw] h-[2vw]" />
                        <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <div className="text-xl font-semibold">{token?.name}</div>
                    <div className="text-xl font-semibold opacity-65">{token?.symbol}</div>
                    <div className="flex flex-row justify-end items-center">{percentChange >= 0 ?
                        <div className="text-green-600 flex flex-row justify-end items-center space-x-[0.1vw]">
                            <TriangleUpIcon className="w-[1.5vw] h-[1.5vw]" />
                            <p>
                                {percentChange.toFixed(2)}%
                            </p>
                        </div> : <div className="text-red-500 flex flex-row justify-end items-center space-x-[0.1vw]">
                            <TriangleDownIcon className="w-[1.5vw] h-[1.5vw]" />
                            <p>
                                {(0 - percentChange).toFixed(2)}%
                            </p>
                        </div>
                    }</div>
                </div>
                <div className="text-[2vw] mx-[0.5vw] font-medium">${parseFloat(token?.price ?? "").toFixed(6)}</div>
                <CardDescription>
                    The prices last month
                </CardDescription>
            </CardHeader>
            {prices.length ?
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
                                interval={Math.floor(chartData.length / 10)}
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
                            <Text
                                x={chartData[chartData.length - 1].date}
                                y={chartData[chartData.length - 1].price}
                                fill="black"
                                fontSize={16}
                                fontWeight="bold"
                                textAnchor="middle"
                                dy={-10}
                            >
                                {`$${chartData[chartData.length - 1].price}`}
                            </Text>
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
                : <div className="flex flex-row justify-center items-center p-4">Not yet exchange</div>
            }
        </Card >
    )
}
