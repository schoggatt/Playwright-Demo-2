import { TFamily } from '../types/Family';
import { delay } from '../utilities/utilities';

export async function getFamilies(): Promise<TFamily[]> {
  await delay(1000);
  return fetch('http://localhost:3001/families').then((response) =>
    response.json()
  );
}
