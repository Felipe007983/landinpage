import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import LogoZeus from '../../assets/images/logo_zeus.jpg';

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
            if (location.state?.returnTo) {
                navigate(location.state.returnTo, { state: location.state });
            } else {
                navigate('/minha-conta');
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Erro ao autenticar');
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black uppercase tracking-widest py-4 rounded-lg mt-4 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
                    </button>
                </form>
            </div>
        </div>
    );
}
