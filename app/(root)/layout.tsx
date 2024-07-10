import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import type { Metadata } from "next";
import { Inter ,IBM_Plex_Serif} from "next/font/google";
import Image from "next/image";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn={firstName:'Samuel',lastName:'jsm'};
  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user={loggedIn}/>
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src='icons/logo.svg'
            width={30} height={30}alt="menu icon"/>
            <div>
              <MobileNav user={loggedIn}/>
            </div>
          </div>
       
        {children}
        </div>
    </main>
  );
}
