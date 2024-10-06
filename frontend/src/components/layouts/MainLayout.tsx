import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";

interface Props {
    children: React.ReactNode
}

export default function MainLayout({ children }: Props) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>

    )
}