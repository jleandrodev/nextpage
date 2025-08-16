const https = require('https');

async function getVercelIPs() {
  return new Promise((resolve, reject) => {
    https
      .get('https://api.vercel.com/v1/ips', (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const ips = JSON.parse(data);
            console.log('🌐 IPs da Vercel que precisam ser autorizados no Supabase:');
            console.log('');

            if (ips.ipv4) {
              console.log('📋 IPv4:');
              ips.ipv4.forEach((ip) => {
                console.log(`   ${ip}`);
              });
              console.log('');
            }

            if (ips.ipv6) {
              console.log('📋 IPv6:');
              ips.ipv6.forEach((ip) => {
                console.log(`   ${ip}`);
              });
              console.log('');
            }

            console.log('📝 INSTRUÇÕES:');
            console.log('1. Acesse: https://supabase.com/dashboard/project/[seu-project-id]/settings/database');
            console.log('2. Em "Connection pooling", adicione os IPs acima');
            console.log('3. Ou use "0.0.0.0/0" para permitir todos os IPs (menos seguro)');
            console.log('4. Salve as configurações');
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

getVercelIPs().catch(console.error);
