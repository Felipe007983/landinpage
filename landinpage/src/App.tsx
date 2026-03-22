import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { StandardPage } from './pages/StandardPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/Auth/AuthPage';
import { ResetPasswordPage } from './pages/Auth/ResetPasswordPage';
import { ClientAreaPage } from './pages/ClientArea/ClientAreaPage';
import { ValidatorPage } from './pages/Validator/ValidatorPage';
import { AdminDashboard } from './pages/Admin/AdminDashboard';
import { Toaster } from 'react-hot-toast';

// Imports of images
import Company1 from './assets/images/clothing-logo-new.jpg';
import Company2 from './assets/images/company-2.jpeg';
import DarkTanLogo from './assets/images/darktan.jpg';
import CapaBanner from './assets/images/capa.jpeg';
import Evento1 from './assets/images/evento1.jpeg';

import Product1 from './assets/images/roupas/product-1.jpeg';
import Product2 from './assets/images/roupas/product-2.jpeg';
import Product3 from './assets/images/roupas/product-3.jpeg';
import Product4 from './assets/images/roupas/product-4.jpeg';
import Product5 from './assets/images/roupas/product-5.jpeg';
import Product6 from './assets/images/roupas/product-6.jpeg';
import Product7 from './assets/images/roupas/product-7.jpeg';
import Product8 from './assets/images/roupas/product-8.jpeg';
import Product9 from './assets/images/roupas/product-9.jpeg';
import Product10 from './assets/images/roupas/product-10.jpeg';
import Product11 from './assets/images/roupas/product-11.jpeg';
import Product12 from './assets/images/roupas/product-12.jpeg';
import Product13 from './assets/images/roupas/product-13.jpeg';
import Product14 from './assets/images/roupas/product-14.jpeg';

import DarkTan1 from './assets/images/darktan/darktan-1.jpeg';
import DarkTan2 from './assets/images/darktan/darktan-2.jpeg';
import DarkTan3 from './assets/images/darktan/darktan-3.jpeg';

import Trofeu1 from './assets/images/tropy/trofeu1.jpeg';
import Trofeu2 from './assets/images/tropy/trofeu2.jpeg';
import Trofeu3 from './assets/images/tropy/trofeu3.jpeg';
import Trofeu4 from './assets/images/tropy/trofeu4.jpeg';
import Trofeu5 from './assets/images/tropy/trofeu5.jpeg';
import Trofeu6 from './assets/images/tropy/trofeu6.jpeg';

import Info1 from './assets/images/Info1.jpeg';
import Info2 from './assets/images/Info2.jpeg';
import Info3 from './assets/images/Info3.jpeg';
import Info4 from './assets/images/Info4.jpeg';
import Info5 from './assets/images/Info5.jpeg';
import Info6 from './assets/images/Info6.jpeg';
import Info7 from './assets/images/Info7.jpeg';
import Info8 from './assets/images/Info8.jpeg';

import ColabGoias from './assets/images/colaborador_zeus1.jpeg';
import LeoPestana from './assets/images/Léo pestana.jpeg';
import ReginaldoGomes from './assets/images/Reginaldo  Gomes.jpeg';
// import CarolinaBarone from './assets/images/carolina barone.jpeg';
import Nomeacao1 from './assets/images/nomeacao1.pdf';
import Nomeacao2 from './assets/images/nomeacao2.pdf';
import BrandLuciano from './assets/images/luciano.jpeg';
import QrCode from './assets/images/qrcode.jpeg';

export default function App() {
    const dueloTeam = [
        { id: 2, name: 'Luciano Gonzales', role: '•Embaixador da WBPF Brasil \n•Presidente WBPF Goiás \n•Vice-Presidente Liga WBPF Minas \n•CEO. Fundador. Diretor do Zeus Evolution Brasil', image: BrandLuciano, duration: 8000 },
        { id: 7, name: 'Reginaldo Gomes', role: 'Presidente WBPF Brasil / Presidente WBPF South America', image: ReginaldoGomes },
        { id: 6, name: 'Diego Maradona', role: 'Vice-Presidente WBPF Goiás / Representante Zeus Evolution Goiás', image: ColabGoias },
        { id: 8, name: 'Léo Pestana', role: 'Representante Zeus Evolution São Paulo', image: LeoPestana },
    ];

    const darkTanTeam = [
        dueloTeam[0], // Luciano
    ];
    const clothingProducts = [
        Product1, Product2, Product3, Product4, Product5,
        Product6, Product7, Product8, Product9, Product10,
        Product11, Product12, Product13, Product14
    ];

    const darkTanProducts = [
        DarkTan1, DarkTan2, DarkTan3
    ];

    const trophyProducts = [
        { image: Trofeu1, name: "Troféu Padrão Feminino Ouro" },
        { image: Trofeu2, name: "Troféu Padrão Masculino Ouro" },
        { image: Trofeu3, name: "Troféu Modelo Zeus Ouro" },
        { image: Trofeu4, name: "Troféu Modelo Zeus Prata" },
        { image: Trofeu5, name: "Troféu Modelo Zeus Bronze" },
        { image: Trofeu6, name: "Ouro, Prata, Bronze e Participação" },
    ];

    const infoImages = [
        Info2, Info1, Info7, Info3, Info4, Info6, Info5, Info8
    ];

    return (
        <>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' },
                    success: { iconTheme: { primary: '#f59e0b', secondary: '#000' } }
                }}
            />
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <Layout>
                    <Routes>
                        <Route path="/" element={<StandardPage
                            title="Zeus Evolution"
                            subtitle="Expo Fitness e Campeonato de Fisiculturismo"
                            image={CapaBanner}
                            showPartnership={true}
                            events={[Evento1]}
                            mvv={{
                                mission: "Promover um evento de fisiculturismo e fitness de alto padrão, valorizando o atleta em todas as etapas – da estrutura à premiação – proporcionando uma experiência profissional, justa e memorável para competidores, público, patrocinadores e parceiros.",
                                vision: "Transformar o Zeus Evolution em um dos maiores eventos fitness do Brasil, unindo competição de alto nível, feira de negócios e experiências exclusivas, posicionando-se como referência nacional em estrutura, inovação e valorização do atleta.",
                                values: "• Valorização do atleta: Reconhecer o esforço, a disciplina e a trajetória de cada competidor.\n• Excelência e profissionalismo: Entregar organização, estrutura e premiação em padrão nacional.\n• Transparência e ética: Atuar com respeito às regras, clareza nas informações e justiça nas decisões.\n• Inovação: Buscar constantemente evolução em formato, experiências e oportunidades dentro do evento.\n• Crescimento do esporte: Contribuir para o fortalecimento do fisiculturismo no cenário nacional."
                            }}
                            contacts={{
                                instagram: "https://www.instagram.com/zeusevolutioncb?igsh=MWR1Y25lZWo1NDM3bw==",
                                whatsapp: "https://wa.me/553492440149"
                            }}
                            historyTitle="A História do Zeus Evolution"
                            team={dueloTeam}
                            documents={[
                                { label: "Nomeação", file: Nomeacao1 },
                                { label: "Nomeação", file: Nomeacao2 }
                            ]}
                            qrCode={QrCode}
                            history={`ZEUS. MAIS QUE UM EVENTO, UM SISTEMA.

O Zeus nasce com um propósito claro: elevar o padrão do fisiculturismo nacional e mundial. 
Somos um evento autossustentável, com estrutura própria e parcerias estratégicas que garantem qualidade, da produção dos troféus às camisetas, da capacitação da equipe à entrega final no palco.
Criado, idealizado e fundado em Uberlândia  MG, por Luciano Gonzalez, embaixador da WPF Brasil, e com a Concessão do Ilmo Sr Reginaldo Gomes presidente da WBPF Brasil e levar a WBPF no seu lugar do cenário. 
O Zeus não improvisa. Aqui, tudo é planejado e executado com excelência.
Nosso modelo é simples e sólido: levamos uma estrutura completa, com equipe treinada.
O parceiro local cuida da praça. O Zeus cuida do evento.
Trabalhamos com transparência total: todos os custos operacionais são quitados, equipe, produção, premiação, estrutura, taxas e serviços. O investimento é respeitado. E o resultado é dividido de forma justa.
O Zeus Evolution nasce para quebrar um padrão antigo onde o atleta paga caro, e recebe pouco.
No Zeus, o atleta tem Premiações em dinheiro reais
Inscrições acessíveis, 
O campeão Overall do Zeus Evolution não leva apenas um troféu, ele garante vaga no Campeonato Brasileiro com inscrição e hospedagem custeadas pelo Zeus. E se consagrando novamente, no cenário nacional…
O caminho se abre para o Mundial na Áustria
Aqui, o atleta não aposenta no seu auge,  ele evolui.

O Zeus não segue o mercado.

O Zeus cria um novo padrão.`}
                            color="#D4AF37"
                            secondaryColor="#000000"
                            variant="duelo"
                            infoImages={infoImages}
                        />} />

                        {/* New Core Routes */}
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route path="/minha-conta" element={<ProtectedRoute><ClientAreaPage /></ProtectedRoute>} />
                        <Route path="/validar-ticket" element={<ProtectedRoute adminOnly><ValidatorPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />

                        {/* Companies Left */}
                        <Route path="/trophy-gonzales" element={<StandardPage
                            title="Trophy Gonzales"
                            subtitle="Excelência em premiações e reconhecimento."
                            image={Company2}
                            products={trophyProducts}
                            mvv={{
                                mission: "Criar troféus e medalhas que não sejam apenas objetos, mas símbolos eternos de conquista e glória.",
                                vision: "Ser a referência absoluta em design e qualidade de premiações esportivas personalizadas.",
                                values: "Qualidade Artesanal, Criatividade, Pontualidade e Reconhecimento."
                            }}
                            contacts={{
                                instagram: "https://instagram.com/trophygonzales",
                                whatsapp: "https://wa.me/553492354877"
                            }}
                            color="#FFD700"
                            secondaryColor="#00008B"
                        />} />

                        <Route path="/clothing-bodybuilding" element={<StandardPage
                            title="Clothing"
                            subtitle="A marca que veste o atleta e o amante do esporte"
                            image={Company1}
                            products={clothingProducts}
                            mvv={{
                                mission: "Desenvolver roupas fitness que sejam tão funcionais quanto estilísticas, para ajudar você a se sentir bem e se apresentar bem, dentro e fora da academia.",
                                vision: "Ser reconhecida como a marca que veste o atleta e o amante do esporte como o conforto e qualidade, levando satisfação a todos os clientes, de acordo com a Clothing Bodybuilding.",
                                values: "Gratidão, Excelência, Audácia, Inovação, Qualidade, Paixão pelo Bodybuilding."
                            }}
                            contacts={{
                                instagram: "https://www.instagram.com/clothingbodybuilding?utm_source=qr&igsh=MXZobjVydnA4cGJ3bg==",
                                whatsapp: "https://wa.me/553492510023"
                            }}
                            color="#00008B"
                            secondaryColor="#000000"
                        />} />

                        {/* Companies Right */}
                        <Route path="/dark-tan" element={<StandardPage
                            title="Dark Tan"
                            subtitle="Official Stage Color"
                            image={DarkTanLogo}
                            products={darkTanProducts}
                            mvv={{
                                mission: "Desenvolver produtos de bronzeamento profissional que realcem a definição muscular, garantam uniformidade de cor e respeitem a pele do atleta, contribuindo para um palco mais justo e visualmente impecável.",
                                vision: "Ser referência nacional em bronzeamento de palco, reconhecida por atletas, organizadores e federações pela qualidade, segurança e padrão profissional em competições de alto nível.",
                                values: "Excelência, Qualidade, Profissionalismo, Credibilidade, Segurança, Precisão, Inovação, Paixão pelo Fisiculturismo"
                            }}
                            contacts={{
                                instagram: "https://www.instagram.com/darktanpro?utm_source=qr&igsh=MXgyNW1jM3A0dm5lZw==",
                                whatsapp: "https://wa.me/5516997121563"
                            }}
                            history={`A História da Dark Tan

A Dark Tan nasceu de uma amizade construída dentro do fisiculturismo.

Wemerson já era competidor e organizador de campeonatos. Do outro lado, Luciano que caminhoneiro e driblando as dificuldades da estra se aventurou no esporte tornando um atleta iniciante, dando os primeiros passos no palco. Foi nesse ambiente — de treino, competição e respeito pelo esporte — que nossa amizade começou.

Com o tempo, essa amizade evoluiu. Vieram as competições, o aprendizado e a confiança mútua. Hoje, somos parceiros.

Entre para somar no projeto que viria a se tornar o Zeus Evolution, ajudando a fortalecer o campeonato e elevar o nível do evento. E foi dentro desse processo que surgiu a ideia de criar nossa própria marca de pintura de atletas.

Assim nasceu a Dark Tan: criada por quem vive o palco, entende o atleta e respeita cada detalhe da competição.

A Dark Tan não nasceu do mercado.
Nasceu do esporte, da amizade e da evolução.`}
                            color="#8D5524"
                            secondaryColor="#808080"
                            team={darkTanTeam}
                        />} />
                    </Routes>
                </Layout>
            </Router>
        </>
    );
}
