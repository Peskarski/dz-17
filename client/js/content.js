export class Content {
  constructor(container, post) {
    this.container = container;
    this.post = post;
    this.url = '/api/data';
    this.init();
  }

  init() {
    this.getData();
  }

  render(item) {
      this.container.classList.remove('post-no-display');
        this.container.firstElementChild.innerHTML = `
          <p>${item.title}</p>
          <p>${item.date}</p>
        `;
        this.container.lastElementChild.innerHTML = `
          <p>${item.content}</p>
        `
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
          }
        })
      });
  }
}
