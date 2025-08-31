import axios from 'axios';
const EBIRD_API_KEY = process.env.REACT_APP_EBIRD_API_KEY || '';

export async function getRegions(regionCode: string) {
  const url = `https://api.ebird.org/v2/ref/region/info/CA-BC-GV?regionNameFormat=detailed`;
  const response = await axios.get(url, {
    headers: {
        'X-eBirdApiToken': EBIRD_API_KEY
      }
  });
  // Devuelve un array de objetos con code y name
  return response.data.map((r: any) => ({
    code: r.code,
    name: r.name
  }));
}