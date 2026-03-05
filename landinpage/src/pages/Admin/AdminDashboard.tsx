import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Plus, Power, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('champs');
    const [championships, setChampionships] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);

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
    }, [activeTab, user, navigate]);

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
                                        <input type="number" step="0.01" placeholder="R$ Atleta" required value={form.priceComp === 0 && !editingId ? '' : form.priceComp} onChange={e => setForm({ ...form, priceComp: Number(e.target.value) })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
                                        <input type="number" step="0.01" placeholder="R$ Visitante" required value={form.priceVis === 0 && !editingId ? '' : form.priceVis} onChange={e => setForm({ ...form, priceVis: Number(e.target.value) })} className="w-full bg-zinc-800 border-zinc-700 border p-3 rounded" />
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
            </div>
        </div>
    );
}
