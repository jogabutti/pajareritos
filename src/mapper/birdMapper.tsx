import Papa from 'papaparse';

interface Taxon {
  speciesCode: string;
  comName: string;
  sciName: string;
}

let taxonMap: Record<string, Taxon> = {};

export async function loadTaxonomy(): Promise<void> {
  const response = await fetch('/data/eBird_taxonomy_v2024.csv');
  const csvText = await response.text();
  const parsed = Papa.parse(csvText, { header: true });
  parsed.data.forEach((row: any) => {
    // El nombre de la columna en tu CSV es 'SPECIES_CODE', 'PRIMARY_COM_NAME', 'SCI_NAME'
    const code = row['SPECIES_CODE']?.trim();
    const comName = row['PRIMARY_COM_NAME']?.trim();
    const sciName = row['SCI_NAME']?.trim();
    if (code) {
      taxonMap[code] = {
        speciesCode: code,
        comName: comName || code,
        sciName: sciName || '',
      };
    }
    return taxonMap;
  });
}

export async function getBirdImage(sciName: string): Promise<string | null> {
  if (!sciName) return null;
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(sciName)}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

export function getBirdInfo(code: string): Taxon | undefined {
  return taxonMap[code];
}