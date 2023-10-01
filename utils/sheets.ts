import { GoogleAuth } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function getSheetData(start?: number, count?: number) {
  const auth = new GoogleAuth({
    credentials: {
      type: 'service_account',
      private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      client_email: process.env.GCP_CLIENT_EMAIL,
      client_id: process.env.GCP_CLIENT_ID,
      universe_domain: 'googleapis.com',
    },
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const doc = new GoogleSpreadsheet(process.env.GCP_CONTENT_DOC_ID as string, auth);

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const rowsData = rows.map((row: any) => ({
    idx: row._rawData[0],
    video_id: row._rawData[1],
    subject: row._rawData[2],
    summary: row._rawData[3],
    blockquote: row._rawData[4],
    created: row._rawData[5],
  }));

  const sortedRowsData = rowsData.sort((a, b) => b.idx.localeCompare(a.idx));

  if (start !== undefined && count !== undefined) {
    return sortedRowsData.slice(start, start + count);
  }
  return sortedRowsData;
}
