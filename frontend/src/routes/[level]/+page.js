import { env } from '$env/dynamic/public';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  /** @type {import('axios').AxiosResponse<{ letters: string[]; words: string[] }>} */
  const res = await axios(`${env.PUBLIC_BASE_API}/words/${params.level}`);
  return {
    level: params.level,
    title: `Level ${params.level}`,
    content: `${res.data.letters.join(', ')}`
  };
}
