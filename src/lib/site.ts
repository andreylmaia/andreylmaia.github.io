export const locales = ['en', 'pt'] as const;
export type Locale = typeof locales[number];
export const brand = {
  name: 'Andrey Maia',
  wordmark: 'andreymaia',
  github: 'https://github.com/andreylmaia',
  linkedin: '',
  email: '',
  portrait: '',
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
    nav: ['Insights', 'Labs', 'Intelligence', 'Library', 'About', 'Connect', 'Privacy'],
    hero: ['Money.', 'Technology.', 'The art of building.'],
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
    contact: 'Start a conversation', contactEmpty: 'Direct contact details will be available here once configured.',
    topics: ['Banking and payments', 'Product and technology', 'Brazil and China', 'Emerging markets', 'New ideas', 'Knowledge exchange'],
    signature: 'Built with curiosity.', all: 'All', search: 'Search', more: 'Read more', view: 'View all',
    translation: 'This item isn’t available in English yet.', min: 'min read', related: 'Related insights',
    contents: 'On this page', share: 'Share', copy: 'Copy link', copied: 'Link copied', copyFailed: 'Could not copy the link.',
    none: 'No results match your filters.', privacy: 'This site stores your language and theme preferences in your browser. Analytics are currently disabled.',
    demo: 'ILLUSTRATIVE TRANSACTION', payment: 'Outgoing payment', ledger: 'Double-entry ledger',
    debit: 'Debit', credit: 'Credit', liability: 'Customer liability', asset: 'Settlement asset', revenue: 'Fee revenue',
    settled: 'Settlement complete', balanced: 'Balanced postings', volume: 'Illustrative payment volume',
  },
  pt: {
    nav: ['Insights', 'Labs', 'Inteligência', 'Biblioteca', 'Sobre', 'Contato', 'Privacidade'],
    hero: ['Dinheiro.', 'Tecnologia.', 'A arte de construir.'],
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
    contact: 'Iniciar uma conversa', contactEmpty: 'Os canais de contato estarão disponíveis aqui após a configuração.',
    topics: ['Bancos e pagamentos', 'Produto e tecnologia', 'Brasil e China', 'Mercados emergentes', 'Novas ideias', 'Troca de conhecimento'],
    signature: 'Feito com curiosidade.', all: 'Todos', search: 'Buscar', more: 'Leia mais', view: 'Ver tudo',
    translation: 'Este conteúdo ainda não está disponível em português.', min: 'min de leitura', related: 'Insights relacionados',
    contents: 'Nesta página', share: 'Compartilhar', copy: 'Copiar link', copied: 'Link copiado', copyFailed: 'Não foi possível copiar o link.',
    none: 'Nenhum resultado corresponde aos filtros.', privacy: 'Este site armazena suas preferências de idioma e tema no navegador. A coleta de métricas está desativada.',
    demo: 'TRANSAÇÃO ILUSTRATIVA', payment: 'Pagamento enviado', ledger: 'Razão de partidas dobradas',
    debit: 'Débito', credit: 'Crédito', liability: 'Passivo com o cliente', asset: 'Ativo de liquidação', revenue: 'Receita de tarifas',
    settled: 'Liquidação concluída', balanced: 'Lançamentos equilibrados', volume: 'Volume de pagamentos ilustrativo',
  },
};
