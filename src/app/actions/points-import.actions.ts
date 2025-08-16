'use server';

import { PointsImportService } from '@/lib/services/points-import.service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function uploadPointsSpreadsheetAction(
  formData: FormData
): Promise<{ success: boolean; result?: any; error?: string }> {
  try {
    console.log('🚀 Iniciando upload de planilha...');
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN_MASTER') {
      return { success: false, error: 'Acesso negado' };
    }

    const file = formData.get('file') as File;
    const organizationId = formData.get('organizationId') as string;

    console.log('📁 Arquivo recebido:', file?.name);
    console.log('🏢 Organization ID recebido:', organizationId);

    if (!file || !organizationId) {
      console.log('❌ Dados faltando:', { file: !!file, organizationId: !!organizationId });
      return { success: false, error: 'Arquivo e organização são obrigatórios' };
    }

    console.log('✅ Dados válidos, processando planilha...');

    const pointsImportService = new PointsImportService();
    const result = await pointsImportService.processSpreadsheet(
      file,
      organizationId,
      session.user.id
    );

    console.log('✅ Planilha processada com sucesso');

    // Revalidar a página para mostrar os dados atualizados
    revalidatePath(`/admin/lojistas/${organizationId}`);
    revalidatePath(`/admin/lojistas/${organizationId}/planilha`);

    return { success: true, result };
  } catch (error) {
    console.error('❌ Erro ao processar planilha:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    };
  }
}
