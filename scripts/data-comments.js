export default async function getComments(id) {
  const response = await fetch(`https://gorest.co.in/public-api/posts/${id}/comments`, {
    method: 'GET',
  });

  const data = await response.json();

  return data;
}
