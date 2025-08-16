import { NextRequest, NextResponse } from 'next/server';
import { uploadPointsSpreadsheetAction } from '@/app/actions/points-import.actions';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const result = await uploadPointsSpreadsheetAction(formData);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, result: result.result });
  } catch (error) {
    console.error('Erro na API de upload:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erro interno do servidor' 
      },
      { status: 500 }
    );
  }
}
