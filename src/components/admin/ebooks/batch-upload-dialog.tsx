'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useBatchUpload } from '@/hooks/useBatchUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, FileText, CheckCircle, XCircle, AlertCircle, Download, BookOpen, Settings } from 'lucide-react';

interface BatchUploadDialogProps {
  onComplete?: () => void;
}

export function BatchUploadDialog({ onComplete }: BatchUploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [defaultPoints, setDefaultPoints] = useState(1);
  const [defaultCategory, setDefaultCategory] = useState('Geral');
  const [isOpen, setIsOpen] = useState(false);

  const { uploadBatch, isUploading, progress, results, reset } = useBatchUpload();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.name.endsWith('.zip')) {
      setSelectedFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      await uploadBatch(selectedFile, {
        defaultPoints,
        defaultCategory,
        onComplete: () => {
          onComplete?.();
        },
      });
    } catch (error) {
      console.error('Erro no upload:', error);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedFile(null);
    reset();
  };

  const downloadTemplate = () => {
    const instructions = `
INSTRUÇÕES PARA UPLOAD EM LOTE DE EBOOKS

1. Prepare seus arquivos PDF
2. Compacte todos os PDFs em um arquivo ZIP
3. Certifique-se de que os nomes dos arquivos sejam descritivos
4. O sistema irá:
   - Extrair o título do nome do arquivo
   - Gerar uma capa da primeira página
   - Criar registros no banco de dados
   - Fazer upload para o storage

EXEMPLO DE ESTRUTURA:
ebooks.zip
├── O Poder do Hábito.pdf
├── Atomic Habits.pdf
├── Deep Work.pdf
└── ...

DICAS:
- Use nomes descritivos para os arquivos
- Evite caracteres especiais
- Mantenha o ZIP menor que 100MB
- Processe em lotes menores se necessário
    `;

    const blob = new Blob([instructions], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'instrucoes-upload-ebooks.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />
          Upload em Lote
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Upload em Lote de Ebooks
          </DialogTitle>
          <DialogDescription>Faça upload de múltiplos ebooks de uma vez usando um arquivo ZIP</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Selecionar Arquivo ZIP
                </CardTitle>
                <CardDescription>Arraste e solte um arquivo ZIP contendo os PDFs dos ebooks</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

                  {selectedFile ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Arquivo selecionado: {selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Tamanho: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {isDragActive ? 'Solte o arquivo aqui' : 'Arraste e solte o ZIP aqui'}
                      </p>
                      <p className="text-sm text-muted-foreground">Ou clique para selecionar um arquivo ZIP</p>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Processando...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={downloadTemplate}>
                <Download className="h-4 w-4 mr-2" />
                Baixar Instruções
              </Button>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button onClick={handleUpload} disabled={!selectedFile || isUploading} className="gap-2">
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Iniciar Upload
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Configurações Padrão
                </CardTitle>
                <CardDescription>Defina valores padrão para os ebooks que serão criados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultPoints">Pontos Padrão</Label>
                  <Input
                    id="defaultPoints"
                    type="number"
                    min="1"
                    value={defaultPoints}
                    onChange={(e) => setDefaultPoints(parseInt(e.target.value) || 1)}
                    placeholder="1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultCategory">Categoria Padrão</Label>
                  <Input
                    id="defaultCategory"
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                    placeholder="Geral"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            {results && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultado do Processamento</CardTitle>
                  <CardDescription>{results.message}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-foreground">{results.summary.total}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{results.summary.success}</div>
                      <div className="text-sm text-muted-foreground">Sucessos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{results.summary.errors}</div>
                      <div className="text-sm text-muted-foreground">Erros</div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {results.results.map((result, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">{result.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={result.success ? 'default' : 'destructive'}>
                            {result.success ? 'Sucesso' : 'Erro'}
                          </Badge>
                          {result.error && (
                            <AlertCircle className="h-4 w-4 text-muted-foreground" title={result.error} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
