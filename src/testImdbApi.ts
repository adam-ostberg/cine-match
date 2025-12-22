
export interface ImdbRatingBatchResponse {
  data: {
    titles: ImdbTitle[];
  };
}

export interface ImdbTitle {
  __typename: 'Title';
  id: string;
  canRate: {
    isRatable: boolean;
  };
  ratingsSummary: {
    voteCount: number;
    aggregateRating: number | null;
    topRanking: {
      rank: number;
    } | null;
  };
}
export async function fetchImdbRatings(
    tconsts: string[],
    country = 'US',
    language = 'en-US'
): Promise<ImdbRatingBatchResponse> {
    const params = new URLSearchParams({
        tconsts: tconsts.join(','),
        country,
        language,
    });

    const API_KEY = "32aa65275cmshf1a630fda02aaebp14fd20jsn18995b62c8bc";
    const url = `https://imdb8.p.rapidapi.com/title/v2/get-rating-batch?${params.toString()}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'imdb8.p.rapidapi.com',
        },
    });

    if (!response.ok) {
        throw new Error(`IMDb API error: ${response.status}`);
    }

    const data = await response.json() as ImdbRatingBatchResponse;
    return data;
}
