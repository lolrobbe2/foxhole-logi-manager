export function resolvePath(relativePath: string): string {
  let baseUrl:string = import.meta.env.BASE_URL;
  if (!baseUrl.endsWith('/')) {
    baseUrl = baseUrl + '/';
  }
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1);
  }
  return baseUrl + relativePath;
}
