import { Content } from './content.js';

export class List {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.ulr = '/api/data';
    this.init();
  }

  init() {
    this.render();
    this.listenShowContent();
  }

  render() {
    this.container.innerHTML = '';
    this.data.forEach((element) => {
      const listItem = document.createElement('li');
      listItem.id = element.id;
      listItem.innerHTML = `
      <p>${element.title}</p>
      <p>${element.date}</p>
      `;
      listItem.classList.add('list-item');
      this.container.append(listItem);
    });
  }

  showContent(item) {
    const container = document.querySelector('.post');
    const content = new Content(container, item);
  }

  showActiveItem(item) {
    if (document.querySelector('.active-item')) {
      document.querySelector('.active-item').classList.remove('active-item');
      item.classList.add('active-item');
    } else {
      item.classList.add('active-item');
    }
  }

  listenShowContent() {
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('list-item')) {
        this.showActiveItem(e.target);
        this.showContent(e.target);
      }
    });
  }
}
