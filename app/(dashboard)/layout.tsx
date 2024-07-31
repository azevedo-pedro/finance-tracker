import { Header } from "@/components/header";
import { ReactNode } from "react";
type Props = {
  children: ReactNode;
};
export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
}
