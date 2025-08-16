import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import { StorageService } from '@/lib/services/storage.service';
import { PdfConverterService } from '@/lib/services/pdf-converter.service';

const prisma = new PrismaClient();
const pdfConverter = new PdfConverterService();

interface ProcessedEbook {
  fileName: string;
  title: string;
  coverUrl?: string;
  fileUrl?: string;
  success: boolean;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Verificar se é admin
    if (session.user.role !== 'ADMIN_MASTER') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    const formData = await request.formData();
    const zipFile = formData.get('zipFile') as File;
    const defaultPoints = parseInt(formData.get('defaultPoints') as string) || 1;
    const defaultCategory = (formData.get('defaultCategory') as string) || 'Geral';

    if (!zipFile) {
      return NextResponse.json({ error: 'Arquivo ZIP é obrigatório' }, { status: 400 });
    }

    if (zipFile.type !== 'application/zip' && !zipFile.name.endsWith('.zip')) {
      return NextResponse.json({ error: 'Arquivo deve ser um ZIP válido' }, { status: 400 });
    }

    // Verificar se as variáveis de ambiente estão configuradas
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: 'Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.',
          details: 'Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no arquivo .env.local',
        },
        { status: 500 },
      );
    }

    // Processar o ZIP
    const zip = new JSZip();

    // Converter o File para ArrayBuffer
    const zipBuffer = await zipFile.arrayBuffer();
    const zipContent = await zip.loadAsync(zipBuffer);

    const results: ProcessedEbook[] = [];
    const pdfFiles = Object.keys(zipContent.files).filter(
      (fileName) => fileName.toLowerCase().endsWith('.pdf') && !fileName.includes('__MACOSX'),
    );

    console.log(`📚 Processando ${pdfFiles.length} arquivos PDF...`);

    // Processar cada PDF
    for (const fileName of pdfFiles) {
      try {
        const file = zipContent.files[fileName];
        const pdfBuffer = await file.async('arraybuffer');

        // Extrair título do nome do arquivo
        const title = fileName
          .replace(/\.pdf$/i, '')
          .replace(/[_-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

        // Extrair primeira página como capa (imagem PNG)
        const coverBuffer = await pdfConverter.convertFirstPageToImage(pdfBuffer);

        // Criar ebook no banco
        const ebook = await prisma.ebook.create({
          data: {
            title: title,
            author: 'Autor Desconhecido', // Pode ser editado depois
            description: `Ebook: ${title}`,
            category: defaultCategory,
            pointsCost: defaultPoints,
            coverImageUrl: '',
            ebookFileUrl: '',
            isActive: true,
          },
        });

        // Fazer upload para Supabase Storage
        try {
          const storageService = new StorageService();

          // Upload do arquivo PDF
          const fileUrl = await storageService.uploadEbookFileBuffer(
            Buffer.from(pdfBuffer),
            `${ebook.id}.pdf`,
            'ebooks',
          );

          // Upload da capa como imagem PNG
          const coverUrl = await storageService.uploadEbookCoverBuffer(
            coverBuffer,
            `${ebook.id}-cover.png`,
            'ebook-covers',
          );

          // Atualizar URLs no banco
          await prisma.ebook.update({
            where: { id: ebook.id },
            data: {
              coverImageUrl: coverUrl,
              ebookFileUrl: fileUrl,
            },
          });

          results.push({
            fileName,
            title,
            coverUrl,
            fileUrl,
            success: true,
          });
        } catch (uploadError) {
          console.error(`❌ Erro no upload de ${fileName}:`, uploadError);

          // Se o upload falhar, deletar o ebook criado
          await prisma.ebook.delete({
            where: { id: ebook.id },
          });

          results.push({
            fileName,
            title,
            success: false,
            error: uploadError instanceof Error ? uploadError.message : 'Erro no upload',
          });
        }

        console.log(`✅ Processado: ${title}`);
      } catch (error) {
        console.error(`❌ Erro ao processar ${fileName}:`, error);
        results.push({
          fileName,
          title: fileName.replace(/\.pdf$/i, ''),
          success: false,
          error: error instanceof Error ? error.message : 'Erro desconhecido',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const errorCount = results.filter((r) => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Processamento concluído: ${successCount} sucessos, ${errorCount} erros`,
      results,
      summary: {
        total: pdfFiles.length,
        success: successCount,
        errors: errorCount,
      },
    });
  } catch (error) {
    console.error('Erro no processamento em lote:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  } finally {
    // Fechar o browser do Puppeteer
    await pdfConverter.closeBrowser();
  }
}
