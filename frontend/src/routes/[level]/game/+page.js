import { env } from '$env/dynamic/public';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  const res = await axios(`${env.PUBLIC_BASE_API}/words/${params.level}`);

  /** @type {{letters: string[]; words: string[]} }*/
  const data = res.data;

  return {
    data,
    level: params.level,
    title: `Level ${params.level}`,
    content: 'Kamu akan memperagakan huruf I, J, dkk'
  };
}
