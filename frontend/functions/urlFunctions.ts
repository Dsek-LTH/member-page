export default function displayPdf(url: string) {
  return `/api/pdf/${encodeURIComponent(url)}`;
}
