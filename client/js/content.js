import { List } from './list.js';

export class Content {
  constructor(container, post) {
    this.container = container;
    this.post = post;
    this.url = '/api/data';
    this.modal = new bootstrap.Modal(document.querySelector('.modal'));
    this.data = {};
    this.listContainer = document.querySelector('.list');
    this.init();
  }

  init() {
    this.getData();
  }

  render(item) {
    if (this.container.lastElementChild.classList.contains('btn')) {
      this.container.lastElementChild.remove();
      this.container.lastElementChild.remove();
    }

    this.container.classList.remove('post-no-display');
    this.container.firstElementChild.innerHTML = `
          <p>${item.title}</p>
          <p>${item.date}</p>
        `;
    this.container.lastElementChild.innerHTML = `
          <p>${item.content}</p>
        `
    const editButton = document.createElement('button');
    editButton.textContent = 'Реадктировать';
    editButton.classList.value = 'btn btn-primary edit-content';
    editButton.dataset.id = this.post.id;
    this.container.append(editButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.classList.value = 'btn btn-danger delete-content';
    deleteButton.id = this.post.id;
    this.container.append(deleteButton);

    this.listenEditPost();
    this.listenDeletePost();
  }

  getData() {
    return fetch(this.url, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        data.list.forEach((element) => {
          if (element.id === this.post.id) {
            this.render(element);
            this.data = element;
          }
        })
      });
  }

  listenEditPost() {
    document.querySelector('.edit-content').addEventListener('click', () => {
      this.modal._element.dataset.method = 'PUT';
      document.querySelector('#postHeader').value = this.data.title;
      document.querySelector('#postContent').value = this.data.content;
      document.querySelector('#metaId').value = this.data.id;
      document.querySelector('#metaDate').value = this.data.date;
      this.modal.show();
    });
  }

  listenDeletePost() {
    document.querySelector('.delete-content').addEventListener('click', (e) => {
      const id = e.target.id;
      const toDelete = confirm('Вы действительно хотите удалить пост?');
      if (toDelete) {
      this.deletePost(id);
      }
    });
  }

  deletePost(id) {
    return fetch(this.url + `/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
    })
    .then((response) => response.json())
    .then((data) => new List(this.listContainer, data.list))
    .catch((error) => console.error(error));
  }
}
