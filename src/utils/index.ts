export const genUsername = (): string => {
  const usernamePrefix = 'user-';
  const randomChars = Math.random().toString(36).slice(2);

  const username = usernamePrefix + randomChars;

  return username;
};

/**
 * Generate arandom slug from a title
 * @param title Tthe title to generate a slug from
 * @returns A random slug
 */
export const genSlug = (title: string): string => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  const randomChars = Math.random().toString(36).slice(2);
  const uniqueSlug = `${slug} - ${randomChars}`;

  return uniqueSlug;
};
