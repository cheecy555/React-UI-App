import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

import { DocumentService } from '@/services/document';
import { putFetchTempJWT } from '@/utils/fetches';

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Check if this is a test document request (from public folder)
//     if (request.nextUrl.pathname.startsWith('/api/documents/test/')) {
//       const filename = params.id.endsWith('.pdf') ? params.id : `${params.id}.pdf`;
//       const pdfPath = path.join(process.cwd(), 'public', filename);

//       if (!fs.existsSync(pdfPath)) {
//         return NextResponse.json(
//           { error: 'PDF file not found' },
//           { status: 404 }
//         );
//       }

//       const pdfBuffer = fs.readFileSync(pdfPath);

//       return new NextResponse(pdfBuffer, {
//         headers: {
//           'Content-Type': 'application/pdf',
//           'Content-Disposition': 'inline',
//           'Cache-Control': 'public, max-age=300',
//           'Accept-Ranges': 'bytes',
//         },
//       });
//     }

//     // Handle production document requests
//     const documentContent = await DocumentService.getDocumentContent(params.id);

//     return new NextResponse(documentContent, {
//       headers: {
//         'Content-Type': 'application/pdf',
//         'Content-Disposition': 'inline',
//         'Cache-Control': 'private, max-age=300',
//         'ETag': `"${params.id}"`,
//       },
//     });

//   } catch (error) {
//     console.error('Error serving document:', error);
//     return NextResponse.json(
//       { error: 'Failed to serve document' },
//       { status: 500 }
//     );
//   }
// } 


export async function GET(req: NextRequest) {
  let isOk = false
  try {

    const fileid = req.nextUrl.searchParams.get('fileid')
    const checklistid = req.nextUrl.searchParams.get('checklistid')
    const formSlug = req.nextUrl.searchParams.get('formslug')
    // console.log('PortalResultError', { fileid: fileid, checklistid: checklistid, formSlug: formSlug })


    if (fileid != null) {
      const data = await fetch(`/api/f/${fileid}`)

    } else if (checklistid != null) {
      const data = await putFetchTempJWT<any>(`/api/h/auth`, { l231id: checklistid, lid: formSlug })

    } else {
      return NextResponse.json({
        ok: isOk
      })
    }

  } catch (err) {
    isOk = false
  }



  return NextResponse.json({
    ok: false
  })
}