import Image from "next/image"
import { Caveat } from "next/font/google"
import { auth } from "@/lib/auth"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const font = Caveat({ subsets: ['latin'] })

const Navbar = async () => {
    const session = await auth()
    const user = session?.user

    return (
        <header className="bg-violet-300 sticky z-50 top-0 inset-x-0 h-16 flex items-center justify-between">
            <div className="ml-7 flex items-center">
                <Image src={'/logo.svg'} alt='logo' width={30} height={30} />
                <h2 className={cn("font-bold text-3xl text-indigo-600 ml-2", font.className)}>KidStory</h2>
            </div>
            <div className='mr-7'>
                <Button>Se connecter</Button>
            </div>
        </header>
    )
}

export default Navbar