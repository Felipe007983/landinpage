import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { LogOut, User as UserIcon, Calendar, Ticket, Download, CreditCard, ShieldCheck } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export function ClientAreaPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('tickets');
    const [orders, setOrders] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]);
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        if (activeTab === 'competitions') {
            api.get('/orders/my-orders').then(res => setOrders(res.data));
        } else if (activeTab === 'tickets') {
            api.get('/tickets/my-tickets').then(res => setTickets(res.data));
        } else if (activeTab === 'cards') {
            api.get('/credit-cards').then(res => setCards(res.data));
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-6xl">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 sticky top-24">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-black">
                                    <UserIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold">{user?.name}</h3>
                                    <p className="text-xs text-gray-400">Atleta / Visitante</p>
                                </div>
                            </div>

                            <nav className="flex flex-col gap-2">
                                <button
                                    onClick={() => setActiveTab('tickets')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'tickets' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Ticket className="w-4 h-4" /> Meus Ingressos
                                </button>
                                <button
                                    onClick={() => setActiveTab('competitions')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'competitions' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Calendar className="w-4 h-4" /> Minhas Competições
                                </button>
                                <button
                                    onClick={() => setActiveTab('cards')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'cards' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <CreditCard className="w-4 h-4" /> Meus Cartões
                                </button>
                                <button
                                    onClick={() => setActiveTab('data')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'data' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <UserIcon className="w-4 h-4" /> Dados Pessoais
                                </button>

                                {user?.role === 'ADMIN' && (
                                    <a
                                        href="/admin"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/10 mt-2"
                                    >
                                        <ShieldCheck className="w-4 h-4" /> Ir para Admin Dashboard
                                    </a>
                                )}

                                <div className="h-px bg-white/10 my-4"></div>

                                <button
                                    onClick={logout}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors font-bold text-sm"
                                >
                                    <LogOut className="w-4 h-4" /> Sair
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {activeTab === 'tickets' && (
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <Ticket className="text-amber-500" /> Seus Ingressos
                                </h2>

                                {tickets.length === 0 ? (
                                    <p className="text-gray-400 py-10 text-center">Nenhum ingresso encontrado.</p>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {tickets.map(t => (
                                            <div key={t.id} className="bg-zinc-800 rounded-xl overflow-hidden border border-white/5 flex flex-col md:flex-row shadow-2xl relative">
                                                {t.status === 'USED' && (
                                                    <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center backdrop-blur-sm">
                                                        <span className="text-red-500 border border-red-500 px-6 py-2 border-2 text-2xl font-black rotate-[-15deg] uppercase tracking-widest bg-black/50">Utilizado</span>
                                                    </div>
                                                )}
                                                <div className="p-6 flex-1 flex flex-col justify-center">
                                                    <span className={`text-xs font-black uppercase tracking-widest mb-1 ${t.order.type === 'COMPETITOR' ? 'text-amber-500' : 'text-blue-500'}`}>
                                                        {t.order.type === 'COMPETITOR' ? 'Passe Competidor' : 'Ingresso Visitante'}
                                                    </span>
                                                    <h4 className="text-lg font-bold mb-1 leading-tight">{t.order.championship.name}</h4>
                                                    <p className="text-xs text-gray-400 mb-4">{new Date(t.order.championship.date).toLocaleString('pt-BR')}</p>
                                                    <div className="text-[10px] text-zinc-500 mt-auto break-all font-mono">
                                                        ID: {t.uuid}
                                                    </div>
                                                </div>
                                                <div className="p-4 bg-white flex flex-col items-center justify-center border-l-2 border-dashed border-zinc-300 relative">
                                                    <QRCodeSVG value={t.uuid} size={100} />
                                                    <button className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors">
                                                        <Download className="w-3 h-3" /> Salvar
                                                    </button>
                                                    {/* Pseudo cut-outs */}
                                                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-zinc-800 rounded-full"></div>
                                                    <div className="absolute -bottom-3 -left-3 w-6 h-6 bg-zinc-800 rounded-full"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'competitions' && (
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <Calendar className="text-amber-500" /> Histórico de Compras e Competições
                                </h2>
                                {orders.length === 0 ? (
                                    <p className="text-gray-400 py-10 text-center">Nenhuma compra registrada.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map(o => (
                                            <div key={o.id} className="bg-zinc-800 p-6 rounded-xl flex items-center justify-between border border-white/5">
                                                <div>
                                                    <p className="text-sm text-gray-400 mb-1">Pagamento {o.paymentStatus}</p>
                                                    <h4 className="font-bold text-lg">{o.championship?.name}</h4>
                                                    <span className="text-xs bg-black/50 px-2 py-1 rounded text-amber-500 border border-amber-500/20">{o.type === 'COMPETITOR' ? 'Competidor' : 'Visitante'}</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-black">R$ {o.amount.toFixed(2)}</p>
                                                    <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('pt-BR')}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'data' && (
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <UserIcon className="text-amber-500" /> Dados Pessoais
                                </h2>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">Nome Completo</label>
                                        <div className="bg-zinc-800 px-4 py-3 rounded-lg text-white border border-white/5">{user?.name}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">E-mail</label>
                                        <div className="bg-zinc-800 px-4 py-3 rounded-lg text-white border border-white/5">{user?.email}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 block mb-1">CPF</label>
                                        <div className="bg-zinc-800 px-4 py-3 rounded-lg text-white border border-white/5">{user?.cpf || 'Não informado'}</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'cards' && (
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <CreditCard className="text-amber-500" /> Meus Cartões
                                </h2>

                                <div className="mb-8">
                                    <h3 className="font-bold mb-4 text-gray-300">Cartões Salvos</h3>
                                    {cards.length === 0 ? (
                                        <p className="text-gray-500 text-sm">Você ainda não tem cartões salvos.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {cards.map(c => (
                                                <div key={c.id} className="bg-zinc-800 p-5 rounded-xl border border-white/10 relative overflow-hidden group">
                                                    <div className="absolute top-0 right-0 p-4">
                                                        <CreditCard className="w-8 h-8 text-white/5" />
                                                    </div>
                                                    <p className="text-xs text-gray-400 mb-2">Cartão de Crédito</p>
                                                    <p className="font-mono text-xl tracking-widest mb-4">{c.maskedNumber}</p>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[10px] uppercase text-gray-500">Validade</p>
                                                            <p className="text-sm">{c.expiry}</p>
                                                        </div>
                                                        <button
                                                            onClick={async () => {
                                                                if (window.confirm('Excluir este cartão?')) {
                                                                    await api.delete(`/credit-cards/${c.id}`);
                                                                    setCards(cards.filter(card => card.id !== c.id));
                                                                }
                                                            }}
                                                            className="text-xs text-red-500 hover:text-red-400 underline opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            Remover
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="bg-zinc-950 p-6 rounded-xl border border-white/5">
                                    <h3 className="font-bold mb-4 text-amber-500 text-sm tracking-wider uppercase">Adicionar Novo Cartão</h3>
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        const form = e.target as HTMLFormElement;
                                        const cardNumber = (form.elements.namedItem('cardNumber') as HTMLInputElement).value;
                                        const expiry = (form.elements.namedItem('expiry') as HTMLInputElement).value;
                                        try {
                                            const { data } = await api.post('/credit-cards', { cardNumber, expiry, isDefault: true });
                                            setCards([...cards, data]);
                                            form.reset();
                                        } catch (err) {
                                            alert('Erro ao salvar cartão.');
                                        }
                                    }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input type="text" name="cardNumber" placeholder="Número do Cartão" required minLength={16} maxLength={16} className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input type="text" name="expiry" placeholder="MM/AA" required maxLength={5} className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                                            <input type="text" name="cvv" placeholder="CVV" required maxLength={4} className="bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                                        </div>
                                        <input type="text" name="cardName" placeholder="Nome Impresso no Cartão" required className="col-span-full bg-zinc-900 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                                        <button type="submit" className="col-span-full bg-amber-500 text-black font-bold uppercase py-3 rounded-lg hover:bg-amber-400 transition-colors mt-2">Salvar Cartão Seguro</button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
