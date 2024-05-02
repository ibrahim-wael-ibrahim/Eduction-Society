import Providers from '../../provider/provider'
import "../globals.css"
export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
    <body suppressHydrationWarning={true}>
        <Providers>
          <main className=' w-screen  min-h-screen overflow-x-hidden FLEX-CENTER'>
          {children}
          </main>
        </Providers>
    </body>
    </html>
  )
}
