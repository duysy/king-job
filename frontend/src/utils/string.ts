export const formatUsername = (username: string) => {
  if (!username?.length) return "???";
  if (username.length > 6) {
    return `${username.substring(0, 4)}...${username.substring(
      username.length - 2
    )}`;
  }
  return username;
};
