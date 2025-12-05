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