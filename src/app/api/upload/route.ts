import { NextRequest, NextResponse } from 'next/server';
import { StorageService } from '@/lib/services/storage.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const storageService = new StorageService();

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
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const id = formData.get('id') as string;

    if (!file || !type || !id) {
      return NextResponse.json({ error: 'Arquivo, tipo e ID são obrigatórios' }, { status: 400 });
    }

    let url: string;

    switch (type) {
      case 'logo':
        url = await storageService.uploadLogo(file, id);
        break;
      case 'login-image':
        url = await storageService.uploadLoginImage(file, id);
        break;
      case 'ebook-cover':
        url = await storageService.uploadEbookCover(file, id);
        break;
      case 'ebook-file':
        url = await storageService.uploadEbookFile(file, id);
        break;
      case 'spreadsheet':
        url = await storageService.uploadSpreadsheet(file, id);
        break;
      default:
        return NextResponse.json({ error: 'Tipo de upload inválido' }, { status: 400 });
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Erro no upload:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN_MASTER') {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { bucket, fileName } = await request.json();

    if (!bucket || !fileName) {
      return NextResponse.json({ error: 'Bucket e nome do arquivo são obrigatórios' }, { status: 400 });
    }

    await storageService.deleteFile(bucket, fileName);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
