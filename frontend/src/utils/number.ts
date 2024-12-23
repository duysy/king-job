export const convertTon = (value: number, decimals: number = 2): string => {
  return (value / 10 ** 9).toFixed(decimals);
};
