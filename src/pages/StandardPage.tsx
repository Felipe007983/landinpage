import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Carousel, Collaborator } from '../components/Carousel';
import { Footer } from '../components/Layout/Footer';
import { PreFooter } from '../components/PreFooter';

import { ImageCarousel } from '../components/ImageCarousel';
import { FixedContacts } from '../components/FixedContacts';

interface MVV {
    mission: string;
    vision: string;
    values: string;
}

interface Contacts {
    instagram?: string;
    whatsapp?: string;
}

interface StandardPageProps {
    title: string;
    subtitle: string;
    image: string;
    video?: string;
    events?: string[];
    products?: string[];
    mvv?: MVV;
    contacts?: Contacts;
    color: string;
    secondaryColor?: string;
    history?: string;
    secondaryVideo?: string;
    historyTitle?: string;
    portfolio?: string;
    team?: Collaborator[];
    variant?: 'default' | 'duelo';
}

export function StandardPage({ title, subtitle, image, video, events, products, mvv, contacts, color, secondaryColor, history, secondaryVideo, historyTitle, portfolio, team, variant = 'default' }: StandardPageProps) {
    const location = useLocation();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const renderHero = () => (
        <section className="h-[70vh] bg-zinc-900 relative flex items-center p-6 md:p-20 overflow-hidden">
            <div className="md:w-1/2 z-20 space-y-8 relative">
                <motion.h1
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-xl"
                >
                    {title}
                </motion.h1>
                <div className="relative">
                    <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-widest mb-4 flex items-center gap-4" style={{ color }}>
                        <span className="w-16 h-2 rounded-full" style={{ background: `linear-gradient(to right, ${color}, ${secondaryColor || color})` }} />
                        O Que É
                    </h2>
                    <p className="text-gray-300 text-lg md:text-xl max-w-lg leading-relaxed font-light">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Hero Image with Gradient Overlay */}
            <div className="absolute inset-0 z-10 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent z-10" />
                {video ? (
                    <video
                        src={video}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover object-center transform scale-105"
                        style={{ objectPosition: 'center 20%' }}
                    />
                ) : (
                    <img
                        src={image}
                        className="w-full h-full object-cover object-center transform scale-105"
                        alt={title}
                        style={{ objectPosition: 'center 20%' }}
                    />
                )}
            </div>

            {/* Brand Strip */}
            <div className="absolute bottom-0 left-0 right-0 h-4 z-20" style={{ background: `linear-gradient(to right, ${color}, ${secondaryColor || color})` }} />
        </section>
    );

    const renderMVV = () => (
        <section className="bg-white py-24 relative z-10 -mt-10 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Fundamentos</h3>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900">Missão, Visão e Valores</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                    <div className="group p-8 border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 bg-white relative overflow-hidden">
                        {/* Accents */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: color }} />
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-bl-[100px] -mr-8 -mt-8 transition-colors group-hover:bg-opacity-50" style={{ backgroundColor: `${secondaryColor || color}10` }} />

                        <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-500" style={{ backgroundColor: color }}>M</div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900">Missão</h4>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {mvv?.mission || "Transformar o cenário competitivo através da excelência, inspirando atletas a superarem seus próprios limites."}
                        </p>
                    </div>

                    <div className="group p-8 border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 bg-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: secondaryColor || color }} />

                        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 transition-colors opacity-10" style={{ backgroundColor: color }} />

                        <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-500" style={{ backgroundColor: secondaryColor || color }}>V</div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900">Visão</h4>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {mvv?.vision || "Ser a referência inquestionável em inovação, organização e impacto positivo no esporte."}
                        </p>
                    </div>

                    <div className="group p-8 border border-gray-100 rounded-3xl hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2 bg-white relative overflow-hidden">
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500" style={{ backgroundColor: color }} />

                        <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -mr-8 -mt-8 transition-colors opacity-10" style={{ backgroundColor: secondaryColor || color }} />

                        <div className="w-16 h-16 mb-8 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg transform group-hover:rotate-12 transition-transform duration-500" style={{ backgroundColor: color }}>E</div>
                        <h4 className="text-xl font-bold mb-4 text-gray-900">Valores</h4>
                        <p className="text-gray-500 leading-relaxed group-hover:text-gray-700 transition-colors">
                            {mvv?.values || "Integridade inegociável, paixão ardente pelo esporte e compromisso total com resultados reais."}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );

    const renderHistory = () => history && (
        <section className="py-24 relative z-10 overflow-hidden bg-gray-50/50">
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-5 -mr-40 -mt-20 pointer-events-none" style={{ backgroundColor: color }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-5 -ml-40 -mb-20 pointer-events-none" style={{ backgroundColor: secondaryColor || color }} />

            <div className="container mx-auto px-6 relative">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Nossa Trajetória</h3>
                        <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6">{historyTitle || "Como Tudo Começou"}</h2>
                        <div className="flex justify-center gap-2">
                            <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                            <div className="w-4 h-1.5 rounded-full" style={{ backgroundColor: secondaryColor || color }} />
                        </div>
                    </div>

                    <div className="bg-white p-8 md:p-14 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 relative">
                        {/* Decorative Quote Icon */}
                        <div className="absolute -top-10 -left-6 text-9xl leading-none opacity-10 font-serif select-none pointer-events-none" style={{ color: color }}>
                            &ldquo;
                        </div>

                        <div className="prose prose-lg text-gray-600 leading-relaxed whitespace-pre-line text-justify relative z-10 font-light">
                            <span className="float-left text-7xl font-black mr-4 mt-[-10px] leading-[0.8]" style={{ color }}>
                                {history.charAt(0)}
                            </span>
                            {history.slice(1)}
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-0 right-0 w-40 h-40 opacity-5 rounded-tl-[100px] pointer-events-none" style={{ backgroundColor: secondaryColor || color }} />
                    </div>
                </div>
            </div>
        </section>
    );

    const renderVideo = () => secondaryVideo && (
        <section className="py-24 bg-zinc-900 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/10 relative aspect-video max-w-5xl mx-auto">
                    <video
                        src={secondaryVideo}
                        controls
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </section>
    );

    const renderEvents = () => events && events.length > 0 && (
        <section className="py-24 bg-white relative z-10">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2" style={{ color }}>Galeria</h3>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900">Nossos Eventos</h2>
                </div>
                <div className="grid md:grid-cols-1 gap-8 max-w-4xl mx-auto">
                    {events.map((eventImage, index) => (
                        <div key={index} className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white hover:shadow-3xl transition-all duration-300 group cursor-pointer" onClick={() => setSelectedImage(eventImage)}>
                            <div className="relative aspect-video">
                                <img
                                    src={eventImage}
                                    alt={`Evento ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <span className="text-white text-lg font-bold tracking-widest uppercase border border-white px-6 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Ver Ampliado</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

    const renderProducts = () => products && products.length > 0 && (
        <section className="py-24 bg-white relative z-10 border-t border-gray-100">
            <ImageCarousel images={products} color={color} />
        </section>
    );

    const renderTeam = () => team && team.length > 0 && (
        <section className="py-24 bg-gray-50 border-t border-gray-100 relative">
            <div className="container mx-auto px-6 relative z-10">
                <Carousel color={color} collaborators={team} />
            </div>
        </section>
    );

    const renderPortfolio = () => portfolio && (
        <section className="py-20 relative z-10 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Portfolio Comercial</h2>
                <a
                    href={portfolio}
                    download="Portfolio_Duelo_de_Gigantes_2026.pdf"
                    className="inline-flex items-center gap-3 px-8 py-4 text-white font-bold rounded-full text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                    style={{ backgroundColor: color }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Baixar Portfolio 2026
                </a>
            </div>
        </section>
    );

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 pt-16 font-sans flex flex-col">
            {renderHero()}

            {variant === 'duelo' ? (
                <>
                    {renderEvents()}
                    {renderPortfolio()}
                    {renderTeam()}
                    {renderVideo()}
                    {renderHistory()}
                    {renderMVV()}
                    {/* Keeping Products at the end */}
                    {renderProducts()}
                </>
            ) : (
                <>
                    {renderMVV()}
                    {renderHistory()}
                    {renderVideo()}
                    {renderEvents()}
                    {renderPortfolio()}
                    {renderProducts()}
                    {renderTeam()}
                </>
            )}

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                    >
                        <motion.img
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            src={selectedImage}
                            alt="Evento ampliado"
                            className="max-w-full max-h-[80vh] rounded-xl shadow-2xl border-2 border-white/10 object-contain mt-16"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-8 right-8 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contacts Section */}
            {/* Fixed Contacts */}
            <FixedContacts contacts={contacts} color={color} secondaryColor={secondaryColor} />

            <div className="mt-auto relative">
                <div className="absolute top-0 left-0 right-0 h-1 z-20" style={{ background: `linear-gradient(to right, ${color}, ${secondaryColor || color})` }} />
                {location.pathname === '/clothing-bodybuilding' && <PreFooter />}
                <Footer />
            </div>

        </div >
    );
}
