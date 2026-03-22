import { motion } from 'framer-motion';
import { MessageSquare, ShoppingCart } from 'lucide-react';

interface Product {
    image: string;
    name?: string;
    description?: string;
}

interface ProductCatalogProps {
    products: Product[];
    color: string;
    whatsappLink?: string;
}

export function ProductCatalog({ products, color, whatsappLink }: ProductCatalogProps) {
    return (
        <div className="container mx-auto px-6">
            <div className="text-center mb-16">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Exclusividade</h3>
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900 mb-6">
                    Catálogo de Troféus
                </h2>
                <div className="w-24 h-2 mx-auto rounded-full" style={{ backgroundColor: color }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((prod, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
                    >
                        {/* Background Decoration */}
                        <div 
                            className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px] pointer-events-none group-hover:scale-150 transition-transform duration-700" 
                            style={{ backgroundColor: color }} 
                        />
                        
                        <div className="relative aspect-square mb-8 overflow-hidden rounded-2xl bg-gray-50 flex items-center justify-center p-6">
                            <motion.img
                                src={prod.image}
                                alt={prod.name || `Produto ${idx + 1}`}
                                className="w-full h-full object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.2)]"
                                whileHover={{ scale: 1.1, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-xl font-black uppercase tracking-tight text-gray-900 line-clamp-2">
                                        {prod.name || "Troféu Premium"}
                                    </h4>
                                    <p className="text-gray-500 text-sm font-medium">Modelo {idx + 1}</p>
                                </div>
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                                    style={{ backgroundColor: color }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                Design exclusivo com acabamento de alta qualidade, ideal para grandes campeonatos.
                            </p>

                            <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg hover:shadow-2xl hover:-translate-y-1 active:translate-y-0 transition-all duration-300"
                                style={{ 
                                    backgroundColor: color,
                                    boxShadow: `0 10px 20px ${color}40`
                                }}
                            >
                                <MessageSquare className="w-5 h-5" />
                                <span>Adquira Já</span>
                            </a>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
