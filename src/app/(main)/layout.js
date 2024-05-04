import Providers from '../../provider/provider'
import "../globals.css"
import Sidebar from '@/components/sidebar/Sidebar'
import NavbarSection from '@/components/navbar/Navbar'
export const metadata = {
  title: 'Eduction Society',
  description: 'Eduction Society is app to best learn  ',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body suppressHydrationWarning={true}>
        <Providers>
          <main className=" relative flex flex-row  w-screen h-screen overflow-hidden  ">
            <Sidebar />
            <section className="flex flex-col  w-full  justify-start items-center overflow-x-hidden overflow-y-scroll">
              <NavbarSection />
              <section className='FLEX-CENTER w-full container py-2'>
              {children}
              </section>
            </section>
            <div className='w-[800px]   aspect-square rounded-full bg-gradient-to-r from-indigo-500 from-10% via-green-500 via-30% to-emerald-500 to-90%      animate-spin-slow   -z-[1] absolute  -right-60 -top-[300px]  blur-[300px]'></div>
      <div className='w-[600px]   aspect-square rounded-full bg-gradient-to-r from-indigo-500 from-10% via-green-500 via-30% to-emerald-500 to-90%     animate-spin-slow  -z-[1] absolute  -left-80 -bottom-[550px]  blur-[300px]'></div>
    
          </main>
        </Providers>
    </body>
    </html>
  )
}
