import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { RedirectToHome } from './components/RedirectToHome';
import { StandardPage } from './pages/StandardPage';

// Imports of images
import Company1 from './assets/images/company-1.jpeg';
import Company2 from './assets/images/company-2.jpeg';
import Company3 from './assets/images/company-3.jpeg';
import Company4 from './assets/images/company-4.jpeg';
import ZeusBanner from './assets/images/zeusbanner.jpeg';
import Video1 from './assets/images/video1.mp4';
import DueloPortfolio from './assets/images/duelo/PORTFÓLIOPATROCÍNADORESDUELODE GIGANTESEVOLUTION2026.pdf';
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

import Corujao1 from './assets/images/corujao/corujao-1.png';
import Corujao2 from './assets/images/corujao/corujao-2.png';
import Corujao3 from './assets/images/corujao/corujao-3.jpeg';
import Corujao4 from './assets/images/corujao/corujao-4.jpeg';

import Trophy1 from './assets/images/tropy/trophy-1.jpeg';
import Trophy2 from './assets/images/tropy/trophy-2.jpeg';
import Trophy3 from './assets/images/tropy/trophy-3.jpeg';
import Trophy4 from './assets/images/tropy/trophy-4.jpeg';

import ColabGoias from './assets/images/colaborador_zeus1.jpeg';
import LeoPestana from './assets/images/Léo pestana.jpeg';
import ReginaldoGomes from './assets/images/Reginaldo  Gomes.jpeg';
import Team1 from './assets/images/duelo/1.jpeg';
import Team2 from './assets/images/duelo/2.jpeg';
import Team4 from './assets/images/duelo/4.jpeg';

export default function App() {
    const dueloTeam = [
        { id: 7, name: 'Reginaldo Gomes', role: 'Presidente WBPF Brasil / Presidente WBPF South America', image: ReginaldoGomes },
        { id: 2, name: 'Luciano Gonzales', role: '•Embaixador da WBPF Brasil \n•Presidente WBPF Goiás \n•Vice-Presidente Liga WBPF Minas \n•CEO. Fundador. Diretor do Zeus Evolution Brasil', image: Team2 },
        { id: 6, name: 'Diego Maradona', role: 'Vice-Presidente WBPF Goiás / Representante ZEUS Goiás', image: ColabGoias },
        { id: 8, name: 'Léo Pestana', role: 'Representante ZEUS São Paulo', image: LeoPestana },
    ];

    const darkTanTeam = [
        { id: 1, name: 'Wemerson Coruja', role: 'Presidente WBPF Triângulo Mineiro', image: Team1 },
        dueloTeam[0], // Luciano
        { id: 4, name: 'Thor Vieira', role: 'Supervisão Geral', image: Team4 },
    ];
    const clothingProducts = [
        Product1, Product2, Product3, Product4, Product5,
        Product6, Product7, Product8, Product9, Product10,
        Product11, Product12, Product13, Product14
    ];

    const darkTanProducts = [
        DarkTan1, DarkTan2, DarkTan3
    ];

    const corujaoProducts = [
        Corujao1, Corujao2, Corujao3, Corujao4
    ];

    const trophyProducts = [
        Trophy1, Trophy2, Trophy3, Trophy4
    ];

    return (
        <Router>
            <RedirectToHome />
            <Layout>
                <Routes>
                    {/* Duelo Central */}
                    <Route path="/" element={<StandardPage
                        title="Zeus Evolution"
                        subtitle="Expo Fitness e Campeonato de Fisiculturismo"
                        image={ZeusBanner}
                        secondaryVideo={Video1}
                        events={[Evento1]}
                        mvv={{
                            mission: "Promover o fisiculturismo com respeito, organização e profissionalismo, valorizando o atleta como peça central do evento e contribuindo para o crescimento do esporte em Minas Gerais, com foco em qualidade, experiência e evolução contínua.",
                            vision: "Evoluir de um campeonato regional para um evento fitness completo, integrando competição, feira e exposição, tornando-se referência no interior de Minas Gerais e ampliando sua presença no cenário nacional do fisiculturismo.",
                            values: "Respeito ao atleta, Crescimento dos Patrocinadores, Compromisso com o esporte, Profissionalismo, Organização, Evolução constante, Paixão pelo fisiculturismo"
                        }}
                        contacts={{
                            // instagram: "https://www.instagram.com/duelodegigantes18?igsh=YzI3bGNoYWU3bnV5",
                            whatsapp: "https://wa.me/553492440149"
                        }}
                        portfolio={DueloPortfolio}
                        historyTitle="A História do Zeus Evolution"
                        team={dueloTeam}
                        history={`O Zeus Evolution não nasceu apenas como um campeonato.
Nasceu de uma decisão.

Tudo começou quando participei de um campeonato acreditando em um projeto. Acreditei na proposta, na visão e no propósito. Porém, durante o processo, percebi que aquele caminho não representava o que eu defendia para o esporte.

Foi naquele momento que entendi: se eu queria algo diferente, eu teria que construir.

Sozinho, dei o primeiro passo. Conquistei a filiação da Federação e, mais que isso, o título nobre de Embaixador, além da confiança do presidente para colocar minhas ideias em prática em nome da Federação em âmbito nacional.

Ali, fiz uma promessa pessoal: criar um campeonato que realmente valorizasse o atleta. Um evento onde respeito, reconhecimento e profissionalismo não fossem apenas discurso — fossem prática.

Foi assim que nasceu o Zeus Evolution.

Muito além de um evento
O Zeus Evolution foi criado com a missão de elevar o padrão dos eventos de fisiculturismo. Cada detalhe passou a ser pensado para entregar algo diferente do comum:

• Troféus exclusivos e estilizados, desenvolvidos especialmente para cada categoria.
• Premiações em dinheiro para os campeões overall.
• Troféu de participação para todos os atletas, reconhecendo que subir ao palco já é uma vitória.
• Estrutura profissional de pintura com a Dark Tan, garantindo excelência no palco.
• Organização estratégica, produção própria e reinvestimento constante na experiência do atleta.

Aqui, o atleta não é número.
Ele é protagonista.

Inovação como base
Desde o início, o Zeus Evolution foi estruturado com visão empresarial e estratégica. A produção própria de troféus, o controle de qualidade e o planejamento financeiro inteligente permitem que o evento cresça mantendo alto padrão.

Cada edição não é apenas um campeonato.
É uma evolução.

Expansão e legado
Com edições em diferentes estados, o Zeus Evolution vem se consolidando como uma proposta ousada, profissional e respeitada dentro do cenário.

Mais que um campeonato, é uma marca.
Mais que uma marca, é um compromisso.

Nosso compromisso
• Valorizar o esforço.
• Premiar com respeito.
• Entregar excelência.
• Garantir que cada atleta saia do palco com orgulho de ter feito parte.

Zeus Evolution não é apenas sobre competir.
É sobre evoluir.`}
                        color="#D4AF37"
                        secondaryColor="#000000"
                        variant="duelo"
                    />} />

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
                            instagram: "https://www.instagram.com/clothingbodybuilding_?utm_source=qr&igsh=MXZobjVydnA4cGJ3bg==",
                            whatsapp: "https://wa.me/553492510023"
                        }}
                        color="#00008B"
                        secondaryColor="#000000"
                    />} />

                    {/* Companies Right */}
                    <Route path="/dark-tan-pro" element={<StandardPage
                        title="Dark Tan Pro"
                        subtitle="Official Stage Color"
                        image={Company4}
                        products={darkTanProducts}
                        mvv={{
                            mission: "Desenvolver produtos de bronzeamento profissional que realcem a definição muscular, garantam uniformidade de cor e respeitem a pele do atleta, contribuindo para um palco mais justo e visualmente impecável.",
                            vision: "Ser referência nacional em bronzeamento de palco, reconhecida por atletas, organizadores e federações pela qualidade, segurança e padrão profissional em competições de alto nível.",
                            values: "Excelência, Qualidade, Profissionalismo, Credibilidade, Segurança, Precisão, Inovação, Paixão pelo Fisiculturismo"
                        }}
                        contacts={{
                            instagram: "https://www.instagram.com/darktanpro?igsh=MXV5aGZnOHRpazdwaA==",
                            whatsapp: "https://wa.me/553492354877"
                        }}
                        history={`A História da Dark Tan Pro

A Dark Tan Pro nasceu de uma amizade construída dentro do fisiculturismo.

Emerson Coruja já era competidor e organizador de campeonatos. Do outro lado, Luciano que caminhoneiro e driblando as dificuldades da estra se aventurou no esporte tornando um atleta iniciante, dando os primeiros passos no palco. Foi nesse ambiente — de treino, competição e respeito pelo esporte — que nossa amizade começou.

Com o tempo, essa amizade evoluiu. Vieram as competições, o aprendizado e a confiança mútua. Hoje, somos parceiros.

Entre para somar no projeto que viria a se tornar o Zeus Evolution, ajudando a fortalecer o campeonato e elevar o nível do evento. E foi dentro desse processo que surgiu a ideia de criar nossa própria marca de pintura de atletas.

Assim nasceu a Dark Tan Pro: criada por quem vive o palco, entende o atleta e respeita cada detalhe da competição.

A Dark Tan Pro não nasceu do mercado.
Nasceu do esporte, da amizade e da evolução.`}
                        color="#8D5524"
                        secondaryColor="#808080"
                        team={darkTanTeam}
                    />} />

                    <Route path="/coruja-lanches" element={<StandardPage
                        title="Corujão Lanches"
                        subtitle="O que há de lanche mais saboroso"
                        image={Company3}
                        products={corujaoProducts}
                        mvv={{
                            mission: "Oferecer alimentação de qualidade e sabor, sendo o ponto de encontro preferido pós-treino e eventos.",
                            vision: "Expandir nossa marca mantendo a tradição do sabor caseiro e atendimento acolhedor.",
                            values: "Sabor, Qualidade, Hospitalidade e Tradição."
                        }}
                        contacts={{
                            instagram: "https://www.instagram.com/corujaolanchess?igsh=MXhkZW50eHZmemk4Mg==",
                            whatsapp: "https://wa.me/553484045438"
                        }}
                        color="#FFD700"
                        secondaryColor="#FF0000"
                    />} />
                </Routes>
            </Layout>
        </Router>
    );
}
