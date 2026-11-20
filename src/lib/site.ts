export const locales = ['en', 'pt'] as const;
export type Locale = typeof locales[number];
export const brand = {
  name: 'Andrey Maia',
  wordmark: 'andreymaia',
  github: 'https://github.com/andreylmaia',
  linkedin: 'https://www.linkedin.com/in/andreylmaia/',
  email: '',
  portrait: {src: 'images/andrey-maia.webp', width: 640, height: 691},
};

export const sections = ['insights', 'labs', 'intelligence', 'library', 'about', 'connect', 'privacy'] as const;
export const pillars = ['infrastructure', 'building', 'nature'] as const;
export const labIds = ['ledger', 'unit-economics', 'time-value'] as const;
export const language = (locale: Locale) => locale === 'pt' ? 'pt-BR' : 'en';
export const other = (locale: Locale): Locale => locale === 'en' ? 'pt' : 'en';
export function url(locale?: Locale, path = '') {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const parts = [base.replace(/^\//, ''), locale, path.replace(/^\/+|\/+$/g, '')].filter(Boolean);
  return '/' + (parts.length ? parts.join('/') + '/' : '');
}
export function asset(path: string) {
  return /^(https?:\/\/|data:)/.test(path) ? path : import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
}

export const copy = {
  en: {
    linkedin: {source: 'Source', website: 'Articles', post: 'LinkedIn Post', article: 'LinkedIn Article', read: 'Read on LinkedIn', newTab: 'opens in a new tab'},
    nav: ['Insights', 'Labs', 'Intelligence', 'Library', 'About', 'Connect', 'Privacy'],
    hero: ['Money.Technology.', 'The art of building.'],
    position: 'Building banking & payment products in emerging markets.',
    intro: 'A personal space to explore financial systems, share ideas, experiment with technology and make sense of a changing world.',
    region: 'BRAZIL / CHINA / EMERGING MARKETS',
    explore: 'Explore insights', discover: 'Discover the labs', perspectives: 'Perspectives',
    pillars: [
      ['The Infrastructure of Money', 'How money moves.', 'Banking, payments, settlement, reconciliation and ledgers.'],
      ['The Art of Building', 'How ideas become products.', 'Product, technology, strategy and lessons from China.'],
      ['The Nature of Money', 'How money behaves.', 'Inflation, currencies, capital and purchasing power.'],
    ],
    latest: 'Latest insights', insightsEmpty: 'Articles will appear here as they’re published.',
    labs: 'Don’t just read. Explore.', labsDesc: 'Interactive experiments to make complex concepts tangible.',
    tools: [
      ['Ledger Playground', 'Follow a transaction through a double-entry ledger.'],
      ['Fintech Unit Economics', 'See how pricing, costs and volume shape profitability.'],
      ['Time Value of Money', 'Explore what returns and inflation do to purchasing power.'],
    ],
    intelligence: 'A world in numbers.', intelDesc: 'Understanding money across borders.',
    unavailable: 'Verified indicators will appear here when datasets are available.',
    library: 'Worth your time.', libraryDesc: 'A personal collection of books, tools, frameworks and ideas.',
    libraryEmpty: 'Curated resources will appear here as they’re added.',
    about: 'Behind the ideas.',
    bio: 'I’m a Brazilian professional shaped by my experience in China. I work at the intersection of banking, payments, technology and product development, with a focus on emerging markets.',
    connect: ['Have an idea?', 'Let’s brainstorm together.'],
    connectDesc: 'An interesting problem, an ambitious idea, or simply a different perspective. Let’s explore what’s possible.',
    contact: 'Start a conversation',
    portraitAlt: 'Portrait of Andrey Maia',
    conversation: {
      heading: 'What’s on your mind?',
      support: 'Good conversations don’t need formal introductions.',
      messageLabel: 'Your message',
      placeholder: 'I’ve been thinking about…',
      subject: 'A conversation with Andrey Maia',
      linkedinTitle: 'Connect on LinkedIn',
      linkedinDescription: 'Let’s exchange ideas and stay connected.',
      emailTitle: 'Connect by email',
      emailHint: 'Opens your email app.',
      topics: 'Conversation topics',
    },
    topics: ['Banking and payments', 'Product and technology', 'Brazil and China', 'Emerging markets', 'New ideas', 'Knowledge exchange'],
    signature: 'Built with curiosity.', all: 'All', search: 'Search', more: 'Read more', view: 'View all',
    translation: 'This item isn’t available in English yet.', min: 'min read', related: 'Related insights',
    contents: 'On this page', share: 'Share', copy: 'Copy link', copied: 'Link copied', copyFailed: 'Could not copy the link.',
    none: 'No results match your filters.', privacy: 'This site stores your language and theme preferences in your browser.',
    analytics: {
      title: 'Analytics preferences',
      banner: 'May Google Analytics measure how you use this site? Analytics are optional.',
      accept: 'Allow analytics', decline: 'Decline analytics',
      unset: 'Analytics stay off until you allow them.',
      allowed: 'Analytics are allowed.',
      disabled: 'Analytics are off.',
      unconfigured: 'Google Analytics is disabled on this deployment.',
      disclosure: 'If you allow analytics, Google Analytics uses cookies to measure visits, general location, device type, traffic sources and interactions. Your choice is stored in this browser and can be changed here at any time.',
      exclusions: 'Contact events record that a link was used. Analytics do not collect search terms, messages, email addresses or values entered into the Labs.',
      google: 'How Google uses data',
    },
    demo: 'ILLUSTRATIVE TRANSACTION', payment: 'Outgoing payment', ledger: 'Double-entry ledger',
    debit: 'Debit', credit: 'Credit', liability: 'Customer liability', asset: 'Settlement asset', revenue: 'Fee revenue',
    settled: 'Settlement complete', balanced: 'Balanced postings', volume: 'Illustrative payment volume',
  },
  pt: {
    linkedin: {source: 'Origem', website: 'Artigos', post: 'Publicação no LinkedIn', article: 'Artigo no LinkedIn', read: 'Ler no LinkedIn', newTab: 'abre em uma nova aba'},
    nav: ['Insights', 'Labs', 'Inteligência', 'Biblioteca', 'Sobre', 'Contato', 'Privacidade'],
    hero: ['Dinheiro.Tecnologia.', 'A arte de construir.'],
    position: 'Construindo produtos bancários e de pagamentos em mercados emergentes.',
    intro: 'Um espaço pessoal para explorar sistemas financeiros, compartilhar ideias, experimentar com tecnologia e entender um mundo em transformação.',
    region: 'BRASIL / CHINA / MERCADOS EMERGENTES',
    explore: 'Explorar insights', discover: 'Conhecer os labs', perspectives: 'Perspectivas',
    pillars: [
      ['A infraestrutura do dinheiro', 'Como o dinheiro circula.', 'Bancos, pagamentos, liquidação, conciliação e registros contábeis.'],
      ['A arte de construir', 'Como ideias viram produtos.', 'Produto, tecnologia, estratégia e aprendizados na China.'],
      ['A natureza do dinheiro', 'Como o dinheiro se comporta.', 'Inflação, moedas, capital e poder de compra.'],
    ],
    latest: 'Insights recentes', insightsEmpty: 'Os artigos aparecerão aqui à medida que forem publicados.',
    labs: 'Vá além da leitura.', labsDesc: 'Experimentos interativos para tornar conceitos complexos tangíveis.',
    tools: [
      ['Simulador contábil', 'Acompanhe uma transação em um razão de partidas dobradas.'],
      ['Economia unitária em fintech', 'Veja como preço, custos e volume influenciam a lucratividade.'],
      ['Valor do dinheiro no tempo', 'Explore como o rendimento e a inflação afetam o poder de compra.'],
    ],
    intelligence: 'Um mundo em números.', intelDesc: 'Entenda o dinheiro além das fronteiras.',
    unavailable: 'Os indicadores aparecerão aqui quando houver dados verificados.',
    library: 'Vale o seu tempo.', libraryDesc: 'Uma coleção pessoal de livros, ferramentas, métodos e ideias.',
    libraryEmpty: 'Os recursos selecionados aparecerão aqui conforme forem adicionados.',
    about: 'Por trás das ideias.',
    bio: 'Sou um profissional brasileiro com experiência na China. Trabalho na interseção entre bancos, pagamentos, tecnologia e desenvolvimento de produtos, com foco em mercados emergentes.',
    connect: ['Tem uma ideia?', 'Vamos pensar juntos.'],
    connectDesc: 'Um problema interessante, uma ideia ambiciosa ou simplesmente uma perspectiva diferente. Vamos explorar as possibilidades.',
    contact: 'Iniciar uma conversa',
    portraitAlt: 'Retrato de Andrey Maia',
    conversation: {
      heading: 'O que você tem em mente?',
      support: 'Boas conversas não precisam de apresentações formais.',
      messageLabel: 'Sua mensagem',
      placeholder: 'Estive pensando sobre…',
      subject: 'Uma conversa com Andrey Maia',
      linkedinTitle: 'Conecte-se pelo LinkedIn',
      linkedinDescription: 'Vamos trocar ideias e manter contato.',
      emailTitle: 'Entre em contato por e-mail',
      emailHint: 'Abre seu aplicativo de e-mail.',
      topics: 'Temas para conversar',
    },
    topics: ['Bancos e pagamentos', 'Produto e tecnologia', 'Brasil e China', 'Mercados emergentes', 'Novas ideias', 'Troca de conhecimento'],
    signature: 'Feito com curiosidade.', all: 'Todos', search: 'Buscar', more: 'Leia mais', view: 'Ver tudo',
    translation: 'Este conteúdo ainda não está disponível em português.', min: 'min de leitura', related: 'Insights relacionados',
    contents: 'Nesta página', share: 'Compartilhar', copy: 'Copiar link', copied: 'Link copiado', copyFailed: 'Não foi possível copiar o link.',
    none: 'Nenhum resultado corresponde aos filtros.', privacy: 'Este site armazena suas preferências de idioma e tema no navegador.',
    analytics: {
      title: 'Preferências de métricas',
      banner: 'Você permite que o Google Analytics meça o uso deste site? Essa coleta é opcional.',
      accept: 'Permitir métricas', decline: 'Recusar métricas',
      unset: 'A coleta fica desativada até você permitir.',
      allowed: 'A coleta de métricas está permitida.',
      disabled: 'A coleta de métricas está desativada.',
      unconfigured: 'O Google Analytics está desativado nesta versão do site.',
      disclosure: 'Se você permitir, o Google Analytics usa cookies para medir visitas, localização aproximada, tipo de dispositivo, origem do tráfego e interações. Sua escolha é armazenada neste navegador e pode ser alterada aqui a qualquer momento.',
      exclusions: 'Os eventos de contato registram o uso de um link. A coleta não inclui termos de busca, mensagens, endereços de e-mail ou valores inseridos nos Labs.',
      google: 'Como o Google usa os dados',
    },
    demo: 'TRANSAÇÃO ILUSTRATIVA', payment: 'Pagamento enviado', ledger: 'Razão de partidas dobradas',
    debit: 'Débito', credit: 'Crédito', liability: 'Passivo com o cliente', asset: 'Ativo de liquidação', revenue: 'Receita de tarifas',
    settled: 'Liquidação concluída', balanced: 'Lançamentos equilibrados', volume: 'Volume de pagamentos ilustrativo',
  },
};
