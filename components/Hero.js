import Image from "next/image"
import hero from '@/public/hero.png'

const Hero = () => {
    return (
        <div className="bg-violet-300 pt-20 pb-8 flex flex-col items-center">
            <h1 className='text-4xl font-bold tracking-tight text-white sm:text-6xl flex items-center'>
                Une Imagination <span className='bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 inline-block text-transparent bg-clip-text ml-2.5'>sans limite</span>
            </h1>
            <p className='mt-4 -mb-16 text-lg max-w-prose text-white flex flex-col items-center'>
                En quelques secondes et à l'infini, de nouvelles histoires<span className='bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-700 inline-block text-transparent bg-clip-text font-medium'>pour enfants passionnantes et magiques.</span>
            </p>
            <Image src={hero} alt='livres magiques' width={900} />
        </div>
    )
}

export default Hero