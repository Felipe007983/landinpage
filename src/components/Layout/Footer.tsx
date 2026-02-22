import { Link, useLocation } from 'react-router-dom';
import { Instagram, Phone } from 'lucide-react';

export function Footer() {
    const location = useLocation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Contacts Map defined inside component for simplicity
    const contactsMap: Record<string, { instagram?: string; whatsapp: string }> = {
        '/': {
            instagram: 'https://www.instagram.com/zeusevolutioncb?igsh=MWR1Y25lZWo1NDM3bw==',
            whatsapp: 'https://wa.me/553492440149'
        },
        '/trophy-gonzales': {
            instagram: 'https://instagram.com/trophygonzales',
            whatsapp: 'https://wa.me/553492354877'
        },
        '/clothing-bodybuilding': {
            instagram: 'https://www.instagram.com/clothingbodybuilding?utm_source=qr&igsh=MXZobjVydnA4cGJ3bg==',
            whatsapp: 'https://wa.me/553492510023'
        },
        '/dark-tan-pro': {
            instagram: 'https://www.instagram.com/darktanpro?igsh=MXV5aGZnOHRpazdwaA==',
            whatsapp: 'https://wa.me/553492354877'
        }
    };

    // Fallback to home contacts if path not found (e.g., 404 or unknown)
    const currentContacts = contactsMap[location.pathname] || contactsMap['/'];

    return (
        <footer className="bg-zinc-950 text-gray-400 py-16 border-t border-white/10 font-sans">
            <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
                {/* About */}
                <div className="space-y-6">
                    <h4 className="text-white text-lg font-bold uppercase tracking-wider">Zeus Evolution</h4>
                    <p className="text-sm leading-relaxed">
                        O palco definitivo para a excelência no fisiculturismo.
                        Onde a história é escrita e lendas são consagradas.
                    </p>
                </div>

                {/* Links */}
                <div className="space-y-6">
                    <h4 className="text-white text-lg font-bold uppercase tracking-wider">Navegação</h4>
                    <ul className="space-y-4 text-sm">
                        <li><Link to="/" onClick={scrollToTop} className="hover:text-[#D4AF37] transition-colors">Home</Link></li>
                        <li><Link to="/trophy-gonzales" onClick={scrollToTop} className="hover:text-[#D4AF37] transition-colors">Trophy Gonzales</Link></li>
                        <li><Link to="/clothing-bodybuilding" onClick={scrollToTop} className="hover:text-[#D4AF37] transition-colors">Clothing Bodybuilding</Link></li>
                        <li><Link to="/dark-tan-pro" onClick={scrollToTop} className="hover:text-[#D4AF37] transition-colors">Dark Tan Pro</Link></li>
                    </ul>
                </div>

                {/* Contact - Dynamic */}
                <div className="space-y-6">
                    <h4 className="text-xl font-bold mb-6 bg-gradient-to-r from-yellow-500 to-yellow-200 bg-clip-text text-transparent">Contato</h4>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-center gap-3 hover:text-white transition-colors group">
                            <a
                                href={currentContacts.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full"
                            >
                                <span className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                    <Phone className="w-5 h-5 text-yellow-500" />
                                </span>
                                <span>WhatsApp</span>
                            </a>
                        </li>
                        <li className="flex items-center gap-3 hover:text-white transition-colors group">
                            <a
                                href={currentContacts.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full"
                            >
                                <span className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                    <Instagram className="w-5 h-5 text-yellow-500" />
                                </span>
                                <span>Instagram</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="container mx-auto px-6 pt-8 mt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm opacity-60">
                <p>&copy; 2024 Zeus Evolution. Todos os direitos reservados.</p>
                <div className="flex gap-6 mt-4 md:mt-0">
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">Termos</a>
                    <a href="#" className="hover:text-[#D4AF37] transition-colors">Privacidade</a>
                </div>
            </div>
        </footer>
    );
}
