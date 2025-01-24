/**
 * Extracts the port from a URL, even if it's embedded in the subdomain.
 * @param url - The URL string to extract the port from.
 * @returns The extracted port as a string.
 * @throws Error if the port cannot be determined.
 */

export const getPortFromUrl = (url: string): string => {
  const parsedUrl = new URL(url);
  if (parsedUrl.port) {
    return parsedUrl.port;
  }

  const subdomainPortMatch = parsedUrl.hostname.match(/-(\d+)\./);
  if (subdomainPortMatch) {
    return subdomainPortMatch[1];
  }

  if (parsedUrl.protocol === 'http:') {
    return '80';
  } else if (parsedUrl.protocol === 'https:') {
    return '443';
  }

  throw new Error('Unable to determine the port from the URL...');
};
