export function getFamilies() {
  return fetch('http://localhost:3001/families').then((response) =>
    response.json()
  );
}
