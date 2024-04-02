export const extractKeyFromUrl = (url: string) => {
  const regex = /https:\/\/[^\/]+\.s3\.[^\/]+\.amazonaws\.com\/(.*)/;
  const match = url.match(regex);

  return match ? match[1] : null;
};
