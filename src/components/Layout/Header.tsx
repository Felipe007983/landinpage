import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoZeus from '../../assets/images/logozeus.jpeg';
import Company1 from '../../assets/images/company-1.jpeg';
import Company2 from '../../assets/images/company-2.jpeg';
import Company3 from '../../assets/images/company-3.jpeg';
import Company4 from '../../assets/images/company-4.jpeg';

export function Header() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const companies = [
        { id: '1', name: 'Trophy Gonzales', path: '/trophy-gonzales' },
        { id: '2', name: 'Clothing Bodybuilding', path: '/clothing-bodybuilding' },
    ];

    const companiesRight = [
        { id: '3', name: 'Dark Tan Pro', path: '/dark-tan-pro' },
        { id: '4', name: 'Corujão Lanches', path: '/coruja-lanches' },
    ];

    // Logic to determine which logo to show on the left based on the current path
    const logoMap: { [key: string]: string } = {
        '/': LogoZeus,
        '/trophy-gonzales': Company2,
        '/clothing-bodybuilding': Company1,
        '/dark-tan-pro': Company4,
        '/coruja-lanches': Company3,
    };

    // Default to DueloLogo if path not found in map (or handle partial matches if needed)
    const currentLogo = logoMap[location.pathname] || LogoZeus;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5 text-white shadow-lg h-20 flex items-center transition-all duration-300">
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Left Logo - Dynamic based on Route */}
                <Link to="/" className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.3)] flex-shrink-0 transition-transform hover:scale-105 z-50 relative group">
                    <img src={currentLogo} alt="Logo" className="w-full h-full object-cover group-hover:brightness-110 transition-all" />
                </Link>

                {/* Central Navigation - Desktop */}
                <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest mx-auto">
                    {companies.map(c => (
                        <Link
                            key={c.id}
                            to={c.path}
                            className={`relative group py-2 hover:text-amber-500 transition-colors duration-300 ${location.pathname === c.path ? 'text-amber-500' : 'text-gray-300'}`}
                        >
                            {c.name}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${location.pathname === c.path ? 'scale-x-100' : ''}`} />
                        </Link>
                    ))}

                    {/* Central Duelo Link */}
                    <Link
                        to="/"
                        className={`text-lg font-black px-6 tracking-tighter hover:text-amber-500 transition-colors duration-300 ${location.pathname === '/' ? 'text-amber-500' : 'text-white'}`}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                    >
                        ZEUS EVOLUTION
                    </Link>

                    {companiesRight.map(c => (
                        <Link
                            key={c.id}
                            to={c.path}
                            className={`relative group py-2 hover:text-amber-500 transition-colors duration-300 ${location.pathname === c.path ? 'text-amber-500' : 'text-gray-300'}`}
                        >
                            {c.name}
                            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-amber-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${location.pathname === c.path ? 'scale-x-100' : ''}`} />
                        </Link>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden z-50 relative p-2 text-white hover:text-amber-500 transition-colors"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                        {/* Open Icon (Hamburger) */}
                        <svg
                            className={`w-6 h-6 absolute transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>

                        {/* Close Icon (X) */}
                        <svg
                            className={`w-6 h-6 absolute transition-all duration-300 transform ${isMobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </button>

                {/* Right CTA - Desktop */}
                <div className="hidden md:block">
                    {location.pathname === '/clothing-bodybuilding' && (
                        <a
                            href="https://clothingbodybuilding.com.br"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:from-amber-500 hover:to-amber-600 transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] border border-amber-500/50 hover:-translate-y-0.5"
                        >
                            Compre Conosco
                        </a>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`
                    absolute top-20 left-0 right-0 bg-zinc-950/95 backdrop-blur-xl shadow-2xl border-b border-white/10
                    transition-all duration-300 ease-in-out transform origin-top md:hidden
                    ${isMobileMenuOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'}
                `}
            >
                <nav className="flex flex-col gap-6 text-center py-10">
                    <Link
                        to="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-xl font-black uppercase tracking-wider ${location.pathname === '/' ? 'text-amber-500' : 'text-white'}`}
                    >
                        Zeus Evolution
                    </Link>

                    <div className="h-px bg-white/10 w-20 mx-auto"></div>

                    {companies.map(c => (
                        <Link
                            key={c.id}
                            to={c.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors ${location.pathname === c.path ? 'text-amber-500' : 'text-gray-400'}`}
                        >
                            {c.name}
                        </Link>
                    ))}

                    {companiesRight.map(c => (
                        <Link
                            key={c.id}
                            to={c.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`text-sm font-bold uppercase tracking-widest hover:text-amber-500 transition-colors ${location.pathname === c.path ? 'text-amber-500' : 'text-gray-400'}`}
                        >
                            {c.name}
                        </Link>
                    ))}

                    {location.pathname === '/clothing-bodybuilding' && (
                        <div className="pt-6">
                            <a
                                href="https://clothingbodybuilding.com.br"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:from-amber-500 hover:to-amber-600 transition-all shadow-lg"
                            >
                                Compre Conosco
                            </a>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}
