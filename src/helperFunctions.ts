// https://www.npmjs.com/package/countries-and-timezones
import { getCountryForTimezone } from "countries-and-timezones";

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
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const text = hours === 0 ? `${minutes}m` : `${hours}h ${minutes}m`;
  return text;
}

export function getCountryCode(): string | null {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const timezoneData = getCountryForTimezone(userTimezone);
  console.log(timezoneData);
  return timezoneData ? timezoneData.id : null;
}

export function chunk(array: Array<any>, size: number = 5) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}
