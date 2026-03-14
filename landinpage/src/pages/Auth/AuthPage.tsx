import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import LogoZeus from '../../assets/images/logo_zeus_new.png';
import toast from 'react-hot-toast';

export function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        name: '', email: '', cpf: '', phone: '', password: ''
    });

    const handleChange = (e: any) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const payload = isLogin ? { email: form.email, password: form.password } : form;

            const { data } = await api.post(endpoint, payload);
            login(data.token, data.user);
            const target = location.state?.returnTo
                ? location.state.returnTo
                : data.user?.role?.toUpperCase() === 'ADMIN'
                    ? '/admin'
                    : '/minha-conta';
            const state = location.state?.returnTo ? location.state : undefined;
            setTimeout(() => navigate(target, state ? { state } : undefined), 0);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Erro ao autenticar');
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

                <h2 className="text-2xl font-black uppercase text-center mb-6 tracking-wider">
                    {isLogin ? 'Faça seu Login' : 'Crie sua Conta'}
                </h2>

                <div className="flex bg-zinc-800 rounded-lg p-1 mb-8">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-md transition-colors ${isLogin ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-bold uppercase rounded-md transition-colors ${!isLogin ? 'bg-amber-500 text-black shadow-md' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Cadastro
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {!isLogin && (
                        <>
                            <input type="text" name="name" placeholder="Nome Completo" required onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                            <input type="text" name="cpf" placeholder="CPF" required onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                            <input type="text" name="phone" placeholder="Telefone" required onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                        </>
                    )}
                    <input type="email" name="email" placeholder="E-mail" required onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />
                    <input type="password" name="password" placeholder="Senha" required onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-amber-500" />

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={async () => {
                                if (!form.email) return toast.error('Digite seu e-mail primeiro');
                                try {
                                    setLoading(true);
                                    await api.post('/auth/forgot-password', { email: form.email });
                                    toast.success('Link de recuperação enviado para seu e-mail!');
                                } catch (err: any) {
                                    toast.error(err.response?.data?.error || 'Erro ao solicitar recuperação');
                                } finally {
                                    setLoading(false);
                                }
                            }}
                            className="text-xs text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest"
                        >
                            Esqueceu a senha?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-widest py-4 rounded-lg mt-2 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>
            </div>
        </div>
    );
}
