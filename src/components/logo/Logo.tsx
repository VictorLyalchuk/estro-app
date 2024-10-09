import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import { useTranslation } from 'react-i18next';

export default function Logo() {
    const { t } = useTranslation();
    return (
        <>
            <header
                className="relative bg-white-container-header flex justify-center items-center text-center hover:text-indigo-500"
                style={{
                    backgroundColor: '#1E262F',
                    backgroundImage: `
      linear-gradient(135deg, rgba(30, 38, 47, 0.9) 0%, rgba(15, 20, 25, 0.9) 100%), 
      url('https://png.pngtree.com/png-vector/20220818/ourmid/pngtree-small-halftone-dots-circle-png-image_6115215.png')`,
                    backgroundRepeat: 'no-repeat, repeat, repeat, repeat',
                    backgroundPosition: 'center, 0 0, 50px 50px, 100px 100px',
                    backgroundSize: 'cover, 50px 50px, 50px 50px, 50px 50px',
                    opacity: 1
                }}
            >
                <Link to="/" className="relative z-10">
                    <h1 className="text-neon text-white text-9xl mb-1 mt-10 hover:text-indigo-300">estro</h1>
                    <p className="text-neon text-white text-sx mb-10 hover:text-indigo-100">{t('Logo_Paragraph')}</p>
                </Link>
            </header>



        </>
    )
}