import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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

export function hideRootAndMainContentOverflow(remove: boolean = false) {
  if (remove) {
    const mainContent = document.querySelector(".mainContent"); // makes the background scrollable again when the DetailsView is removed
    const root = document.querySelector(":root");
    root?.classList.remove("hide-overflow");
    mainContent?.classList.remove("hide-overflow"); // makes the background scrollable again when the DetailsView is removed
  }
  else {
    const mainContent = document.querySelector(".mainContent"); // stops the background from being scrollable when the DetailsView is on top
    const root = document.querySelector(":root");
    root?.classList.add("hide-overflow");
    mainContent?.classList.add("hide-overflow"); // stops the background from being scrollable when the DetailsView is on top
  }
}


export function chunk(array: Array<any>, size: number = 5) {
  const result = [];

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}