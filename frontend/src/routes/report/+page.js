import { env } from '$env/dynamic/public';
import axios from 'axios';

/** @type {import('./$types').PageLoad} */
export async function load() {
  /** 
   *@typedef {{ 'f1-score': number;
    precision: number;
    recall: number;
    support: number;}} CM
   * @type {import('axios').AxiosResponse<{ cm_report: Record<'1' | '2', Record<string, CM | number>>;cm_image: {
          '1': string;
          '2': string;
        };  }>} */
  const res = await axios(`${env.PUBLIC_BASE_API}/report`);
  const cm_report1 = Object.keys(res.data.cm_report[1]).map((l) => {
    if (typeof res.data.cm_report[1][l] === 'number')
      return {
        letter: l,
        value: res.data.cm_report[1][l],
        'f1-score': 0,
        precision: 0,
        recall: 0,
        support: 0
      };

    return {
      letter: l,
      value: 0,
      ...res.data.cm_report[1][l]
    };
  });

  const cm_report2 = Object.keys(res.data.cm_report[2]).map((l) => {
    if (typeof res.data.cm_report[2][l] === 'number')
      return {
        letter: l,
        value: res.data.cm_report[2][l],
        'f1-score': 0,
        precision: 0,
        recall: 0,
        support: 0
      };
    return {
      letter: l,
      value: 0,
      ...res.data.cm_report[2][l]
    };
  });

  return {
    ...res.data,
    cm_report1,
    cm_report2
  };
}
