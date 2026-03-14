import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import LogoZeus from '../../assets/images/logo_zeus_new.png';
import toast from 'react-hot-toast';

export function ResetPasswordPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error('As senhas não coincidem');
        }

        if (passwords.newPassword.length < 6) {
            return toast.error('A senha deve ter pelo menos 6 caracteres');
        }

        setLoading(true);
        try {
            await api.post('/auth/reset-password', {
                token,
                newPassword: passwords.newPassword
            });
            toast.success('Senha atualizada com sucesso!');
            navigate('/auth');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao redefinir senha');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center py-24 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-black z-0"></div>

            <div className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-8 relative z-10 shadow-2xl backdrop-blur-md">
                <div className="flex justify-center mb-8">
                    <img src={LogoZeus} alt="Zeus Evolution" className="w-20 h-20 rounded-full border border-amber-500 shadow-[0_0_15px_rgba(212,175,55,0.3)]" />
                </div>

                <h2 className="text-2xl font-black uppercase text-center mb-2 tracking-wider">
                    Nova Senha
                </h2>
                <p className="text-gray-400 text-sm text-center mb-8">Digite sua nova senha de acesso abaixo.</p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <input 
                        type="password" 
                        placeholder="Nova Senha" 
                        required 
                        value={passwords.newPassword}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" 
                    />
                    <input 
                        type="password" 
                        placeholder="Confirme a Nova Senha" 
                        required 
                        value={passwords.confirmPassword}
                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" 
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-widest py-4 rounded-lg mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Aguarde...' : 'Atualizar Senha'}
                    </button>
                </form>
            </div>
        </div>
    );
}
