export enum MimeType {
  JPEG = 'jpeg',
  WEBP = 'webp'
}

// Maintain this order so that WebPs are prefered to JPEGs if the browser supports them
export const ALL_MIME_TYPES = [
  MimeType.WEBP,
  MimeType.JPEG
]
