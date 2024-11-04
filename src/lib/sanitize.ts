export const sanitize = (input: string): string => {
  const sanitizationPattern = /[^\p{L}\p{N}@._-]/gu;
  return input.replace(sanitizationPattern, '');
};
