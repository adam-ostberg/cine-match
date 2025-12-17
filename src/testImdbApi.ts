
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

const ratings = await fetchImdbRatings(
[
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0071562', // The Godfather Part II
  'tt0468569', // The Dark Knight
  'tt0050083', // 12 Angry Men
  'tt0108052', // Schindler's List
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0110912', // Pulp Fiction
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0137523', // Fight Club
  'tt0109830', // Forrest Gump
  'tt0080684', // Star Wars: Episode V – The Empire Strikes Back
  'tt1375666', // Inception
  'tt0167261', // The Lord of the Rings: The Two Towers
  'tt0073486', // One Flew Over the Cuckoo’s Nest
  'tt0099685', // Goodfellas
  'tt0133093', // The Matrix
  'tt0047478', // Seven Samurai
  'tt0114369', // Se7en
  'tt0317248', // City of God
  'tt0118799', // Life Is Beautiful
  'tt0120815', // Saving Private Ryan
  'tt0102926', // The Silence of the Lambs
  'tt0064116', // Once Upon a Time in the West
  'tt0088763', // Back to the Future
  'tt0110413', // Léon: The Professional
  'tt0245429', // Spirited Away
  'tt0120586', // American History X
  'tt6751668', // Parasite
  'tt0172495', // Gladiator
  'tt0816692', // Interstellar
  'tt0120338', // Titanic
  'tt0944947', // Game of Thrones
  'tt0082971', // Raiders of the Lost Ark
  'tt0038650', // It’s a Wonderful Life
  'tt0114709', // Toy Story
  'tt0253474', // The Pianist
  'tt0054215', // Psycho
  'tt0112573', // Braveheart
  'tt0209144', // Memento
],
);
