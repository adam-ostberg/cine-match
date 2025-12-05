export function getVideoUrl(video: { site: string; key: string }) {
  switch (video.site.toLowerCase()) {
    case "youtube":
      return `https://www.youtube.com/embed/${video.key}`;
    case "vimeo":
      return `https://vimeo.com/${video.key}`;
    case "dailymotion":
      return `https://www.dailymotion.com/video/${video.key}`;
    case "facebook":
      return `https://www.facebook.com/watch/?v=${video.key}`;
    case "apple":
      return video.key; // Already a full URL
    default:
      return null;
  }
}

export function minutesToHourAndMinutesText(totalMinutes: number) {
  const hours =  Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const text = hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  return text;
}

export function getCountryCode(): string {
  const locale = navigator.language || navigator.language[0];
  const countryCode = locale.split("-")[1];
  return countryCode
}
