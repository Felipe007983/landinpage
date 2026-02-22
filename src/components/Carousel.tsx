import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const defaultCollaborators = [
    { id: 1, name: 'Colaborador 1', role: 'Diretor', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
    { id: 2, name: 'Colaborador 2', role: 'Gerente', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop' },
    { id: 3, name: 'Colaborador 3', role: 'Coordenador', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
    { id: 4, name: 'Colaborador 4', role: 'Analista', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop' },
    { id: 5, name: 'Colaborador 5', role: 'Supervisor', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop' },
];

export interface Collaborator {
    id: number | string;
    name: string;
    role: string;
    image: string;
}

interface CarouselProps {
    color: string;
    collaborators?: Collaborator[];
}

export function Carousel({ color, collaborators = defaultCollaborators }: CarouselProps) {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % collaborators.length);
    const prev = () => setIndex((prev) => (prev - 1 + collaborators.length) % collaborators.length);

    useEffect(() => {
        const interval = setInterval(() => {
            next();
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full max-w-5xl mx-auto px-12">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold uppercase tracking-widest text-gray-500">Nossos Colaboradores</h3>
                <div className="flex gap-2">
                    <button onClick={prev} className="p-2 rounded-full border hover:bg-gray-100 transition-colors" style={{ borderColor: color, color }}>
                        ←
                    </button>
                    <button onClick={next} className="p-2 rounded-full border hover:bg-gray-100 transition-colors" style={{ borderColor: color, color }}>
                        →
                    </button>
                </div>
            </div>

            <div className="flex overflow-hidden gap-6">
                <AnimatePresence mode='popLayout'>
                    {/* Show 3 items at a time effectively (simplified for demo) */}
                    {collaborators.slice(0, 3).map((_, offset) => {
                        const i = (index + offset) % collaborators.length;
                        const collaborator = collaborators[i];
                        // If there's only 1 item, we only want to show it once
                        if (collaborators.length === 1 && offset > 0) return null;
                        // If there's only 2 items, we only want to show them once
                        if (collaborators.length === 2 && offset > 1) return null;

                        return (
                            <motion.div
                                key={`${collaborator.id}-${offset}`}
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ duration: 0.3 }}
                                className="min-w-[300px] bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                            >
                                <div className="flex items-center gap-4">
                                    <img src={collaborator.image} alt={collaborator.name} className="w-16 h-16 rounded-full object-cover" />
                                    <div>
                                        <h4 className="font-bold text-gray-800">{collaborator.name}</h4>
                                        <p className="text-sm text-gray-500">{collaborator.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
