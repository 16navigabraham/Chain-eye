import { DashboardClientLayout } from "@/components/dashboard-client-layout";

interface DashboardLayoutProps {
    children: React.ReactNode
    params: { address: string; blockchain: string }
}

// This is now a Server Component
export default function DashboardLayout({ children, params }: DashboardLayoutProps) {
    const { address, blockchain } = params;

    return (
        <DashboardClientLayout address={address} blockchain={blockchain}>
            {children}
        </DashboardClientLayout>
    )
}
