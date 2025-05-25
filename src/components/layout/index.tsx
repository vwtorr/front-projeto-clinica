import Header from "../header";
import LeftMenu from "../left-menu";
import Popup from "../loading";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>

            <header className="h-[60px]" >
                <Header />
       
            </header>
            <main className="flex h-[calc(100%-60px)]">
                <section >
                    <LeftMenu />
                </section>
                <aside className="col-span-10 bg-[#E5E5E5] w-full px-16 py-8 overflow-y-scroll">
                    {children}
                </aside>
            </main>
        </>

    );
}
