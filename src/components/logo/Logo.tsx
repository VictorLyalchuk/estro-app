import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
export default function Logo() {
    return (
        <>
            <header className='bg-white-container-header flex justify-center items-center text-center hover:text-indigo-500' style={{ backgroundColor: '#303A47' }} >
                <Link to="/" >
                    <h1 className="text-neon text-white text-9xl mb-1 mt-10 hover:text-indigo-300">estro</h1>
                    <p className="text-neon text-white text-sx mb-10 hover:text-indigo-100">SHOES, CLOTHING & ACCESSORIES</p>
                </Link>
            </header>
        </>
    )
}