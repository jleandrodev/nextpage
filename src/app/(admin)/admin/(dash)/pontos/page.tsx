import { DashboardPageHeader } from '@/components/dashboard/layout/dashboard-page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileSpreadsheet, Users, Coins, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminPontosPage() {
  // Dados mockados
  const uploadsRecentes = [
    {
      id: 1,
      data: '2024-01-15',
      arquivo: 'pontos_jan_2024.csv',
      clientesAtualizados: 45,
      novosClientes: 12,
      totalPontos: 2500,
      status: 'Concluído',
    },
    {
      id: 2,
      data: '2024-01-10',
      arquivo: 'promocao_natal.csv',
      clientesAtualizados: 23,
      novosClientes: 8,
      totalPontos: 1200,
      status: 'Concluído',
    },
    {
      id: 3,
      data: '2024-01-05',
      arquivo: 'pontos_dez_2023.csv',
      clientesAtualizados: 67,
      novosClientes: 15,
      totalPontos: 3800,
      status: 'Concluído',
    },
  ];

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-8">
      <DashboardPageHeader pageTitle="Gerenciar Pontos" />

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos Distribuídos</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.500</div>
            <p className="text-xs text-muted-foreground">pontos no total</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Último Upload</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">15/01</div>
            <p className="text-xs text-muted-foreground">há 2 dias</p>
          </CardContent>
        </Card>

        <Card className="bg-background/70 backdrop-blur-[6px] border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uploads Realizados</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uploadsRecentes.length}</div>
            <p className="text-xs text-muted-foreground">planilhas processadas</p>
          </CardContent>
        </Card>
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
              <Input type="file" accept=".csv,.xlsx,.xls" className="hidden" id="planilha-upload" />
              <Button variant="secondary" asChild>
                <label htmlFor="planilha-upload" className="cursor-pointer">
                  <Upload className="mr-2 h-4 w-4" />
                  Selecionar Arquivo
                </label>
              </Button>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Formato da Planilha</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                • A planilha deve conter as colunas: <code className="bg-background px-1 rounded">CPF</code> e{' '}
                <code className="bg-background px-1 rounded">Pontos</code>
              </p>
              <p>• CPFs já cadastrados terão seus pontos somados</p>
              <p>• CPFs novos serão automaticamente cadastrados</p>
              <p>• Formatos aceitos: CSV, XLSX, XLS</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Histórico de Uploads */}
      <Card className="bg-background/70 backdrop-blur-[6px] border-border">
        <CardHeader>
          <CardTitle>Histórico de Uploads</CardTitle>
          <CardDescription>Registro de todas as planilhas processadas</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Arquivo</TableHead>
                <TableHead>Clientes Atualizados</TableHead>
                <TableHead>Novos Clientes</TableHead>
                <TableHead>Total Pontos</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadsRecentes.map((upload) => (
                <TableRow key={upload.id}>
                  <TableCell className="font-medium">{new Date(upload.data).toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{upload.arquivo}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                      {upload.clientesAtualizados}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                      {upload.novosClientes}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      <span className="text-sm font-medium">{upload.totalPontos}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-400" />
                      <span className="text-sm text-green-400">{upload.status}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
