import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
export default function Logo() {
    return (
        <>
            <header className='flex justify-center items-center text-center hover:text-indigo-500' style={{ backgroundColor: '#303A47' }} >
                <Link to="/" >
                    <h1 className="text-white text-7xl mb-1 mt-10 hover:text-indigo-300">estro</h1>
                    <p className="text-white text-sx mb-10 hover:text-indigo-100">SHOES & ACCESSORIES</p>
                    {/* <img src="../images/estro.webp" alt="Your Company" /> */}
                    
                </Link>
            </header>
        </>
    )
}