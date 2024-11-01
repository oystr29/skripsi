import { env } from '$env/dynamic/public';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export async function load() {
  /**
   *@typedef {{ train: Record<string, number>; 
   test: Record<string, number>; sum_train: number; sum_test: number }} Count
   * @type {import('axios').AxiosResponse<{ img: Count; txt: Count; sum_img: number; sum_txt: number }>} */
  const res = await axios(`${env.PUBLIC_BASE_API}/count`);

  return res.data;
}
