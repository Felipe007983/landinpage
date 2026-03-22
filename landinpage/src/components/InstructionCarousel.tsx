import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface InstructionCarouselProps {
    images: string[];
    color: string;
}

export function InstructionCarousel({ images, color }: InstructionCarouselProps) {
    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const next = () => {
        setDirection(1);
        setIndex((prev) => (prev + 1) % images.length);
    };

    const prev = () => {
        setDirection(-1);
        setIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const goTo = (i: number) => {
        setDirection(i > index ? 1 : -1);
        setIndex(i);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 8000);
        return () => clearInterval(interval);
    }, [images.length]);

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 100 : -100,
            opacity: 0,
            scale: 0.95
        })
    };

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Step Navigation */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Instruções para o evento</span>
                    <span className="text-xs font-black" style={{ color }}>PASSO {index + 1} DE {images.length}</span>
                </div>
                <div className="flex gap-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-full transition-all duration-700 rounded-full ${i <= index ? 'opacity-100' : 'opacity-20'}`}
                            style={{ 
                                backgroundColor: color,
                                width: `${100 / images.length}%`,
                                transform: i === index ? 'scaleY(1.5)' : 'scaleY(1)'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Main Stage */}
            <div className="relative group">
                <div className="relative aspect-[16/10] md:aspect-[16/9] w-full rounded-[2rem] bg-white border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.4 }
                            }}
                            className="absolute inset-0 flex items-center justify-center p-4 md:p-12"
                        >
                            <img
                                src={images[index]}
                                alt={`Instrução ${index + 1}`}
                                className="w-full h-full object-contain drop-shadow-2xl"
                            />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Number Indicators (Circles) */}
                <div className="flex justify-center gap-4 mt-8 flex-wrap">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`w-10 h-10 rounded-full border-2 font-black text-sm flex items-center justify-center transition-all duration-300 ${
                                i === index 
                                ? 'bg-black border-black text-white scale-110 shadow-xl' 
                                : 'border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-600 bg-white'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>

                {/* Floating Nav Buttons */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-900 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-900 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
