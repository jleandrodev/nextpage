'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/app/login/actions';

export default function LoginPage() {
  const { toast } = useToast();
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');

  function handleLogin() {
    login({ email: cpf, password }).then((data) => {
      if (data?.error) {
        toast({ description: 'CPF ou senha inválidos', variant: 'destructive' });
      }
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Lado Esquerdo - Imagem */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image src="/images/login-paisagem.jpg" alt="Login" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-2xl font-bold mb-2">Bem-vindo de volta!</h2>
          <p className="text-lg opacity-90">Acesse sua conta para continuar</p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <Image src="/images/logoipsum.png" alt="Logo" width={240} height={80} className="mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-gray-600">Entre com suas credenciais para acessar sua conta</p>
          </div>

          {/* Formulário */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-6"
          >
            <div>
              <Label htmlFor="cpf" className="text-sm font-medium text-gray-700 mb-2 block">
                CPF
              </Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-600">Lembrar de mim</span>
              </label>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                Esqueceu a senha?
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Entrar
            </Button>
          </form>

          {/* Link para cadastro */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Ainda não tem uma conta?{' '}
              <a href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
