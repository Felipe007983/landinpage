import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { RedirectToHome } from './components/RedirectToHome';
import { StandardPage } from './pages/StandardPage';

// Imports of images
import Company1 from './assets/images/company-1.jpeg';
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

import Trophy1 from './assets/images/tropy/trophy-1.jpeg';
import Trophy2 from './assets/images/tropy/trophy-2.jpeg';
import Trophy3 from './assets/images/tropy/trophy-3.jpeg';
import Trophy4 from './assets/images/tropy/trophy-4.jpeg';

import ColabGoias from './assets/images/colaborador_zeus1.jpeg';
import LeoPestana from './assets/images/Léo pestana.jpeg';
import ReginaldoGomes from './assets/images/Reginaldo  Gomes.jpeg';
import CarolinaBarone from './assets/images/carolina barone.jpeg';
import Nomeacao1 from './assets/images/nomeacao1.pdf';
import Nomeacao2 from './assets/images/nomeacao2.pdf';
import BrandLuciano from './assets/images/luciano.jpeg';
import QrCode from './assets/images/qrcode.jpeg';

export default function App() {
    const dueloTeam = [
        { id: 2, name: 'Luciano Gonzales', role: '•Embaixador da WBPF Brasil \n•Presidente WBPF Goiás \n•Vice-Presidente Liga WBPF Minas \n•CEO. Fundador. Diretor do Zeus Evolution Brasil', image: BrandLuciano },
        { id: 7, name: 'Reginaldo Gomes', role: 'Presidente WBPF Brasil / Presidente WBPF South America', image: ReginaldoGomes },
        { id: 6, name: 'Diego Maradona', role: 'Vice-Presidente WBPF Goiás / Representante Zeus Evolution Goiás', image: ColabGoias },
        { id: 8, name: 'Léo Pestana', role: 'Representante Zeus Evolution São Paulo', image: LeoPestana },
        { id: 9, name: '**Russa** (Carolina Barone)', role: '•Diretora Oficial de Tanning – Zeus Evolution\n•Representante Oficial Dark Tan Brasil', image: CarolinaBarone, scale: 1.4 },
    ];

    const darkTanTeam = [
        dueloTeam[0], // Luciano
        dueloTeam[4], // Carolina
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
        Trophy1, Trophy2, Trophy3, Trophy4
    ];

    return (
        <Router>
            <RedirectToHome />
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
                        history={`Alguns campeonatos nascem por oportunidade.
Outros nascem por necessidade.
O Zeus Evolution nasceu por decisão.

Tudo começou quando seu fundador subiu ao palco acreditando em um projeto. Ele confiava na proposta. Confiava na visão. Confiava no propósito.
Mas, no decorrer da jornada, percebeu que aquilo já não representava o que ele defendia para o esporte.

Naquele momento, uma escolha precisava ser feita.
Aceitar o padrão…
Ou criar um novo.
Ele escolheu construir.

Sozinho, deu o primeiro passo. Conquistou a filiação da Federação. Recebeu o título de Embaixador. Ganhou a confiança para colocar suas ideias em prática em âmbito nacional.

Mas o que realmente nasceu ali não foi apenas um campeonato.
Foi um compromisso.
O compromisso de criar um evento onde o atleta fosse respeitado.
Onde o reconhecimento fosse real.
Onde o profissionalismo deixasse de ser promessa e se tornasse padrão.
Assim surgiu o Zeus Evolution.

Muito além do palco
Desde o início, nada foi pensado para ser comum.
Cada troféu passou a ser exclusivo.
Cada categoria, valorizada.
Cada campeão overall, premiado em dinheiro.
Cada atleta, independentemente da colocação, reconhecido com um troféu de participação — porque subir ao palco já é um ato de coragem.
A pintura deixou de ser detalhe e se tornou parte da experiência, com estrutura profissional através da Dark Tan.
Organização estratégica.
Produção própria.
Reinvestimento constante.

Aqui, o atleta não é número.
Ele é protagonista.

Mentalidade de evolução
O Zeus Evolution foi estruturado como marca.
Como empresa.
Como movimento.
Produção própria de troféus.
Controle de qualidade.
Planejamento financeiro inteligente.
Crescimento sustentável.

Cada edição não é repetição.
É evolução.

Expansão e legado
Com edições em diferentes estados, o Zeus Evolution se consolida como uma proposta ousada, profissional e respeitada.
Não é apenas um campeonato.
É posicionamento.
É visão.
É construção de legado.

O que move o Zeus
Valorizar o esforço.
Premiar com respeito.
Entregar excelência.
Garantir que cada atleta saia do palco maior do que entrou.

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
                            instagram: "https://www.instagram.com/darktanpro?igsh=MXV5aGZnOHRpazdwaA==",
                            whatsapp: "https://wa.me/553492354877"
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
    );
}
