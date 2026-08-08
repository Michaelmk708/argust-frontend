export function copyToClipboard(text, onSuccess) {
  navigator.clipboard.writeText(text).then(() => {
    if (onSuccess) onSuccess();
  });
}

export function truncateAddress(address, chars = 4) {
  if (!address) return '';
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}