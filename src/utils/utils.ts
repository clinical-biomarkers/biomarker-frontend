export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt: string) {
      let result = txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      if (result === 'Id') {
        result = 'ID';
      } else if (result === 'Url') {
        result = 'URL';
      }
      return result;
    }
  )
}
