import { GoogleAuth } from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function getSheetData() {
  const auth = new GoogleAuth({
    credentials: {
      type: 'service_account',
      private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCRD36RpfN+k9wb\ndJ5PtIC8+WT0pkBUQMKXhCpZdXSnYe7381mZONxyeqYqEHGIDFZZuQcGC7mbxIYj\nP9NvGezHBBfPvYGX9kVnFsqVa8J2lhjylHOBGJobCSU4IbfG9DzKAKjhCrqK/J2U\nkbrxtG9uXjoE9bBTQpGLa9mELV7i4j4NxCwaWnICsICvaxAJ8hI7Mu/THTErC72O\nNthtfKHBcT/zpdDwRsJ+aKTVKBGlEkeYbDsDMJ2RRAjEOOpIxKhygnvS7EFgLYZd\n8jhqr/Hz+H4orA0aL6srpGIKp3U3PZL1f/KaTp15eMCMOh16YYG5glLREC41zG4A\nN5xiKQmPAgMBAAECggEAFm82saCLHlS7Ii/mBV5dhAcaGvrUph3Mj+cBLwwK+jwb\nhj4c6aUxStnhyvhMvAVpxr878S5tCpnZQ6hXsy4SQDFHhs8V34JXTNCUjN65Q40x\nLIsoVfCPx4X25fh+VgcTQ7aDEn2N83g1iB2wXjimpy4W0Qo3tpjBWQuup1I7rjZN\nq78cfC/H4ZJvqI+sXdgN3s6ii8wGLtBodt2TkyFQPsG408V6DRVYFpDcrB/cvaeL\nPKEzR1sOano9SF2tO5jZbUq/EbuktXSmkKtSuxOU7ykEXpjy95NPvGU6KGmSH0GN\njYMXh6V1c5dIAhgaSBcrSOkQPA7U6acFzsA9mjQwAQKBgQDBY0OCGPb1mHpvyg1n\nVRhdfOLjz2sgokxkRrBAJLTFsUJvhN1fGZdB3jPM8xd6mLmx1BFPjlucceNtimHs\nczZyiPTY2WtTT0VjOwkw7Mafz6hftAH/w0zdLn7hX4lWUWhXpvXQtKn6WQY31haR\ndyHhEEU/J0XqvHiF3fLN9h5IAQKBgQDABq449Fc3tuSUenXBn1Q2G0n+OtfbxpIo\nBUqjwAgnxCAbq5p47iGYDNByoHDu8GvKsY+iVtOHRIXVU+oyf0yza8AgFl8iBJSe\nflpkFWWlSYBdK8fGL0RZW5whe4xQOtC0/roYVMRs4ZJgd5Cw9ZTT9O0Q+XeHmPw6\nF1s7/nbRjwKBgGoeyX3Lq0FMIevUSZSpmow6qtruCFBJH3hrXe5k9hoB0n4Vv9Ce\n32TSxUQzJXAt/MB7qeApM1ZfHLkQlfnFo1wokYupi36U4nO4gqupUrmBn1idE/fA\nuR4qlI+h+GA4nfRzdzLG4Puy/HmJbqr2X838OrOUHobYU57KE6I365gBAoGAL554\nfe854bsdHCTyJr3YKELEKqN0/C9V9064n7rzSsk8HSCFAhArjIVA++wFlXtRf8Zg\nlCVr91NqzOguX69p2eSSlGJ33Pu9z0AOMluMBV0g0/oTZHY8QNyS70qwFQVA1GGG\nzJnYzBd0MS/1VazQ528JivgSSDIL+mvoWAxWcskCgYBswXWPuQYhzJlGudqbBI6g\nS1urPy7Wp571zi94Z0zg2J4FgFC4sFrSnsNNf3EFYu71GwlFZimiut1mHirYfHoG\nMALBICite6aMiDbt/XJu3RXd9zUFMrMWGN1FC/Dd84ybN1mEfiUH3zhfoWXwMEpt\nq3kZA9xOY+n2W+ACaAvnmw==\n-----END PRIVATE KEY-----\n',
      client_email: 'id-897@first-scout-361208.iam.gserviceaccount.com',
      client_id: '118423753992500523714',
      universe_domain: 'googleapis.com',
    },
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });

  const doc = new GoogleSpreadsheet(process.env.GCP_CONTENT_DOC_ID as string, auth);

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  const rowsData = rows.map((row: any) => ({
    thumbnail: row._rawData[0],
    video_id: row._rawData[1],
    subject: row._rawData[2],
    summary: row._rawData[3],
    blockquote: row._rawData[4],
    created: row._rawData[5],
  }));

  return rowsData.sort((a, b) => a.thumbnail.localeCompare(b.thumbnail));
}
