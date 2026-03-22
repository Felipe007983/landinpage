import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

interface ImageCarouselProps {
    images: string[];
    color: string;
    whatsappLink?: string;
}

export function ImageCarousel({ images, color, whatsappLink }: ImageCarouselProps) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % images.length);
    const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Portfólio</h3>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">Catálogo de Produtos</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={prev}
                        className="p-3 rounded-full border-2 hover:bg-gray-50 transition-all active:scale-95 bg-white shadow-lg z-20"
                        style={{ borderColor: color, color }}
                        aria-label="Previous image"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                    </button>
                    <button
                        onClick={next}
                        className="p-3 rounded-full border-2 hover:bg-gray-50 transition-all active:scale-95 bg-white shadow-lg z-20"
                        style={{ borderColor: color, color }}
                        aria-label="Next image"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </button>
                </div>
            </div>

            <div className="relative overflow-hidden h-[500px] md:h-[600px] w-full rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-inner">
                <AnimatePresence initial={false} mode='popLayout'>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, zIndex: 1 }}
                        exit={{ opacity: 0, scale: 1.1, y: -20, zIndex: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-8"
                    >
                        <div className="relative group cursor-pointer w-full h-full flex flex-col items-center justify-center">
                            <a 
                                href={whatsappLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="relative w-full h-[70%] flex items-center justify-center mb-8"
                            >
                                <img
                                    src={images[index]}
                                    alt={`Product ${index + 1}`}
                                    className="max-w-full max-h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500"
                                />
                            </a>

                            {whatsappLink && (
                                <motion.a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-white shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                    style={{ 
                                        backgroundColor: color,
                                        boxShadow: `0 10px 30px ${color}40`
                                    }}
                                >
                                    <MessageSquare className="w-6 h-6" />
                                    Adquira Já
                                </motion.a>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Thumbnail/Indicator Dots */}
            <div className="flex justify-center gap-3 mt-10 flex-wrap">
                {images.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-12 shadow-lg' : 'w-3 bg-gray-200 hover:bg-gray-300'}`}
                        style={{ backgroundColor: i === index ? color : undefined }}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
