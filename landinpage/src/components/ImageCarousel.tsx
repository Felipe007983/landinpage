import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
    images: string[];
    color: string;
    whatsappLink?: string;
}

export function ImageCarousel({ images, color, whatsappLink }: ImageCarouselProps) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % images.length);

    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div className="relative w-full max-w-6xl mx-auto px-4 md:px-12">

            <div className="relative overflow-hidden h-[500px] md:h-[800px] w-full rounded-3xl bg-zinc-950/50 backdrop-blur-sm border border-white/10 shadow-3xl">
                <AnimatePresence initial={false} mode='popLayout'>
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0, zIndex: 1 }}
                        exit={{ opacity: 0, scale: 1.1, y: -20, zIndex: 0 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6"
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
                                    className="w-full h-full object-contain pointer-events-none drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]"
                                />
                            </a>
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
