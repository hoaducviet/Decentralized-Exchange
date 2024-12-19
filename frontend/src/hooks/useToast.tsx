'use client'
import { useToast as useShadcnToast } from "@/hooks/use-toast"
export const useToast = () => {
    const { toast } = useShadcnToast()
    const showSuccess = (message: string) => {
        toast({
            variant: "default",
            title: "Success!",
            description: message,
            className: "select-none rounded-2xl",
            style: {
                backgroundColor: "#5092fd",
                color: "#ffffff",
                border: "0.5px solid #c3c3c3",
            }
        })
    }
    const showInfo = (title: string, message: string) => {
        toast({
            variant: "default",
            title: title || "",
            description: message,
            className: "select-none rounded-2xl",
        })
    }

    const showError = (message: string) => {
        toast({
            variant: "destructive",
            title: "Error!",
            description: message,
            className: "select-none rounded-2xl",
        })
    }
    return {
        showSuccess,
        showError,
        showInfo
    }
}