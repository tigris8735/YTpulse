import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { BottomBar } from '@/components/layout/BottomBar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[228px]">
        <TopBar />
        <main className="flex-1 p-6 pb-[96px] overflow-y-auto">{children}</main>
        <BottomBar />
      </div>
    </div>
  );
}
