export default async function serverData() {
  const pageParams = new URLSearchParams(window.location.search);
  const pageId = pageParams.get('id');
  let response;

  if (pageId) {
    response = await fetch(`https://gorest.co.in/public-api/posts?id=${pageParams.get('id')}`, {
      method: 'GET',
    });
  } else {
    response = await fetch(`https://gorest.co.in/public-api/posts?page=${pageParams.get('page')}`, {
      method: 'GET',
    });
  }

  const data = await response.json();

  return data;
}
