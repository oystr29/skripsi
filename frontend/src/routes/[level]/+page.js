import { env } from '$env/dynamic/public';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
  /** @type {import('axios').AxiosResponse<{ letters: string[]; words: string[] }>} */
  const res = await axios(`${env.PUBLIC_BASE_API}/words/${params.level}`);
  let ket = '';

  if (params.level === '3') {
    ket = 'Untuk huruf J memakai bentuk akhir, sedangkan huruf R memakai bentuk awalnya';
  } else if (params.level === '4') {
    ket = 'Ayo coba pakai semua ilmu yang udah kamu pakai :)';
  }

  return {
    level: params.level,
    title: `Level ${params.level}`,
    content: `${res.data.letters.join(', ')}`,
    ket
  };
}
