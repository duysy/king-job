export const shortenAddress = (address: string) => {
  if (!address) return "";
  const firstPart = address.slice(0, 10);
  const lastPart = address.slice(-4);
  return `${firstPart}...${lastPart}`;
};

export const shortenTransactionHash = (transaction: string) => {
  if (!transaction) return "";
  const firstPart = transaction.slice(0, 15);
  const lastPart = transaction.slice(-6);
  return `${firstPart}...${lastPart}`;
};
