import { Form } from './form.js';
document.querySelector('#openModal').addEventListener('click', () => {
  document.querySelector('.modal').dataset.method = 'POST';
});
const formEl = document.querySelector('#addPost');
const form = new Form(formEl);
