import serverData from './data-page.js';
import getComments from './data-comments.js';

async function createMainPageContent(data) {
  const articles = document.getElementById('articles');
  const itemsList = document.createElement('ol');
  const pageNumber = data.meta.pagination.page;

  itemsList.classList.add('list-group-flush', 'list-group-numbered');

  data.data.forEach((element) => {
    const itemCount = document.createElement('span');
    const item = document.createElement('li');
    const link = document.createElement('a');

    item.classList.add('list-group-item');

    link.setAttribute('href', `post.html?id=${element.id}`);
    link.innerText = element.title;

    itemCount.append(`${pageNumber}. `);
    item.append(itemCount);
    item.append(link);
    itemsList.append(item);
  });

  articles.append(itemsList);
}

async function createComments(id) {
  const data = await getComments(id);

  if (!data.data.length) {
    return '';
  }

  const comments = document.createElement('ul');
  comments.classList.add('list-group', 'mb-4');

  data.data.forEach((item) => {
    const comment = document.createElement('li');
    comment.classList.add('list-group-item');

    const name = document.createElement('h4');
    const body = document.createElement('div');
    const email = document.createElement('a');
    email.classList.add('mail');

    name.innerText = item.name;
    body.innerText = item.body;
    email.innerText = item.email;

    comment.append(name);
    comment.append(body);
    comment.append(email);

    comments.append(comment);
  });

  return comments;
}

async function createDetailPageContent(data) {
  const articles = document.getElementById('detail-articles');

  const item = document.createElement('div');
  const title = document.createElement('h1');
  title.classList.add('title-detail-page', 'mb-3');
  item.classList.add('mb-4');

  title.innerText = data.data[0].title;
  item.innerText = data.data[0].body;

  const comments = await createComments(data.data[0].id);
  articles.append(title);
  articles.append(item);
  articles.append(comments);
}

async function errorPage() {
  const data = await serverData();

  if (data.meta.pagination.page > data.meta.pagination.pages || data.meta.pagination.page < 0) {
    const title = document.createElement('h2');
    title.classList.add('title', 'error');
    title.innerText = 'Такой страницы нет!';
    document.querySelector('.articles').append(title);
  }
}

async function createPagination() {
  const data = await serverData();

  const pagePrevNum = (data.meta.pagination.page - 1 < 1) ? 1 : data.meta.pagination.page - 1;
  const pageNextNum = (data.meta.pagination.page + 1 > data.meta.pagination.pages)
    ? data.meta.pagination.pages
    : data.meta.pagination.page + 1;

  const btnPageNav = document.querySelectorAll('.btn-nav');
  const pageCount = document.querySelector('.page-count');

  if (pageCount) {
    pageCount.innerText = (`${data.meta.pagination.page}/${data.meta.pagination.pages}`);
    btnPageNav.forEach((event) => {
      event.addEventListener('click', (el) => {
        if (el.target.classList.contains('btn-next')) {
          const linkBtnNext = `?page=${pageNextNum}`;
          const btnNextHtml = el.path[0];

          btnNextHtml.setAttribute('href', `index.html${linkBtnNext}`);
        } else {
          const linkBtnPrev = (pagePrevNum === 1) ? '' : `?page=${pagePrevNum}`;
          const btnPrevHtml = el.path[0];

          btnPrevHtml.setAttribute('href', `index.html${linkBtnPrev}`);
        }
      });
    });
  }
}

async function createMainPage() {
  const data = await serverData();
  await createPagination();

  if (document.location.pathname.includes('/index.html')) {
    createMainPageContent(data);
  } else {
    createDetailPageContent(data);
  }

  errorPage();
}

window.onload = createMainPage();
