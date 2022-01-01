const copyTextToClipboard = async (text: string) => {
  if ('clipboard' in navigator) {
    return navigator.clipboard.writeText(text);
  }
  return document.execCommand('copy', true, text);
};
export default copyTextToClipboard;
