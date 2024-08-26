/** @type {import('./$types').PageLoad} */ export function load({ params }) {
  return {
    level: params.slug,
    title: `Level ${params.slug}`,
    content: 'Kamu akan mempelajari huruf I, J, dkk'
  };
}
