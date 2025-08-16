import Image from 'next/image';

export default function TestImagePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md">
        <h1 className="text-2xl font-bold mb-4">Teste de Imagem</h1>

        <div className="relative w-full h-64 mb-4">
          <Image
            src="/images/login-paisagem.jpg"
            alt="Teste de imagem"
            fill
            className="object-cover rounded-lg"
            priority
          />
        </div>

        <p className="text-gray-600">Se você consegue ver a imagem acima, o fallback está funcionando corretamente.</p>
      </div>
    </div>
  );
}
