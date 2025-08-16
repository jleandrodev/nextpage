'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, FileSpreadsheet, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { useToast } from '@/components/ui/use-toast';
import { PointsImportResult } from '@/types/organization';

interface UploadPlanilhaPageProps {
  params: Promise<{ id: string }>;
}

interface UploadHistory {
  id: string;
  fileName: string;
  createdAt: string;
  status: string;
  successRecords: number;
  totalRecords: number;
  organizationName: string;
}

export default function UploadPlanilhaPage({ params }: UploadPlanilhaPageProps) {
  const [organizationId, setOrganizationId] = useState<string>('');

  useEffect(() => {
    const loadParams = async () => {
      const { id } = await params;
      setOrganizationId(id);
    };
    loadParams();
  }, [params]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<PointsImportResult | null>(null);
  const [uploadHistory, setUploadHistory] = useState<UploadHistory[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    lastUpload: '',
    totalUploads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Carregar dados iniciais
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadUploadHistory(), loadStats()]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const loadUploadHistory = async () => {
    try {
      console.log('🔄 Carregando histórico de uploads para organização:', organizationId);
      const response = await fetch(`/api/organizations/${organizationId}/uploads`);

      console.log('📊 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dados do histórico:', data);
        setUploadHistory(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Erro ao carregar histórico:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar histórico:', error);
    }
  };

  const loadStats = async () => {
    try {
      console.log('🔄 Carregando estatísticas para organização:', organizationId);
      const response = await fetch(`/api/organizations/${organizationId}/stats`);

      console.log('📊 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Dados das estatísticas:', data);
        setStats(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Erro ao carregar estatísticas:', response.status, errorText);
      }
    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error);
    }
  };

  const simulateProgress = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Verificar se é um arquivo válido
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ];
      const validExtensions = ['.csv', '.xls', '.xlsx'];

      const isValidType =
        validTypes.includes(file.type) || validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext));

      if (!isValidType) {
        toast({
          title: 'Tipo de arquivo inválido',
          description: 'Por favor, selecione um arquivo CSV ou Excel (.csv, .xls, .xlsx)',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    simulateProgress();

    try {
      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('organizationId', organizationId);

      // Chamar a Server Action
      const response = await fetch('/api/upload-points', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erro ao processar planilha');
      }

      setUploadResult(result.result);
      setSelectedFile(null);

      // Recarregar dados
      await loadUploadHistory();
      await loadStats();

      toast({
        title: 'Upload concluído!',
        description: `${result.result.successRecords} registros processados com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: 'Erro no upload',
        description:
          error instanceof Error ? error.message : 'Ocorreu um erro ao processar a planilha. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `CPF,Pontos,Nome,Email
12345678901,100,João Silva,joao@email.com
98765432100,150,Maria Santos,maria@email.com
11122233344,200,Pedro Oliveira,pedro@email.com
55566677788,75,Ana Costa,ana@email.com
99988877766,300,Carlos Ferreira,carlos@email.com`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'template-pontos.csv';
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/admin/lojistas/${organizationId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-semibold md:text-4xl">Upload de Planilha de Pontos</h1>
          <p className="text-muted-foreground">Importe pontos para distribuir aos clientes da organização</p>
        </div>
      </div>

      {/* Upload de Planilha */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Planilha
          </CardTitle>
          <CardDescription>
            Faça upload de uma planilha CSV ou Excel com CPF e pontos para distribuir aos clientes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Arraste e solte sua planilha aqui</h3>
              <p className="text-sm text-muted-foreground">Ou clique para selecionar um arquivo CSV ou Excel</p>
            </div>
            <div className="mt-4">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                className="hidden"
                id="planilha-upload"
                onChange={handleFileSelect}
              />
              <Button variant="secondary" asChild>
                <label htmlFor="planilha-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Arquivo
                </label>
              </Button>
            </div>
          </div>

          {selectedFile && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? 'Processando...' : 'Fazer Upload'}
                </Button>
              </div>
            </div>
          )}

          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processando planilha...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          {uploadResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Upload concluído com sucesso!</span>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>• Registros processados: {uploadResult.totalRecords}</p>
                <p>• Sucessos: {uploadResult.successRecords}</p>
                <p>• Erros: {uploadResult.errorRecords}</p>
              </div>
            </div>
          )}

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Formato da Planilha</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • A planilha deve conter as colunas: <code className="bg-background px-1 rounded">CPF</code> e{' '}
                <code className="bg-background px-1 rounded">Pontos</code> (obrigatórias)
              </p>
              <p>
                • Colunas opcionais: <code className="bg-background px-1 rounded">Nome</code> e{' '}
                <code className="bg-background px-1 rounded">Email</code>
              </p>
              <p>
                • <strong>IMPORTANTE:</strong> A primeira linha deve conter os cabeçalhos das colunas
              </p>
              <p>• CPFs já cadastrados terão seus pontos somados</p>
              <p>• CPFs novos serão automaticamente cadastrados</p>
              <p>• Formatos aceitos: CSV, XLSX, XLS</p>
            </div>
            <Button onClick={downloadTemplate} variant="outline" className="mt-3">
              <Download className="mr-2 h-4 w-4" />
              Baixar Template
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
