export function generateRegex(componentTitle: Set<string>) {
  const pattern = [...componentTitle]
    .map((v) => v.replace(/\//g, '\\/')) // escape /
    .join('|');

  return new RegExp(`^(${pattern})`);
}