export default async function convertPdfToImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/utlagg/pdf-to-image', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  const blob = await fetch(data.base64).then((r) => r.blob());
  return URL.createObjectURL(blob);
}
