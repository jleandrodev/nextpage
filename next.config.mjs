/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações de imagem otimizadas para Vercel
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'paddle-billing.vercel.app',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
    // Otimizações para Vercel
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },

  // Configurações de build otimizadas
  serverExternalPackages: ['@prisma/client'],

  // Configurações de webpack para otimizar bundle
  webpack: (config, { isServer }) => {
    // Otimizações para produção
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    // Excluir puppeteer do bundle de produção
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('puppeteer');
    }

    return config;
  },

  // Configurações de headers para Vercel
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },

  // Configurações de redirecionamento
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/lojistas',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
