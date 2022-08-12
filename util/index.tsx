export function toTitle(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}


export function toCamel(value: string) {
  value = value.replace("_", " ");
  const words = value.split(" ");

  for (let i = 0; i < words.length; i++) {
    if(words[i].length > 0) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
  }

  return words.join(" ").replace(" ", "");
}