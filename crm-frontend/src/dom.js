import { el, mount, setAttr } from 'redom';
import { ClientModal } from './Components/ClientModal.js';
import { Header } from './Components/Header.js';
import { ClientTableCard } from './Components/ClientTableCard.js';

export function createAddClientModal(modalTitle) {
  const clientModal = new ClientModal();
  const body = document.querySelector('body');
  const form = clientModal.createForm();
  const modalWrapper = clientModal.createWrapper();
  const title = clientModal.createTitle(modalTitle);
  const inputs = clientModal.createInputs();
  const inputName = inputs.inputName;
  const inputSurname = inputs.inputSurname;
  const inputPatronymic = inputs.inputPatronymic;
  const addContactButton = clientModal.createAddContactButton();
  const saveButton = clientModal.createSaveButton();
  const cancelButton = clientModal.createCancelButton();
  const closeButton = clientModal.createCloseButton();
  const errorsField = clientModal.createErrorsField();
  clientModal.counter <= 0 ? clientModal.contactsSecondaryWrapper.classList.add('no-padding') : false;
  mount(body, modalWrapper);
  mount(modalWrapper, form);
  mount(form, title);
  mount(form, inputSurname);
  mount(form, inputName);
  mount(form, inputPatronymic);
  mount(form, addContactButton);
  mount(form, errorsField);
  mount(form, saveButton);
  mount(form, cancelButton);
  mount(form, closeButton);

  return { form, errorsField, clientModal, modalWrapper };
}

function createAddClientButton() {
  const button = el('button');
  button.innerHTML = '<svg width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 8C16.71 8 18.5 6.21 18.5 4C18.5 1.79 16.71 0 14.5 0C12.29 0 10.5 1.79 10.5 4C10.5 6.21 12.29 8 14.5 8ZM5.5 6V3H3.5V6H0.5V8H3.5V11H5.5V8H8.5V6H5.5ZM14.5 10C11.83 10 6.5 11.34 6.5 14V16H22.5V14C22.5 11.34 17.17 10 14.5 10Z" fill="#9873FF"/></svg>Добавить клиента';
  setAttr(button, { class: 'btn-primary add-client-btn' });
  return button;
}

export function showOnEmptyClients() {
  document.querySelector('body').innerHTML = '';
  new Header();
  const main = el('main');
  const body = document.querySelector('body');
  mount(body, main);
  const wrapper = el('div');
  setAttr(wrapper, { class: 'empty-clients-wrapper' });
  const message = el('p', 'Список клиентов пуст');
  const heading = el('h1', 'Клиенты');
  const addClientButton = createAddClientButton();
  setAttr(heading, { class: 'clients__heading' });
  mount(wrapper, heading);
  mount(wrapper, message);
  mount(wrapper, addClientButton);
  mount(main, wrapper);
}

export function showOnExistingClients() {
  document.querySelector('body').innerHTML = '';
  new Header();
  const main = el('main');
  const body = document.querySelector('body');
  const sectionClients = el('section');
  setAttr(sectionClients, { class: 'section-clients' });
  const heading = el('h1', 'Клиенты');
  setAttr(heading, { class: 'clients__heading' });

  const table = el('table');
  setAttr(table, { class: 'clients-table', rules: 'none' });

  const tableHead = el('thead');
  setAttr(tableHead, { class: 'clients__table-head' });

  const tableHeadRow = el('tr');
  setAttr(tableHeadRow, { class: 'clients__table-header' });

  const tableBody = el('tbody');
  setAttr(tableBody, { class: 'clients__table-body' });

  const addClientButton = createAddClientButton();
  addClientButton.classList.add('centrified-with-margin');

  const tableHeadingID = el('th', 'ID');
  tableHeadingID.onclick = () => tableHeadingID.querySelector('svg').classList.toggle('rotate-180');
  const tableHeadingName = el('th', 'Фамилия Имя Отчество');
  tableHeadingName.onclick = () => tableHeadingName.querySelector('svg').classList.toggle('rotate-180');
  const tableHeadingDate = el('th', 'Дата и время создания');
  tableHeadingDate.onclick = () => tableHeadingDate.querySelector('svg').classList.toggle('rotate-180');
  const tableHeadingChange = el('th', 'Последние изменения');
  tableHeadingChange.onclick = () => tableHeadingChange.querySelector('svg').classList.toggle('rotate-180');
  const tableHeadingContacts = el('th', 'Контакты');
  const tableHeadingActions = el('th', 'Действия');

  const span1 = el('span');
  setAttr(span1, { class: 'table-header__arrow' });
  span1.innerHTML = '<svg class="rotate-180" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
  const span2 = el('span');
  setAttr(span2, { class: 'table-header__arrow' });
  span2.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
  const span3 = el('span');
  setAttr(span3, { class: 'table-header__arrow' });
  span3.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
  const span4 = el('span');
  setAttr(span4, { class: 'table-header__arrow' });
  span4.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 6L2.705 6.705L5.5 3.915L5.5 10L6.5 10L6.5 3.915L9.29 6.71L10 6L6 2L2 6Z" fill="#9873FF"/></svg>';
  setAttr(tableHeadingID, { class: 'table-header__cell' });
  setAttr(tableHeadingName, { class: 'table-header__cell' });
  setAttr(tableHeadingDate, { class: 'table-header__cell' });
  setAttr(tableHeadingChange, { class: 'table-header__cell' });
  setAttr(tableHeadingContacts, { class: 'table-header__cell' });
  setAttr(tableHeadingActions, { class: 'table-header__cell' });

  mount(sectionClients, heading);
  mount(tableHeadingID, span1);
  mount(tableHeadingName, span2);
  mount(tableHeadingDate, span3);
  mount(tableHeadingChange, span4);
  mount(tableHeadRow, tableHeadingID);
  mount(tableHeadRow, tableHeadingName);
  mount(tableHeadRow, tableHeadingDate);
  mount(tableHeadRow, tableHeadingChange);
  mount(tableHeadRow, tableHeadingContacts);
  mount(tableHeadRow, tableHeadingActions);
  mount(tableHead, tableHeadRow);
  mount(table, tableHead);
  mount(table, tableBody);
  mount(sectionClients, table);
  mount(sectionClients, addClientButton);
  mount(main, sectionClients);
  mount(body, main);

  return { addClientButton, tableHeadingID, tableHeadingName, tableHeadingDate, tableHeadingChange };
}

export function createClientInTable(client) {
  const tableBody = document.querySelector('.clients__table-body');
  const clientCard = new ClientTableCard(client);
  const row = clientCard.createTableRow();
  const id = clientCard.createIDCell();
  const fullname = clientCard.createFullnameCell();
  const creationDate = clientCard.createCreatiionTimeCell();
  const editedTime = clientCard.createUpdatedTimeCell();
  const contacts = clientCard.createContactsCell(client.contacts);
  const clientActionsCell = clientCard.createEditAndDeleteWrapper();
  const editCard = clientCard.editButton;
  const deleteCard = clientCard.deleteButton;
  mount(row, id);
  mount(row, fullname);
  mount(row, creationDate);
  mount(row, editedTime);
  mount(row, contacts);
  mount(row, clientActionsCell);
  mount(tableBody, row);

  return { editCard, deleteCard, id, row };
}

export function createDeleteModal(modalTitle) {
  const clientModal = new ClientModal();
  const body = document.querySelector('body');
  const form = clientModal.createForm();
  const modalWrapper = clientModal.createWrapper();
  const title = clientModal.createTitle(modalTitle);
  title.classList.add('centrified-with-text-align');
  const deleteButton = clientModal.createSaveButton();
  deleteButton.textContent = 'Удалить';
  const cancelButton = clientModal.createCancelButton();
  const closeButton = clientModal.createCloseButton();
  const modalTextContent = el('p', 'Вы действительно хотите удалить данного клиента?');
  modalTextContent.classList.add('centrified-with-text-align');

  mount(body, modalWrapper);
  mount(modalWrapper, form);
  mount(form, title);
  mount(form, modalTextContent);
  mount(form, deleteButton);
  mount(form, cancelButton);
  mount(form, closeButton);

  return { deleteButton, modalWrapper };
}

export function createEditModal(modalTitle, client) {
  const clientModal = new ClientModal();
  const body = document.querySelector('body');
  const form = clientModal.createForm();
  const modalWrapper = clientModal.createWrapper();
  const titleWrapper = el('div');
  const title = clientModal.createTitle(modalTitle);
  const inputs = clientModal.createInputs();
  const inputName = inputs.inputName;
  const inputSurname = inputs.inputSurname;
  const inputPatronymic = inputs.inputPatronymic;
  inputName.value = client.name;
  inputSurname.value = client.surname;
  inputPatronymic.value = client.lastName || '';
  const addContactButton = clientModal.createAddContactButton();
  const saveButton = clientModal.createSaveButton();
  const id = clientModal.showClientID(client.id);
  const closeButton = clientModal.createCloseButton();
  const errorsField = clientModal.createErrorsField();
  const deleteButton = clientModal.createDeleteClientButton();

  mount(body, modalWrapper);
  mount(modalWrapper, form);
  mount(titleWrapper, title);
  mount(titleWrapper, id);
  mount(form, titleWrapper);
  mount(form, inputSurname);
  mount(form, inputName);
  mount(form, inputPatronymic);
  mount(form, addContactButton);
  mount(form, errorsField);
  mount(form, saveButton);
  mount(form, deleteButton);
  mount(form, closeButton);

  return { form, errorsField, clientModal, modalWrapper, saveButton, deleteButton, inputName, inputSurname, inputPatronymic };
}

export function createSearchResult(clients) {
  const searchResultsList = document.querySelector('.search-results__list');
  searchResultsList.innerHTML = '';
  clients.forEach(client => {
    const item = el('li');
    const idSpan = el('span');
    setAttr(idSpan, { class: 'secondary-text' });
    idSpan.textContent = `ID: ${client.id}`;
    setAttr(item, { class: 'search-results__item search', tabindex: '0' });
    item.id = `#${client.id}`;
    item.textContent = `${client.surname} ${client.name} ${client.lastName}`;
    item.addEventListener('click', () => {
      const clientIDCell = document.getElementById(client.id);
      clientIDCell.scrollIntoView({ block: 'center', behavior: 'smooth' });
      clientIDCell.parentElement.classList.add('hinted');
      setTimeout(() => {
        clientIDCell.parentElement.classList.remove('hinted');
      }, 3000);
    });

    mount(item, idSpan);
    mount(searchResultsList, item);
  });
  let counter = 0;
  document.addEventListener('keydown', (e) => {
    let searchResults = Array.from(document.querySelectorAll('.search-results__item'));
    if (e.keyCode == 40 && counter !== searchResults.length - 1) {
      e.preventDefault();
      counter = counter + 1;
      searchResults[counter].focus();
    }
    if (e.keyCode == 38 && counter !== 0) {
      e.preventDefault();
      counter = counter - 1;
      searchResults[counter].focus();
    }
    if (e.keyCode === 13 && !document.querySelector('.search-results__wrapper').className.includes('visually-hidden')) {
      searchResults[counter].click();
    }
  });
}

function processDate(date) {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1 < 10 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
  const day = time.getDate() < 10 ? `0${time.getDate()}` : time.getDate();
  const hours = time.getHours() < 10 ? `0${time.getHours()}` : time.getHours();
  const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : time.getMinutes();
  const finalDate = `${day}.${month}.${year}`;
  const finalTime = `${hours}:${minutes}`;
  return { finalDate, finalTime };
}

export function renderClientPage(client) {
  const section = document.querySelector('.section-clients');
  section.innerHTML = '';
  const searchBox = document.getElementById('header__search-box');
  searchBox.disabled = true;
  searchBox.value = `${client.surname} ${client.name} ${client.lastName}`;
  const listOfClientProperties = el('ul');
  setAttr(listOfClientProperties, { class: 'client-page__properties-list' });
  const contacts = el('li', 'Контакты: ');
  setAttr(contacts, { class: 'client-page__contacts' });
  const contactsList = el('ul');
  client.contacts.forEach(contact => {
    const contactValue = el('li', `${contact.type}: ${contact.value}`);
    mount(contactsList, contactValue);
  });

  const id = el('li', `ID: ${client.id}`);
  const dateOfCreation = processDate(client.createdAt);
  const dateOfUpdate = processDate(client.updatedAt);
  const createdAt = el('li', `Дата создания: ${dateOfCreation.finalDate}, ${dateOfCreation.finalTime}`);
  const updatedAt = el('li', `Дата последнего изменения: ${dateOfUpdate.finalDate}, ${dateOfUpdate.finalTime}`);

  const backToMainPage = el('a');
  backToMainPage.textContent = 'Вернуться к таблице';
  setAttr(backToMainPage, { class: 'client-page__back-to-main', href: '#' });
  backToMainPage.addEventListener('click', () => {
    window.history.pushState(null, '', '/');
  });

  mount(listOfClientProperties, id);
  mount(contacts, contactsList);
  mount(listOfClientProperties, contacts);
  mount(listOfClientProperties, createdAt);
  mount(listOfClientProperties, updatedAt);
  mount(section, listOfClientProperties);
  mount(section, backToMainPage);
}
