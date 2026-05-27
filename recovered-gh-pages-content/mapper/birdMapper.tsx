import { parseCSV } from "../utils/csvParser";
interface Taxon {
  speciesCode: string;
  comName: string;
  sciName: string;
}

interface ArgentinianBird {
  sciName: string;
  esName: string;
  enName: string;
  family: string;
}

let taxonMap: Record<string, Taxon> = {};
let argBirdsMap: Record<string, ArgentinianBird> = {};

export async function loadTaxonomy(): Promise<void> {
  // Load eBird taxonomy
  if (Object.keys(taxonMap).length === 0) {
    const response = await fetch(process.env.PUBLIC_URL + '/data/eBird_taxonomy_v2024.csv');
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    const parsed = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj: any = {};

      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim();
      });

      return obj;
    });

    parsed.forEach((row: any) => {
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
    });
  }

  // Load avesArgentinas.csv
  if (Object.keys(argBirdsMap).length === 0) {
    const response = await fetch(process.env.PUBLIC_URL + '/data/avesArgentinas.csv');
    const csvText = await response.text();

    const rows = csvText.split('\n');

    rows.forEach((row) => {
      const cols = row.split(';');

      if (cols.length >= 5) {
        const sciName = cols[1].trim();
        const esName = cols[2].trim();
        const enName = cols[3].trim();
        const family = cols[4].trim();

        if (sciName) {
          argBirdsMap[sciName.toLowerCase()] = {
            sciName,
            esName,
            enName,
            family,
          };
        }
      }
    });
  }
}


export function getBirdInfo(code: string): Taxon | undefined {
  return taxonMap[code];
}

export function getArgentinianBirdInfo(sciName: string): ArgentinianBird | undefined {
  return argBirdsMap[sciName.toLowerCase()];
}