'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogClose, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Children, OrderActiveTransaction } from "@/lib/type"
import { Button } from "@/components/ui/button";

interface Props {
    children: Children;
    transaction: OrderActiveTransaction;
} 

export default function TransactionOverview({ children, transaction }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="w-[23vw] max-h-[50vw] px-0 pb-0 rounded-2xl">
                <DialogHeader className="bg-fixed w-full p-[2%]">
                    <DialogTitle className="px-[1vw]">{transaction.type}</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col w-full h-full overflow-x-auto mb-[2vw]">

                </div>
                <DialogFooter className="text-sm flex flex-row justify-between p-[0.5vw]">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                    <Button variant="outline">Continue</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}