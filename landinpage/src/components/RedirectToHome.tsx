import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function RedirectToHome() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Se a rota atual não for a raiz (/), redireciona para a raiz
        if (location.pathname !== '/') {
            navigate('/', { replace: true });
        }
    }, []); // Executa apenas uma vez na montagem do componente

    return null; // Este componente não renderiza nada visualmente
}
