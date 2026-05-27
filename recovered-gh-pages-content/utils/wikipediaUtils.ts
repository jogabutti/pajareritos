const birdImageCache: Record<string, string | null> = {};

export async function getBirdImageWikipediaCached(sciName: string): Promise<string | null> {

  if (birdImageCache[sciName]) return birdImageCache[sciName];
  try {
    const apiUrl = `https://es.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&titles=${encodeURIComponent(sciName)}&pithumbsize=600&origin=*`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    const pages = data.query?.pages;
    if (pages) {
      const page: any = Object.values(pages)[0];
      if (page && page.thumbnail && page.thumbnail.source) {
        birdImageCache[sciName] = page.thumbnail.source;
        return page.thumbnail.source;
      }
    }
    birdImageCache[sciName] = null;
    return null;
  } catch {
    birdImageCache[sciName] = null;
    return null;
  }
}
