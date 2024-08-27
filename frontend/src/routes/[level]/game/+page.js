/** @type {import('./$types').PageLoad} */ export function load({ params }) {
  return {
    level: params.level,
    title: `Level ${params.level}`,
    content: 'Kamu akan mempelajari huruf I, J, dkk'
  };
}
