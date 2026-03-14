import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { LogOut, User as UserIcon, Calendar, Ticket, Download, ShieldCheck, Shield } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CardCheckoutForm } from '../../components/CardCheckoutForm';

interface Order {
    id: string;
    type: string;
    paymentStatus: string;
    amount: number;
    createdAt: string;
    championship?: {
        name: string;
        date: string;
    };
}

interface Ticket {
    id: string;
    uuid: string;
    status: string;
    order: {
        type: string;
        championship: {
            name: string;
            date: string;
        };
    };
}

export function ClientAreaPage() {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('tickets');
    const [orders, setOrders] = useState<Order[]>([]);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    
    const [fedPaymentStep, setFedPaymentStep] = useState(false);
    const [fedPaymentMethod, setFedPaymentMethod] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
    const [showFedCardForm, setShowFedCardForm] = useState(false);
    const [fedProcessing, setFedProcessing] = useState(false);
    const [fedGatewayResponse, setFedGatewayResponse] = useState<any>(null);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.requiredFederation) {
            setActiveTab('federation');
            setFedPaymentStep(true);
            toast("Finalize a taxa de federação para poder competir.");
            // Remove state to prevent infinite loops on reload
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const isFederated = user?.federationYear === new Date().getFullYear();


    useEffect(() => {
        if (activeTab === 'competitions') {
            api.get('/orders/my-orders').then(res => setOrders(Array.isArray(res.data) ? res.data : []));
        } else if (activeTab === 'tickets') {
            api.get('/tickets/my-tickets').then(res => setTickets(Array.isArray(res.data) ? res.data : []));
        }
    }, [activeTab]);

    useEffect(() => {
        let interval: any;
        if (fedGatewayResponse?.orderId && fedGatewayResponse?.status !== 'approved') {
            interval = setInterval(async () => {
                try {
                    const { data } = await api.get(`/orders/${fedGatewayResponse.orderId}/status`);
                    if (data.paymentStatus === 'APPROVED') {
                        toast.success("Anuidade da Federação paga com sucesso!");
                        setFedGatewayResponse((prev: any) => ({
                            ...prev,
                            status: 'approved',
                            message: 'Pagamento Aprovado!'
                        }));
                        setTimeout(() => {
                            window.location.reload(); // Reload to refresh user context
                        }, 2000);
                    } else if (data.paymentStatus === 'FAILED' || data.paymentStatus === 'REJECTED') {
                        toast.error("Pagamento não foi aprovado.");
                        setFedGatewayResponse((prev: any) => ({
                            ...prev,
                            status: 'rejected',
                            message: 'Pagamento Recusado'
                        }));
                    }
                } catch (e) {
                    console.error("Erro ao verificar status do pedido", e);
                }
            }, 5000); // Check every 5 seconds
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [fedGatewayResponse]);

    const processFedPayment = async (cardData?: any) => {
        setFedProcessing(true);
        try {
            const { data: orderData } = await api.post('/orders', {
                type: 'FEDERATION',
                paymentMethod: fedPaymentMethod,
                championshipId: location.state?.targetChampId || undefined
            });

            const orderId = orderData.order.id;
            let paymentData: any = {};

            if (fedPaymentMethod === 'PIX') {
                paymentData = {
                    transaction_amount: 50,
                    payment_method_id: 'pix',
                    payer: { email: user?.email }
                };
            } else if (cardData) {
                paymentData = cardData.formData;
            } else {
                toast.error("Método de pagamento não configurado.");
                setFedProcessing(false);
                return;
            }

            const { data: payData } = await api.post('/payment/process', {
                paymentData,
                orderId
            });

            if (fedPaymentMethod === 'PIX') {
                setFedGatewayResponse({
                    qrCodeUrl: payData.ticket_url,
                    qrCodeBase64: payData.qr_code_base64,
                    qrCodeCopyPaste: payData.qr_code,
                    orderId: orderId,
                    status: 'pending'
                });
            } else {
                if (payData.status === 'approved') {
                    toast.success("Pagamento aprovado!");
                    setFedGatewayResponse({
                        status: 'approved',
                        message: 'Pagamento Aprovado com Sucesso!'
                    });
                    setTimeout(() => {
                        if (location.state?.targetChampId) {
                            navigate('/#campeonatos', { state: { champId: location.state.targetChampId, action: 'COMPETITOR' } });
                        } else {
                            window.location.reload();
                        }
                    }, 2000);
                } else {
                    toast.error("O pagamento foi recusado pelo banco.");
                    setFedProcessing(false);
                }
            }

        } catch (e: any) {
            console.error('Erro ao processar pagamento', e);
            toast.error(e.response?.data?.error || 'Erro processando pagamento. Tente novamente.');
            setFedProcessing(false);
        }
    };

    const handleDownloadTicket = async (ticketId: string, championshipName: string) => {
        try {
            const response = await api.get(`/tickets/${ticketId}/pdf`, { responseType: 'blob' });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ingresso-${championshipName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erro ao baixar ingresso:', error);
            alert('Não foi possível baixar o ingresso no momento.');
        }
    };

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
                                    <h3 className="font-bold">{user?.name} <span className="text-[10px] opacity-30">({user?.role})</span></h3>
                                    <p className="text-xs text-gray-400">
                                        {(user?.role?.toUpperCase() === 'ADMIN' || user?.role?.toUpperCase() === 'SUPPORT' || user?.role?.toUpperCase() === 'TICKETER') 
                                            ? 'Membro da Equipe (Admin)' 
                                            : 'Atleta / Visitante'}
                                    </p>
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
                                    onClick={() => setActiveTab('data')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'data' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <UserIcon className="w-4 h-4" /> Dados Pessoais
                                </button>
                                
                                <button
                                    onClick={() => setActiveTab('federation')}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === 'federation' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    <Shield className={`w-4 h-4 ${!isFederated && activeTab !== 'federation' ? 'text-red-500' : ''}`} /> Federação {user?.role !== 'ADMIN' && !isFederated && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                </button>

                                {['ADMIN', 'TICKETER', 'SUPPORT'].includes(user?.role?.toUpperCase() || '') && (
                                    <a
                                        href="/admin"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-amber-500 border border-amber-500/30 hover:bg-amber-500/10 mt-2"
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
                                { (Array.isArray(tickets) ? tickets : []).map(t => (
                                            <div key={t.id} className="bg-zinc-800 rounded-xl overflow-hidden border border-white/5 flex flex-col md:flex-row shadow-2xl relative">
                                                {t.status === 'USED' && (
                                                    <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center backdrop-blur-sm">
                                                        <span className="text-red-500 border border-red-500 px-6 py-2 border-2 text-2xl font-black rotate-[-15deg] uppercase tracking-widest bg-black/50">Utilizado</span>
                                                    </div>
                                                )}
                                                <div className="p-6 flex-1 flex flex-col justify-center">
                                                    <span className={`text-xs font-black uppercase tracking-widest mb-1 ${t.order.type === 'COMPETITOR' ? 'text-amber-500' : 'text-amber-600'}`}>
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
                                                    <button
                                                        onClick={() => handleDownloadTicket(t.id, t.order.championship.name)}
                                                        className="mt-4 flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-black transition-colors"
                                                    >
                                                        <Download className="w-3 h-3" /> Salvar PDF
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
                                    <Calendar className="text-amber-500" /> Histórico de Competições
                                </h2>
                                { (Array.isArray(orders) ? orders : []).filter(o => o.type === 'COMPETITOR' && o.paymentStatus === 'APPROVED').length === 0 ? (
                                    <p className="text-gray-400 py-10 text-center">Nenhuma inscrição aprovada como competidor até o momento.</p>
                                ) : (
                                    <div className="space-y-4">
                                        { (Array.isArray(orders) ? orders : []).filter(o => o.type === 'COMPETITOR' && o.paymentStatus === 'APPROVED').map(o => (
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

                        {activeTab === 'federation' && (
                            <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8">
                                <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
                                    <Shield className="text-amber-500" /> Federação Anual
                                </h2>

                                <div className="bg-zinc-800 p-8 rounded-xl border border-white/5 mb-8">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">Status da Filiação</h3>
                                            <p className="text-gray-400 text-sm">
                                                Para participar como competidor nos campeonatos, é necessário estar com a filiação anual em dia. A filiação é válida até 31 de Dezembro do ano vigente.
                                            </p>
                                        </div>
                                        <div className="flex-shrink-0 text-center">
                                            <div className={`text-sm font-black uppercase tracking-wider px-6 py-2 rounded-full border-2 mb-2 ${isFederated ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                                {isFederated ? 'Ativo' : 'Inativo'}
                                            </div>
                                            {isFederated && (
                                                <div className="text-xs text-gray-500">
                                                    Válido até 31/12/{new Date().getFullYear()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {!isFederated && !fedPaymentStep && (
                                    <div className="flex justify-center">
                                        <button
                                            onClick={() => setFedPaymentStep(true)}
                                            className="bg-amber-500 hover:bg-amber-600 text-black font-black uppercase tracking-wide py-4 px-12 rounded-xl transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transform hover:-translate-y-1"
                                        >
                                            Pagar Guia de Federação (R$ 50,00)
                                        </button>
                                    </div>
                                )}

                                {fedPaymentStep && !fedGatewayResponse && (
                                    <div className="bg-zinc-800 p-6 rounded-xl border border-white/5 animate-fade-in mt-6">
                                        <h3 className="text-lg font-bold mb-4">Finalizar Pagamento - R$ 50,00</h3>
                                        
                                        {!showFedCardForm ? (
                                            <div className="space-y-4">
                                                <p className="text-sm text-gray-400 mb-6">Escolha como deseja pagar a taxa anual da confederação.</p>
                                                
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    <button
                                                        onClick={() => setFedPaymentMethod('PIX')}
                                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                                            fedPaymentMethod === 'PIX' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/30 bg-zinc-900'
                                                        }`}
                                                    >
                                                        <div className="w-12 h-12 mb-3 bg-[#32BCAD] rounded-full flex items-center justify-center">
                                                            <span className="text-white font-black text-xs">PIX</span>
                                                        </div>
                                                        <span className="font-bold">Pagar com Pix</span>
                                                        <span className="text-xs text-gray-400 mt-1">Aprovação imediata</span>
                                                    </button>
                                                    
                                                    <button
                                                        onClick={() => setFedPaymentMethod('CREDIT_CARD')}
                                                        className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all ${
                                                            fedPaymentMethod === 'CREDIT_CARD' ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/30 bg-zinc-900'
                                                        }`}
                                                    >
                                                        <div className="w-12 h-12 mb-3 bg-blue-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                        </div>
                                                        <span className="font-bold">Cartão de Crédito</span>
                                                        <span className="text-xs text-gray-400 mt-1">Até 12x s/ juros</span>
                                                    </button>
                                                </div>

                                                <div className="flex gap-4 mt-8">
                                                    <button
                                                        onClick={() => setFedPaymentStep(false)}
                                                        className="flex-1 py-3 px-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors"
                                                        disabled={fedProcessing}
                                                    >
                                                        Cancelar
                                                    </button>
                                                    <button
                                                        onClick={() => fedPaymentMethod === 'PIX' ? processFedPayment() : setShowFedCardForm(true)}
                                                        className="flex-1 py-3 px-4 rounded-xl bg-amber-500 text-black font-black hover:bg-amber-600 transition-colors flex items-center justify-center"
                                                        disabled={fedProcessing}
                                                    >
                                                        {fedProcessing ? (
                                                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                        ) : (
                                                            'Continuar Pagamento'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <button 
                                                    onClick={() => setShowFedCardForm(false)}
                                                    className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-2"
                                                >
                                                    ← Voltar para métodos
                                                </button>
                                                <CardCheckoutForm 
                                                    amount={50}
                                                    onPaymentSuccess={processFedPayment}
                                                    onCancel={() => setShowFedCardForm(false)}
                                                    orderId="FEDERATION_TEMP"
                                                    mpPublicKey=""
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {fedGatewayResponse && (
                                    <div className="bg-zinc-800 p-8 rounded-xl border border-white/5 text-center mt-6 animate-fade-in">
                                        {fedGatewayResponse.status === 'approved' ? (
                                            <div>
                                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 transform scale-110 animate-pulse">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <h3 className="text-2xl font-black text-green-500 mb-2">PAGAMENTO APROVADO!</h3>
                                                <p className="text-gray-300">Sua anuidade da federação foi validada com sucesso.</p>
                                                <p className="text-sm text-gray-500 mt-4">Atualizando seus dados...</p>
                                            </div>
                                        ) : fedGatewayResponse.qrCodeBase64 ? (
                                            <div>
                                                <h3 className="text-xl font-bold mb-2">Escaneie o QR Code via Pix</h3>
                                                <p className="text-sm text-gray-400 mb-6">Aguardando confirmação do pagamento... Não feche esta tela.</p>
                                                
                                                <div className="bg-white p-4 rounded-xl inline-block mb-6 relative group">
                                                    <img src={`data:image/jpeg;base64,${fedGatewayResponse.qrCodeBase64}`} alt="QR Code PIX" className="w-64 h-64" />
                                                </div>

                                                <div className="max-w-md mx-auto">
                                                    <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Ou copie e cole o código abaixo:</p>
                                                    <div className="flex bg-black rounded-lg border border-white/10 overflow-hidden">
                                                        <input 
                                                            type="text" 
                                                            value={fedGatewayResponse.qrCodeCopyPaste} 
                                                            readOnly 
                                                            className="flex-1 bg-transparent text-xs text-gray-300 p-3 outline-none"
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(fedGatewayResponse.qrCodeCopyPaste);
                                                                toast.success('Código PIX Copiado!');
                                                            }}
                                                            className="bg-amber-500 text-black px-4 font-bold text-xs hover:bg-amber-600 transition-colors"
                                                        >
                                                            Copiar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                                </div>
                                                <h3 className="text-xl font-bold text-red-500 mb-2">Pagamento Recusado</h3>
                                                <p className="text-gray-300 mb-6">{fedGatewayResponse.message || 'Houve um problema com a transação.'}</p>
                                                <button 
                                                    onClick={() => {
                                                        setFedGatewayResponse(null);
                                                        setFedProcessing(false);
                                                    }}
                                                    className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/5 transition-colors"
                                                >
                                                    Tentar Novamente
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
