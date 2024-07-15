import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import type { Metadata } from "next";
import { Inter ,IBM_Plex_Serif} from "next/font/google";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const router=useRouter();
  const loggedIn=await getLoggedInUser();
  if(!loggedIn) redirect('/sign-in')
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
