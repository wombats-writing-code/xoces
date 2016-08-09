
/** utils:
  given a string, a maximum width,returns an array of partial strings
*/

export const stringWidth = (string, fontSize) => {
  let factor = 4.25/10 * fontSize;
  return string.length * factor;
}

export const multiLine = (string = '', fontSize, maxWidth) => {
  if (!maxWidth) {
    console.error('maxWidth for line must be given')
  }

  let width = stringWidth(string, fontSize);
  if (width < maxWidth) {
    return [string];
  }

  let parts = string.split(' ');
  let lines = [];
  let currentLine = [];
  for (var i=0; i<parts.length; i++) {
    let testString = _.concat(currentLine, parts[i]).join(' ');
    if (stringWidth(testString, fontSize) >= maxWidth) {
      lines.push(currentLine.slice());
      currentLine = [];
    } else {
      currentLine.push(parts[i]);
    }
  }

  let result = _.map(lines, (stringArray) => stringArray.join(' '))

  return result;
}
