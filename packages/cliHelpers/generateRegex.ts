export function generateRegex(componentTitle: Set<string>) {
  const pattern = [...componentTitle].join("|");
  return `^(${pattern})`;
}
