const cutStringFromLastSlash = (str: string) => {
  const lastSlashIndex = str.lastIndexOf('/');
  return lastSlashIndex !== -1 ? str.slice(lastSlashIndex + 1) : str;
};

export const getCharsIds = (characters: string[]) => {
  return characters.map(char => cutStringFromLastSlash(char));
};