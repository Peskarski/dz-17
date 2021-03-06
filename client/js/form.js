import { List } from './list';

export class Form {
  constructor(form) {
    this.form = form;
    this.url = '/api/data';
    this.init();
    this.listContainer = document.querySelector('.list');
  }

  init() {
    this.listenSubmitForm();
  }

  listenSubmitForm() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {};

      const isValid = this.form.checkValidity();
      if (!isValid) {
        this.form.classList.add('check-valid');
      } else {
        this.form.classList.remove('check-valid');

        if (document.querySelector('.modal').dataset.method === 'POST') {
          const currentDate = new Date();
          this.setMetaData(+currentDate, this.formatDate(currentDate));
        }
        const formData = new FormData(this.form);
        formData.forEach((value, key) => {
          data[key] = value;
        });
        this._send(data);
        this.form.reset();
      }
    });
  }

  _send(data) {
    let method = document.querySelector('.modal').dataset.method;
    let url = '';
    method === 'POST' ? url = this.url : url = this.url + `/${data.id}`;
    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => new List(this.listContainer, data.list))
      .catch((error) => console.error(error));
  }

  formatDate(date) {
    const day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();
    const month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1);
    const year = date.getFullYear();
    const hours = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    const minutes = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();

    const result = `${day}.${month}.${year}  ${hours}:${minutes}`;

    return result;
  }

  setMetaData(id, date) {
    document.querySelector('#metaId').value = id;
    document.querySelector('#metaDate').value = date;
  }
}
