export default function displayPdf(pathName: string) {
  return `/api/pdf/${encodeURIComponent(pathName)}`;
}
