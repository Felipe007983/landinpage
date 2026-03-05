import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Plus, Power, Pencil, Trash2, Camera, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('champs');
    const [championships, setChampionships] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

    // Validator State
    const [scanResult, setScanResult] = useState<any>(null);
    const [manualUuid, setManualUuid] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    // New Champ Form / Edit Form
    const [form, setForm] = useState({
        name: '', description: '', date: '', location: '', priceComp: 0, priceVis: 0, banner: ''
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
            return;
        }

        if (activeTab === 'champs') fetchChamps();
        if (activeTab === 'orders') fetchOrders();

        // Scanner Cleanup
        return () => {
            // Se houver algum scanner rodando, ele morre aqui no unmount
        };
    }, [activeTab, user, navigate]);

    useEffect(() => {
        let scanner: any = null;
        if (activeTab === 'validator') {
            scanner = new Html5QrcodeScanner("reader", {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0
            }, false);

            scanner.render((decodedText: string) => {
                scanner.pause(true);
                handleValidate(decodedText);
            }, () => { });
        }

        return () => {
            if (scanner) {
                scanner.clear().catch((e: any) => console.error("Erro ao limpar scanner", e));
            }
        };
    }, [activeTab]);

    const handleValidate = async (uuid: string) => {
        setIsValidating(true);
        setScanResult(null);
        try {
            const { data } = await api.post('/tickets/validate', { uuid });
            setScanResult({ status: 'success', message: data.message, detail: data.ticket });
            setShowResultModal(true);
            // Se validou com sucesso, talvez atualizar a lista de ordens se estivermos vendo também
            if (activeTab === 'orders') fetchOrders();
        } catch (err: any) {
            setScanResult({ status: 'error', message: err.response?.data?.error || 'Erro na validação' });
            setShowResultModal(true);
        } finally {
            setIsValidating(false);
        }
    };

    const fetchChamps = async () => {
        const { data } = await api.get('/championships');
        setChampionships(data);
    };

    const fetchOrders = async () => {
        const { data } = await api.get('/admin/orders');
        setOrders(data);
    };

    const toggleStatus = async (id: string) => {
        await api.patch(`/admin/championships/${id}/status`);
        fetchChamps();
    };

    const handleCreateOrEditChamp = async (e: any) => {
        e.preventDefault();
        try {
            const payload = {
                ...form,
                date: new Date(form.date).toISOString(),
                priceComp: Number(form.priceComp),
                priceVis: Number(form.priceVis)
            };

            if (editingId) {
                await api.put(`/admin/championships/${editingId}`, payload);
                alert('Campeonato atualizado com sucesso!');
            } else {
                await api.post('/admin/championships', payload);
                alert('Campeonato criado com sucesso!');
            }

            fetchChamps();
            resetForm();
        } catch (err) {
            alert('Erro ao salvar campeonato');
        }
    };

    const handleEdit = (c: any) => {
        setEditingId(c.id);
        const formattedDate = new Date(c.date).toISOString().slice(0, 16);
        setForm({
            name: c.name,
            description: c.description,
            date: formattedDate,
            location: c.location,
            priceComp: c.priceComp,
            priceVis: c.priceVis,
            banner: c.banner || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja apagar o campeonato "${name}"? Esta ação não pode ser desfeita e só é possível se não houver vendas.`)) {
            try {
                await api.delete(`/admin/championships/${id}`);
                alert('Campeonato apagado com sucesso.');
                fetchChamps();
                if (editingId === id) resetForm();
            } catch (err: any) {
                alert(err.response?.data?.error || 'Erro ao apagar campeonato.');
            }
        }
    };

    const resetForm = () => {
        setForm({ name: '', description: '', date: '', location: '', priceComp: 0, priceVis: 0, banner: '' });
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-7xl">
                <div className="flex items-center gap-4 mb-8 border-b border-white/10 pb-6">
                    <ShieldCheck className="w-10 h-10 text-amber-500" />
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-widest text-amber-500">Painel de Controle Zeus</h1>
                        <p className="text-gray-400">Gerenciamento de Campeonatos e Transações</p>
                    </div>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('champs')}
                        className={`px-6 py-3 font-bold rounded-lg transition-colors ${activeTab === 'champs' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                    >
                        Campeonatos
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-bold rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                    >
                        Vendas & Ingressos
                    </button>
                    <button
                        onClick={() => setActiveTab('validator')}
                        className={`px-6 py-3 font-bold rounded-lg transition-colors flex items-center gap-2 ${activeTab === 'validator' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-white hover:bg-zinc-700'}`}
                    >
                        <Camera className="w-4 h-4" /> Portaria (Validar)
                    </button>
                </div>

                {activeTab === 'champs' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold uppercase mb-4 text-gray-300">Campeonatos Cadastrados</h2>
                            {championships.map(c => (
                                <div key={c.id} className="bg-zinc-900 border border-white/5 p-6 rounded-xl flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-bold text-lg">{c.name}</h3>
                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${c.status === 'OPEN' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-red-500 text-red-500 bg-red-500/10'}`}>
                                                {c.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-400">{new Date(c.date).toLocaleDateString('pt-BR')} - {c.location}</p>
                                    </div>
                                    <div className="flex gap-2 relative z-10">
                                        <button
                                            onClick={() => handleEdit(c)}
                                            title="Editar Campeonato"
                                            className="p-3 rounded-full transition-colors bg-zinc-700 hover:bg-zinc-600 text-white"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(c.id, c.name)}
                                            title="Apagar Campeonato"
                                            className="p-3 rounded-full transition-colors bg-red-900/50 hover:bg-red-700 text-red-500 hover:text-white"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(c.id)}
                                            title="Alternar Status"
                                            className={`p-3 rounded-full transition-colors ${c.status === 'OPEN' ? 'bg-amber-500 text-black hover:bg-amber-400' : 'bg-zinc-700 hover:bg-zinc-600 text-white'}`}
                                        >
                                            <Power className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <div className="bg-zinc-900 border border-amber-500/30 p-6 rounded-xl sticky top-24">
                                <h2 className="text-xl font-bold uppercase mb-4 flex items-center gap-2 text-amber-500">
                                    {editingId ? <Pencil className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                    {editingId ? 'Editar Evento' : 'Novo Evento'}
                                </h2>
                                <form onSubmit={handleCreateOrEditChamp} className="space-y-4 text-sm">
                                    <input type="text" placeholder="Nome do Campeonato" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                    <textarea placeholder="Descrição e Regras" required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                    <input type="datetime-local" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded text-gray-400" />
                                    <input type="text" placeholder="Local / Arena" required value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="number" step="0.01" min="0" placeholder="R$ Atleta" required value={form.priceComp} onChange={e => setForm({ ...form, priceComp: Number(e.target.value) })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                        <input type="number" step="0.01" min="0" placeholder="R$ Visitante" required value={form.priceVis} onChange={e => setForm({ ...form, priceVis: Number(e.target.value) })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                    </div>
                                    <input type="url" placeholder="URL da Capa (Imagem)" value={form.banner} onChange={e => setForm({ ...form, banner: e.target.value })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />

                                    <div className="flex gap-2">
                                        <button type="submit" className="flex-1 bg-amber-500 text-black font-black uppercase py-3 rounded hover:bg-amber-400 transition-colors">
                                            {editingId ? 'Salvar Edição' : 'Criar Campeonato'}
                                        </button>
                                        {editingId && (
                                            <button type="button" onClick={resetForm} className="bg-zinc-700 text-white font-bold uppercase px-4 py-3 rounded hover:bg-zinc-600 transition-colors">
                                                Cancelar
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div className="space-y-6">
                        {/* Summary Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl flex flex-col justify-center">
                                <span className="text-gray-400 uppercase font-bold text-xs tracking-widest mb-1">Quantidade de Vendas</span>
                                <span className="text-4xl font-black text-amber-500">{orders.length}</span>
                            </div>
                            <div className="bg-zinc-900 border border-white/5 p-6 rounded-xl flex flex-col justify-center">
                                <span className="text-gray-400 uppercase font-bold text-xs tracking-widest mb-1">Valor Total (Receita)</span>
                                <span className="text-4xl font-black text-amber-500">
                                    R$ {orders.filter(o => o.paymentStatus === 'APPROVED').reduce((acc, o) => acc + o.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Orders Table */}
                        <div className="bg-zinc-900 border border-white/5 rounded-xl overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 uppercase tracking-widest text-xs text-amber-500 bg-black/30">
                                        <th className="p-4 rounded-tl-xl">Cliente</th>
                                        <th className="p-4">Evento</th>
                                        <th className="p-4">Tipo</th>
                                        <th className="p-4">Valor</th>
                                        <th className="p-4 rounded-tr-xl">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-gray-400">Nenhuma venda registrada até o momento.</td></tr>
                                    ) : (
                                        orders.map(o => (
                                            <tr key={o.id} className="border-b border-white/5 hover:bg-white/5 transition-colors text-sm">
                                                <td className="p-4">
                                                    <div className="font-bold">{o.user?.name}</div>
                                                    <div className="text-xs text-gray-500">{o.user?.email}</div>
                                                </td>
                                                <td className="p-4 font-bold">{o.championship?.name}</td>
                                                <td className="p-4 text-xs font-mono">{o.type}</td>
                                                <td className="p-4 font-bold text-amber-500">R$ {o.amount.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded border ${o.paymentStatus === 'APPROVED' ? 'border-green-500 text-green-500 bg-green-500/10' : 'border-amber-500 text-amber-500 bg-amber-500/10'}`}>
                                                        {o.paymentStatus}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'validator' && (
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                            <div className="p-6 border-b border-white/10 bg-black/30 flex items-center justify-between">
                                <h2 className="text-xl font-bold uppercase flex items-center gap-2">
                                    <Camera className="text-amber-500" /> Scanner de Ingressos
                                </h2>
                                {isValidating && <span className="text-xs animate-pulse text-amber-500 font-bold">Processando...</span>}
                            </div>

                            <div className="p-8">
                                <div id="reader" className="bg-black rounded-xl overflow-hidden border border-zinc-800 mb-6"></div>

                                <div className="flex items-center gap-4 text-gray-500 mb-6 font-bold text-[10px] uppercase tracking-tighter">
                                    <hr className="flex-1 border-white/5" /> ou digitar código manual <hr className="flex-1 border-white/5" />
                                </div>

                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="UUID do Ingresso"
                                        value={manualUuid}
                                        onChange={e => setManualUuid(e.target.value)}
                                        className="flex-1 bg-zinc-800 border border-zinc-700 p-3 rounded text-sm font-mono focus:outline-none focus:border-amber-500"
                                    />
                                    <button
                                        onClick={() => handleValidate(manualUuid)}
                                        disabled={isValidating || !manualUuid}
                                        className="bg-zinc-700 hover:bg-zinc-600 px-4 rounded transition-colors disabled:opacity-50"
                                    >
                                        <Search className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Modal de Resultado da Validação */}
                        {showResultModal && scanResult && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
                                <div className={`w-full max-w-md p-8 rounded-3xl border-2 flex flex-col items-center text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300 ${scanResult.status === 'success' ? 'bg-zinc-900 border-green-500/50 text-green-500' : 'bg-zinc-900 border-red-500/50 text-red-500'}`}>
                                    {scanResult.status === 'success' ? (
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                    ) : (
                                        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
                                            <XCircle className="w-12 h-12" />
                                        </div>
                                    )}

                                    <h3 className="text-3xl font-black uppercase mb-2 tracking-tighter leading-none">{scanResult.message}</h3>

                                    {scanResult.detail ? (
                                        <div className="mt-8 text-left w-full space-y-4 bg-black/40 p-6 rounded-2xl border border-white/5">
                                            <div>
                                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Participante</p>
                                                <p className="text-white font-bold text-lg leading-tight">{scanResult.detail.order?.user?.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Campeonato</p>
                                                <p className="text-white font-bold leading-snug">{scanResult.detail.order?.championship?.name}</p>
                                            </div>
                                            <div className="flex justify-between items-end gap-2">
                                                <div>
                                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Tipo de Ingresso</p>
                                                    <p className="text-amber-500 font-black text-sm uppercase tracking-wider">
                                                        {scanResult.detail.order?.type === 'COMPETITOR' ? 'Passe Competidor' : 'Ingresso Visitante'}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Status</p>
                                                    <p className="text-green-500 font-black text-xs uppercase bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Válido para Acesso</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-4 p-4 text-sm text-gray-400 font-medium">
                                            {scanResult.message === 'TICKET JÁ UTILIZADO' ? 'Este ingresso já foi validado anteriormente e não pode ser usado novamente.' : 'Não conseguimos localizar este ingresso em nossa base de dados.'}
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowResultModal(false);
                                            setScanResult(null);
                                            // O scanner voltará ao estado original ou resetará dependendo de como o useEffect lida com isso.
                                            // Na verdade, como demos scanner.pause(true), precisamos dar resume ou recriar.
                                            // Vamos forçar um refresh do tab para simplificar ou gerenciar o scanner melhor.
                                            setActiveTab('');
                                            setTimeout(() => setActiveTab('validator'), 10);
                                        }}
                                        className={`mt-10 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-lg transition-all active:scale-95 shadow-lg ${scanResult.status === 'success' ? 'bg-green-500 text-black hover:bg-green-400' : 'bg-red-500 text-white hover:bg-red-400'}`}
                                    >
                                        Próximo Ingresso
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="mt-6 text-center text-gray-500 text-xs">
                            <p>Dica: No celular, aponte a câmera para o QR Code do ingresso. <br /> A validação ocorrerá instantaneamente.</p>
                        </div>

                        <style>{`
                            #reader button { background: #f59e0b !important; color: black !important; font-weight: 800 !important; border-radius: 6px !important; border: none !important; padding: 8px 16px !important; text-transform: uppercase !important; cursor: pointer !important; margin-top: 10px !important; }
                            #reader select { background: #27272a !important; color: white !important; border: 1px solid #3f3f46 !important; border-radius: 4px !important; padding: 4px !important; margin: 4px !important; }
                            #reader a { display: none !important; }
                            #reader { border: none !important; }
                            #reader__scan_region { display: flex; justify-content: center; }
                        `}</style>
                    </div>
                )}
            </div>
        </div>
    );
}
