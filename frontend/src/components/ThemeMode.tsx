'use client'
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function ThemeMode() {
    const { theme, setTheme } = useTheme()
    const handleToggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <div className=" flex flex-row items-center">
            <Switch
                checked={theme === 'dark'}
                onCheckedChange={handleToggleTheme}
                id="dark-mode"
                className="mr-1.5"
            />
            <Label htmlFor="dark-mode" className="ml-1.5">Mode</Label>
        </div>
    )
}