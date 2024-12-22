import { SessionProvider } from "next-auth/react"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const inter = Inter({ subsets: ["latin"], display: 'swap' })

export const metadata = {
	title: "L'IA au service de l'humain - KidStory",
	description: "Des histoires pour les enfants personnalisées et à l'infini !",
	keywords: ['histoire', 'livre', 'IA', 'manga', 'anime', 'enfants']
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
		<body className={inter.className}>
			<SessionProvider>
				{children}
			</SessionProvider>
		</body>
    </html>
  );
}
