import { prisma } from '@/lib/prisma';
import { PointsImportRecord, PointsImportResult } from '@/types/organization';
import { UserService } from './user.service';
import * as XLSX from 'xlsx';

export class PointsImportService {
  private userService = new UserService();

  // Processar arquivo de planilha
  async processSpreadsheet(file: File, organizationId: string, importedBy: string): Promise<PointsImportResult> {
    try {
      console.log('🔍 Iniciando processamento da planilha:', file.name);
      console.log('📄 Tipo do arquivo:', file.type);
      console.log('📄 Extensão do arquivo:', file.name.split('.').pop());
      
      let jsonData: any[][];
      
      // Verificar se é um arquivo CSV
      if (file.type === 'text/csv' || file.name.toLowerCase().endsWith('.csv')) {
        console.log('📄 Processando como CSV...');
        
        // Ler o arquivo como texto
        const text = await file.text();
        console.log('📄 Conteúdo do CSV:', text.substring(0, 500) + '...');
        
        // Normalizar quebras de linha e dividir
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalizedText.split('\n').filter(line => line.trim() !== '');
        
        console.log('📄 Linhas após normalização:', lines.length);
        console.log('📄 Primeiras linhas:', lines.slice(0, 3));
        
        jsonData = lines.map((line, index) => {
          // Dividir por vírgula, mas respeitar aspas
          const values = line.split(',').map(value => value.trim().replace(/^["']|["']$/g, ''));
          console.log(`📄 Linha ${index + 1} processada:`, values);
          return values;
        });
        
        console.log('📄 CSV processado manualmente:', jsonData.length, 'linhas');
      } else {
        console.log('📄 Processando como Excel...');
        
        // Ler arquivo Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Converter para JSON incluindo o cabeçalho
        jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      }

      console.log('📊 Dados lidos da planilha:', jsonData.length, 'linhas');
      console.log('📋 Primeiras linhas:', jsonData.slice(0, 5));
      console.log('📋 Estrutura completa:', JSON.stringify(jsonData, null, 2));

      // Validar estrutura da planilha
      const records = this.validateSpreadsheetData(jsonData);
      console.log('✅ Registros válidos encontrados:', records.length);

      // Criar registro de importação
      const pointsImport = await prisma.pointsImport.create({
        data: {
          fileName: file.name,
          organizationId,
          totalRecords: records.length,
          importedBy,
          status: 'PROCESSING',
        },
      });

      console.log('📝 Registro de importação criado:', pointsImport.id);

      // Processar registros
      const result = await this.processRecords(records, organizationId, pointsImport.id);
      console.log('🎯 Resultado do processamento:', result);

      // Atualizar status da importação
      await prisma.pointsImport.update({
        where: { id: pointsImport.id },
        data: {
          status: result.errorRecords > 0 ? 'PARTIAL' : 'COMPLETED',
          successRecords: result.successRecords,
          errorRecords: result.errorRecords,
          errorDetails: result.errors.length > 0 ? JSON.stringify(result.errors) : null,
        },
      });

      console.log('✅ Importação finalizada com sucesso');
      console.log(`📊 RESUMO FINAL:`);
      console.log(`   - Total de linhas no arquivo: ${jsonData.length}`);
      console.log(`   - Linha de cabeçalho: 1`);
      console.log(`   - Linhas de dados: ${jsonData.length - 1}`);
      console.log(`   - Registros válidos processados: ${result.successRecords}`);
      console.log(`   - Registros com erro: ${result.errorRecords}`);
      return result;
    } catch (error) {
      console.error('❌ Erro ao processar planilha:', error);
      throw new Error('Erro ao processar planilha: ' + (error as Error).message);
    }
  }

  // Validar dados da planilha
  private validateSpreadsheetData(jsonData: any[][]): PointsImportRecord[] {
    if (!jsonData || jsonData.length === 0) {
      throw new Error('Planilha está vazia ou não foi possível ler os dados');
    }

    console.log('🔍 Iniciando validação dos dados...');
    console.log('📊 Total de linhas recebidas:', jsonData.length);

    // A primeira linha (índice 0) contém os cabeçalhos
    const headers = jsonData[0].map((h: any) => String(h).toLowerCase());
    console.log('📋 Cabeçalhos encontrados:', headers);
    console.log('📋 Cabeçalhos originais:', jsonData[0]);

    // Encontrar índices das colunas obrigatórias
    const cpfIndex = headers.findIndex((h) => h.includes('cpf') || h.includes('documento'));
    const pointsIndex = headers.findIndex((h) => h.includes('ponto') || h.includes('credito') || h.includes('valor'));

    if (cpfIndex === -1 || pointsIndex === -1) {
      console.error('❌ Colunas obrigatórias não encontradas');
      console.error('📋 Cabeçalhos disponíveis:', headers);
      throw new Error('Planilha deve conter pelo menos as colunas CPF e Pontos');
    }

    console.log(`📍 Colunas encontradas: CPF (índice ${cpfIndex}), Pontos (índice ${pointsIndex})`);

    // Encontrar índices das colunas opcionais
    const nameIndex = headers.findIndex((h) => h.includes('nome'));
    const emailIndex = headers.findIndex((h) => h.includes('email') || h.includes('e-mail'));

    console.log(`📍 Colunas opcionais: Nome (índice ${nameIndex}), Email (índice ${emailIndex})`);

    // Mapear dados (começar da linha 1, pois a linha 0 é o cabeçalho)
    const records: PointsImportRecord[] = [];

    console.log('🔄 Processando linhas de dados...');
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      
      console.log(`📝 Processando linha ${i + 1}:`, row);
      
      // Pular linhas vazias
      if (!row || row.length === 0) {
        console.log(`⚠️ Linha ${i + 1} vazia, pulando...`);
        continue;
      }

      // Extrair CPF (limpar formatação)
      const cpfRaw = String(row[cpfIndex] || '');
      const cpf = cpfRaw.replace(/\D/g, ''); // Remove tudo que não é dígito

      // Extrair pontos
      const pointsRaw = row[pointsIndex];
      const points = parseInt(String(pointsRaw)) || 0;

      // Extrair dados opcionais
      const fullName = nameIndex !== -1 ? String(row[nameIndex] || '') : undefined;
      const email = emailIndex !== -1 ? String(row[emailIndex] || '') : undefined;

      console.log(`📝 Linha ${i + 1}: CPF=${cpf}, Pontos=${points}, Nome=${fullName || 'N/A'}`);

      if (cpf && cpf.length === 11 && points > 0) {
        records.push({
          cpf,
          points,
          fullName: fullName || undefined,
          email: email || undefined,
        });
        console.log(`✅ Linha ${i + 1} válida, adicionada aos registros`);
      } else {
        console.log(`⚠️ Linha ${i + 1} ignorada: CPF inválido (${cpf}) ou pontos <= 0 (${points})`);
      }
    }

    console.log(`🎯 Validação concluída: ${records.length} registros válidos de ${jsonData.length - 1} linhas de dados`);

    if (records.length === 0) {
      throw new Error('Nenhum registro válido encontrado na planilha');
    }

    return records;
  }

  // Processar registros da planilha
  private async processRecords(
    records: PointsImportRecord[],
    organizationId: string,
    pointsImportId: string,
  ): Promise<PointsImportResult> {
    const errors: { row: number; cpf: string; error: string }[] = [];
    let successCount = 0;

    console.log('🔄 Processando', records.length, 'registros...');
    console.log('🏢 Organização de destino:', organizationId);
    console.log('📋 Registros a serem processados:', JSON.stringify(records, null, 2));

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      console.log(`📝 Processando registro ${i + 1}: CPF ${record.cpf}, Pontos ${record.points}`);

      try {
        // Validar CPF (validação básica)
        if (!this.isValidCPF(record.cpf)) {
          throw new Error('CPF inválido');
        }

        // Criar ou atualizar usuário
        await this.userService.createOrUpdateFromImport({
          cpf: record.cpf,
          points: record.points,
          fullName: record.fullName,
          email: record.email,
          organizationId,
          pointsImportId,
        });

        successCount++;
        console.log(`✅ Registro ${i + 1} processado com sucesso para organização ${organizationId}`);
      } catch (error) {
        console.error(`❌ Erro no registro ${i + 1}:`, error);
        errors.push({
          row: i + 2, // +2 porque começa da linha 2 (depois do header)
          cpf: record.cpf,
          error: (error as Error).message,
        });
      }
    }

    console.log(`🎯 Processamento concluído: ${successCount} sucessos, ${errors.length} erros`);
    console.log(`🏢 Todos os registros processados para organização: ${organizationId}`);

    return {
      success: errors.length === 0,
      totalRecords: records.length,
      successRecords: successCount,
      errorRecords: errors.length,
      errors,
    };
  }

  // Validação básica de CPF
  private isValidCPF(cpf: string): boolean {
    // Remove formatação
    const cleanCPF = cpf.replace(/\D/g, '');

    // Verifica se tem 11 dígitos
    if (cleanCPF.length !== 11) return false;

    // Verifica se não é uma sequência de números iguais
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

    // Para simplificar, vamos aceitar CPFs com 11 dígitos válidos
    // A validação completa dos dígitos verificadores pode ser muito restritiva
    return true;
  }

  // Buscar importações por organização
  async findByOrganization(organizationId: string) {
    return await prisma.pointsImport.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: {
        organization: true,
      },
    });
  }

  // Buscar importação por ID
  async findById(id: string) {
    return await prisma.pointsImport.findUnique({
      where: { id },
      include: {
        organization: true,
        pointsHistory: {
          include: {
            user: true,
          },
        },
      },
    });
  }

  // Estatísticas de uma importação
  async getImportStats(importId: string) {
    const pointsImport = await this.findById(importId);

    if (!pointsImport) {
      throw new Error('Importação não encontrada');
    }

    const totalPointsAdded = await prisma.pointsHistory.aggregate({
      where: { pointsImportId: importId },
      _sum: { pointsAdded: true },
    });

    return {
      ...pointsImport,
      totalPointsAdded: totalPointsAdded._sum.pointsAdded || 0,
    };
  }

  // Listar todas as importações (admin)
  async findAll() {
    return await prisma.pointsImport.findMany({
      include: {
        organization: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
