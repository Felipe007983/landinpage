import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function RedirectToHome() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Redirecionamento removido ou ajustado para não interferir nas rotas novas
        // if (location.pathname !== '/') {
        //     navigate('/', { replace: true });
        // }
    }, []);

    return null; // Este componente não renderiza nada visualmente
}
