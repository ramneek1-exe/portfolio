export function splitText(element) {
  const text = element.innerText;
  element.innerHTML = '';
  const chars = text.split('').map((char) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    element.appendChild(span);
    return span;
  });
  return chars;
}
