import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Calendar, MapPin, ChevronRight, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ChampionshipsSection() {
    const [championships, setChampionships] = useState<any[]>([]);
    const [selectedChamp, setSelectedChamp] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user } = useAuth();

    const [paymentStep, setPaymentStep] = useState(false);
    const [selectedType, setSelectedType] = useState<any>(null);
    const [cards, setCards] = useState<any[]>([]);
    const [paymentMethod, setPaymentMethod] = useState('PIX');
    const [selectedCardId, setSelectedCardId] = useState('');
    const [gatewayResponse, setGatewayResponse] = useState<any>(null);
    const [processing, setProcessing] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const mockEvent = {
            id: 'mock-test-id',
            name: 'Zeus Evolution - Evento Teste',
            date: new Date(Date.now() + 86400000 * 30).toISOString(),
            location: 'Arena Zeus, São Paulo',
            description: 'Evento de teste para validação do fluxo de compra. Preço promocional de R$ 0,001.',
            status: 'OPEN',
            priceComp: 0.001,
            priceVis: 0.001,
            banner: '',
        };

        api.get('/championships').then(res => {
            const events = [mockEvent, ...res.data];
            setChampionships(events);

            // Auto-open modal if returning from Auth
            if (user && location.state?.champId) {
                const targetChamp = events.find(c => c.id === location.state.champId);
                if (targetChamp) setSelectedChamp(targetChamp);
            }
        }).catch(err => {
            console.error('Failed to load championships', err);
            setChampionships([mockEvent]);
        }).finally(() => setLoading(false));
    }, [user, location.state]);

    useEffect(() => {
        if (user && selectedChamp) {
            api.get('/credit-cards').then(res => {
                setCards(res.data);
                if (res.data.length > 0) {
                    const defaultCard = res.data.find((c: any) => c.isDefault) || res.data[0];
                    setSelectedCardId(defaultCard.id);
                }
            });
        }
    }, [user, selectedChamp]);

    const handleAction = (c: any, type: 'COMPETITOR' | 'VISITOR') => {
        if (!user) {
            navigate('/auth', { state: { returnTo: '/', champId: c.id, action: type } });
            return;
        }
        setSelectedType(type);
        setPaymentStep(true);
    };

    const processPayment = async () => {
        if (!selectedChamp || !selectedType) return;
        setProcessing(true);
        try {
            const payload = {
                championshipId: selectedChamp.id,
                type: selectedType,
                paymentMethod,
                creditCardId: paymentMethod === 'CREDIT_CARD' ? selectedCardId : undefined
            };
            const { data } = await api.post('/orders', payload);

            setGatewayResponse(data.gatewayResponse);
            if (data.order.paymentStatus === 'APPROVED') {
                alert('Pagamento Aprovado! Seu ingresso foi gerado.');
            }
        } catch (e) {
            alert('Falha ao processar pagamento.');
        } finally {
            setProcessing(false);
        }
    };

    const closeAll = () => {
        setSelectedChamp(null);
        setPaymentStep(false);
        setGatewayResponse(null);
    };

    if (loading) return <div className="text-amber-500 text-center py-20">Carregando Campeonatos...</div>;

    return (
        <>
            <section id="campeonatos" className="py-24 relative z-10 bg-zinc-950 border-t border-white/5">
                <div className="container mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Próximos Eventos</h3>
                        <h2 className="text-3xl md:text-5xl font-black text-amber-500">Campeonatos de Fisiculturismo</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Inscreva-se ou compre seu ingresso para os próximos eventos do Zeus Evolution.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {championships.map(c => (
                            <div key={c.id} className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 transition-all cursor-pointer group" onClick={() => setSelectedChamp(c)}>
                                <div className="h-48 bg-zinc-800 relative">
                                    {c.banner ? <img src={c.banner} alt={c.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">Sem Banner</div>}
                                    <div className="absolute top-4 right-4 bg-amber-500 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                        {c.status === 'OPEN' ? 'ABERTO' : 'ENCERRADO'}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-3">{c.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                                        <Calendar className="w-4 h-4 text-amber-500" />
                                        <span>{new Date(c.date).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-6">
                                        <MapPin className="w-4 h-4 text-amber-500" />
                                        <span>{c.location}</span>
                                    </div>
                                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-amber-500 hover:text-black rounded-lg transition-colors font-bold uppercase text-sm group-hover:bg-amber-500 group-hover:text-black">
                                        Ver Detalhes
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {championships.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">Nenhum campeonato cadastrado no momento.</div>
                        )}
                    </div>
                </div>
            </section>

            {selectedChamp && (
                <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-amber-500/30 w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
                        <button onClick={closeAll} className="absolute top-4 right-4 text-gray-400 hover:text-white bg-black/50 p-2 rounded-full z-10 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="h-48 md:h-64 bg-zinc-800 flex-shrink-0 relative">
                            {selectedChamp.banner ? <img src={selectedChamp.banner} alt={selectedChamp.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-zinc-600">Sem Banner</div>}
                        </div>
                        <div className="p-8 overflow-y-auto w-full relative">
                            {!paymentStep ? (
                                <>
                                    <h2 className="text-3xl font-black mb-2">{selectedChamp.name}</h2>
                                    <div className="flex flex-wrap gap-4 mb-6">
                                        <span className="flex items-center gap-2 text-amber-500 font-medium">
                                            <Calendar className="w-5 h-5" /> {new Date(selectedChamp.date).toLocaleString('pt-BR')}
                                        </span>
                                        <span className="flex items-center gap-2 text-gray-300">
                                            <MapPin className="w-5 h-5" /> {selectedChamp.location}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 mb-8 leading-relaxed whitespace-pre-wrap">{selectedChamp.description || 'Descrição não disponível.'}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <button
                                            disabled={selectedChamp.status !== 'OPEN'}
                                            onClick={() => handleAction(selectedChamp, 'COMPETITOR')}
                                            className="bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-xl font-black uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
                                        >
                                            <span>Competir</span>
                                            <span className="text-xs opacity-75 mt-1">R$ {selectedChamp.priceComp?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                                        </button>
                                        <button
                                            disabled={selectedChamp.status !== 'OPEN'}
                                            onClick={() => handleAction(selectedChamp, 'VISITOR')}
                                            className="border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black py-4 rounded-xl font-black uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center"
                                        >
                                            <span>Comprar Ingresso</span>
                                            <span className="text-xs opacity-75 mt-1">R$ {selectedChamp.priceVis?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <h2 className="text-2xl font-black mb-4 uppercase tracking-widest text-amber-500">Checkout</h2>
                                    <p className="text-gray-400 mb-6">
                                        Você está adquirindo: <strong className="text-white">{selectedType === 'COMPETITOR' ? 'Inscrição Atleta' : 'Ingresso Visitante'}</strong><br />
                                        Valor: <strong className="text-white">R$ {(selectedType === 'COMPETITOR' ? selectedChamp.priceComp : selectedChamp.priceVis).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 3 })}</strong>
                                    </p>

                                    {gatewayResponse ? (
                                        <div className="text-center p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                                            {paymentMethod === 'PIX' ? (
                                                <>
                                                    <h3 className="text-green-500 font-bold mb-4 uppercase tracking-widest">Pague com PIX</h3>
                                                    <div className="flex justify-center mb-4">
                                                        <img src={gatewayResponse.qrCodeUrl} alt="QR Code PIX" className="w-48 h-48 border-4 border-white rounded-lg" />
                                                    </div>
                                                    <p className="text-xs text-gray-400 break-all bg-black/50 p-3 rounded font-mono">{gatewayResponse.qrCodeData}</p>
                                                    <button onClick={() => navigate('/minha-conta')} className="mt-6 font-bold text-amber-500 hover:text-amber-400 underline uppercase text-sm">Validar Pagamento na Área do Cliente</button>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-green-500 font-bold mb-2 uppercase tracking-widest">{gatewayResponse.message}</h3>
                                                    <p className="text-sm text-gray-400 font-mono mb-6">Transação: {gatewayResponse.transactionId}</p>
                                                    <button onClick={() => navigate('/minha-conta')} className="px-6 py-3 bg-amber-500 text-black font-bold uppercase rounded-lg hover:bg-amber-400 w-full transition-colors">Acessar Meu Ingresso</button>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-3 mb-6">
                                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'PIX' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}>
                                                    <input type="radio" name="payment" value="PIX" checked={paymentMethod === 'PIX'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold">PIX (Aprovação Imediata)</span>
                                                </label>

                                                <label className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'CREDIT_CARD' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}>
                                                    <div className="flex items-center gap-3">
                                                        <input type="radio" name="payment" value="CREDIT_CARD" checked={paymentMethod === 'CREDIT_CARD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-amber-500" />
                                                        <span className="font-bold">Cartão de Crédito</span>
                                                    </div>

                                                    {paymentMethod === 'CREDIT_CARD' && (
                                                        <div className="pl-7 pt-2">
                                                            {cards.length > 0 ? (
                                                                <select value={selectedCardId} onChange={e => setSelectedCardId(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 text-white rounded p-2 text-sm focus:border-amber-500 focus:outline-none">
                                                                    {cards.map(c => <option key={c.id} value={c.id}>Final: {c.maskedNumber.slice(-4)} (Val: {c.expiry})</option>)}
                                                                </select>
                                                            ) : (
                                                                <p className="text-xs text-red-400">Nenhum cartão salvo. Vá em Minha Conta para cadastrar.</p>
                                                            )}
                                                        </div>
                                                    )}
                                                </label>

                                                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'DEBIT_CARD' ? 'border-amber-500 bg-amber-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}>
                                                    <input type="radio" name="payment" value="DEBIT_CARD" checked={paymentMethod === 'DEBIT_CARD'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 text-amber-500" />
                                                    <span className="font-bold">Cartão de Débito (Redirecionamento)</span>
                                                </label>
                                            </div>

                                            <button
                                                onClick={processPayment}
                                                disabled={processing || (paymentMethod === 'CREDIT_CARD' && cards.length === 0)}
                                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black py-4 rounded-xl font-black uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
                                            >
                                                {processing ? 'Processando...' : 'Finalizar Pagamento'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
