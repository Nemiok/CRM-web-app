import '../node_modules/choices.js/public/assets/styles/choices.min.css';
import 'tippy.js/dist/tippy.css';
import './assets/styles/styles.css';
import {
  getClients,
  createClientInDB,
  deleteClientFromDB,
  editClientInDB
} from './api.js';
import {
  createClientInTable,
  showOnEmptyClients,
  showOnExistingClients,
  createAddClientModal,
  createDeleteModal,
  createEditModal,
  createSearchResult,
  renderClientPage
} from './dom.js';
import { el, mount, setAttr } from 'redom';

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function validateAndReturnValidClient(modalWindow) {
  const clientModal = modalWindow.clientModal;

  clientModal.isFormValid();
  const errorsField = modalWindow.errorsField;

  if (clientModal.errors.length) {
    clientModal.inputs.forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('modal-window__incorrect-input');
      }
      input.addEventListener('input', () => {
        if (input.value.trim()) {
          input.classList.remove('modal-window__incorrect-input');
        }
      });
    });

    clientModal.contacts.forEach(contact => {
      if (!contact.value.trim()) {
        contact.classList.add('modal-window__incorrect-contact');
      }
      contact.addEventListener('input', () => {
        if (contact.value.trim()) {
          contact.classList.remove('modal-window__incorrect-contact');
        }
      });
    });

    errorsField.innerHTML = '';
    errorsField.classList.remove('visually-hidden');
    clientModal.errors.forEach(error => {
      const errorElement = el('li', error);
      setAttr(errorElement, { class: 'modal-window__error-message' });
      errorsField.append(errorElement);
    });
    return;
  }
  /* тут код выполнится только если массив ошибок пустой */
  const client = {
    name: clientModal.inputName.value.trim(),
    surname: clientModal.inputSurname.value.trim(),
    lastName: clientModal.inputPatronymic ? clientModal.inputPatronymic.value.trim() : '',
    contacts: [],
  };
  clientModal.contacts.forEach(contact => {
    const parentOfInput = contact.parentElement;
    const option = parentOfInput.children[0].children[0].children[0].children[0];
    client.contacts.push({
      type: option.value,
      value: contact.value.trim()
    });
  });
  return client || false;
}

function handleOnDeleteClient(clientID, modalWindow) {
  deleteClientFromDB(clientID);
  modalWindow.modalWrapper.remove();
  const arrayOfClientsID = Array.from(document.querySelectorAll('.table__id-cell '));
  const indexOfClient = arrayOfClientsID.findIndex(id => id.textContent === clientID);
  const arrayOfClientsRow = Array.from(document.querySelectorAll('.table__row'));
  arrayOfClientsRow[indexOfClient].remove();
}

async function handleOnEditClient(clientInTable) {
  const clients = await getClients();
  wait(1000).then(async () => {
    document.querySelector('.edit-btn-loader').classList.remove('edit-btn-loader');
    document.querySelector('.edit-btn_clicked').classList.remove('edit-btn_clicked');
    const indexOfClient = clients.findIndex(client => client.id === clientInTable.id.textContent);
    const client = clients[indexOfClient];
    const editClientModal = createEditModal('Изменить данные', client);
    const clientModal = editClientModal.clientModal;
    editClientModal.form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const validClient = validateAndReturnValidClient(editClientModal);
      if (validClient) {
        await editClientInDB(clientInTable.id.textContent, validClient);
        const clients = await getClients();
        const saveButtonSpan = document.querySelector('.save-btn-span');
        saveButtonSpan.classList.add('save-btn-loader');
        const saveButton = document.querySelector('.modal-window__save-btn');
        saveButton.disabled = true;
        editClientModal.form.querySelectorAll('input').forEach(input => {
          input.disabled = true;
        });
        wait(1000).then(() => {
          document.querySelector('.save-btn-loader').classList.remove('save-btn-loader');
          console.log(clients);
          document.querySelector('tbody').innerHTML = '';
          clients.forEach(client => {
            const editedClientInTable = createClientInTable(client);
            editedClientInTable.deleteCard.addEventListener('click', (e) => {
              e.preventDefault();
              /* ниже прослушиватель клика на кнопку "удалить" вложен в другой прослушиватель, это приемлемо?
              возможно стоило добавить обработчик нажатия на кнопку "удалить" модального окна
              непосредственно при его создании, то есть в файле dom.js,
              однако обработчик включает взаимодействие с базой данных, поэтому решил не писать там */
              const deleteClientModal = createDeleteModal('Удалить клиента');
              deleteClientModal.deleteButton.addEventListener('click', (e) => {
                e.preventDefault();
                handleOnDeleteClient(client.id, deleteClientModal);
              });
            });
            editedClientInTable.editCard.addEventListener('click', async (e) => {
              e.preventDefault();
              await handleOnEditClient(editedClientInTable);
            });
          });
          editClientModal.modalWrapper.remove();
        });
      }
    });

    editClientModal.deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      const deleteClientModal = createDeleteModal('Удалить клиента');
      deleteClientModal.deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        handleOnDeleteClient(clientInTable.id.textContent, deleteClientModal);
        editClientModal.modalWrapper.remove();
      });
    });

    client.contacts.forEach(contact => {
      const contactField = clientModal.createContactField();
      mount(contactField.container, contactField.oneContactFieldWrapper);
      contactField.container.classList.add('padding-for-contact-field');
      clientModal.counter++;
      clientModal.counter >= 10 && clientModal.addContactButton ? clientModal.addContactButton.remove() : false;
      const choicesSelectWrapper = contactField.selectOfContacts.parentElement;
      const optionItem = choicesSelectWrapper.querySelector('.choices__item');
      contactField.selectOfContacts.children[0].value = contact.type;
      contactField.selectOfContacts.children[0].textContent = contact.type;
      optionItem.textContent = contact.type;
      contactField.inputWithContact.value = contact.value;
    });
  });

}

function createAddClientForm() {
  const clientModalWindow = createAddClientModal('Новый клиент');
  const form = clientModalWindow.form;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const validClient = validateAndReturnValidClient(clientModalWindow);
    if (validClient) {
      document.querySelector('.save-btn-span').classList.add('save-btn-loader');
      if (!document.querySelector('.clients__table-body')) {
        const body = document.querySelector('body');
        body.innerHTML = '';
        const mainPage = showOnExistingClients();
        const addClientButton = mainPage.addClientButton;
        addClientButton.addEventListener('click', () => {
          createAddClientForm();
        });
      }
      /* ниже я отправляю два запроса на сервер при добавлении нового клиента.
      Первый раз, чтобы запостить клиента, а второй - чтобы получить его id и дату
      создания и изменения */
      /* беру последнего клиента, чтобы отрендерить его без перезагрузки страницы */
      await createClientInDB(validClient);
      const clients = await getClients();
      const lastClient = clients[clients.length - 1];
      clientModalWindow.modalWrapper.remove();
      createFinalClientInTable(lastClient);
      /*    }); */
    }
  });
}

async function createFinalClientInTable(client) {
  const clientInTable = createClientInTable(client);
  clientInTable.deleteCard.addEventListener('click', (e) => {
    e.preventDefault();
    const deleteClientModal = createDeleteModal('Удалить клиента');

    deleteClientModal.deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      handleOnDeleteClient(client.id, deleteClientModal);
    });
  });

  clientInTable.editCard.addEventListener('click', async (e) => {
    e.preventDefault();
    await handleOnEditClient(clientInTable);
  });
}

let flag = true;
async function compareClientsAndRenderTable(target) {
  const clients = await getClients();
  let copyArray = clients.slice();
  switch (target.textContent) {
    case 'ID': {
      if (flag) {
        copyArray.sort((a, b) => {
          return Number(b.id) - Number(a.id);
        });
        flag = false;
        console.log(copyArray);
      }
      else {
        copyArray.sort((a, b) => {
          return Number(a.id) - Number(b.id);
        });
        console.log(copyArray);
        flag = true;
      }
      /* render table */
      document.querySelector('tbody').innerHTML = '';
      copyArray.forEach(client => {
        createFinalClientInTable(client);
      });
      break;
    }

    case 'Дата и время создания': {
      if (flag) {
        copyArray.sort((a, b) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        flag = false;
        console.log(copyArray);
      }
      else {
        copyArray.sort((a, b) => {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        });
        console.log(copyArray);
        flag = true;
      }
      document.querySelector('tbody').innerHTML = '';
      copyArray.forEach(client => {
        createFinalClientInTable(client);
      });
      break;
    }

    case 'Последние изменения': {
      if (flag) {
        copyArray.sort((a, b) => {
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        flag = false;
        console.log(copyArray);
      }
      else {
        copyArray.sort((a, b) => {
          return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        });
        console.log(copyArray);
        flag = true;
      }
      document.querySelector('tbody').innerHTML = '';
      copyArray.forEach(client => {
        createFinalClientInTable(client);
      });
      break;
    }

    case 'Фамилия Имя Отчество': {
      if (flag) {
        copyArray.sort((a, b) => {
          let x = `${a.surname.toLowerCase()}${a.name.toLowerCase()}${a.lastName.toLowerCase()}`;
          let y = `${b.surname.toLowerCase()}${b.name.toLowerCase()}${b.lastName.toLowerCase()}`;
          return x.localeCompare(y);
        });
        flag = false;
        console.log(copyArray);
      }
      else {
        copyArray.sort((a, b) => {
          let x = `${a.surname.toLowerCase()}${a.name.toLowerCase()}${a.lastName.toLowerCase()}`;
          let y = `${b.surname.toLowerCase()}${b.name.toLowerCase()}${b.lastName.toLowerCase()}`;
          return y.localeCompare(x);
        });
        console.log(copyArray);
        flag = true;
      }
      document.querySelector('tbody').innerHTML = '';
      copyArray.forEach(client => {
        createFinalClientInTable(client);
      });
      break;
    }
  }
}

async function createApp(clientsList) {
  const url = new URL(window.location.href);
  const hash = url.hash;
  if (hash) {
    const id = hash.replace(/\D/g, '');
    const client = await getClients(id);
    showOnExistingClients();
    renderClientPage(client);
    return;
  }

  if (!clientsList.length) {
    showOnEmptyClients();
    const addClientButton = document.querySelector('.add-client-btn');
    addClientButton.addEventListener('click', () => {
      createAddClientForm();
    });
    return;
  }
  /* код ниже выполнится только если список клиентов не пустой */
  const mainPage = showOnExistingClients();
  const addClientButton = mainPage.addClientButton;
  addClientButton.addEventListener('click', () => {
    createAddClientForm();
  });
  clientsList.forEach(client => {
    createFinalClientInTable(client);
  });

  mainPage.tableHeadingID.addEventListener('click', async () => {
    compareClientsAndRenderTable(mainPage.tableHeadingID);
  });

  mainPage.tableHeadingDate.addEventListener('click', async () => {
    compareClientsAndRenderTable(mainPage.tableHeadingDate);
  });

  mainPage.tableHeadingChange.addEventListener('click', async () => {
    compareClientsAndRenderTable(mainPage.tableHeadingChange);
  });

  mainPage.tableHeadingName.addEventListener('click', async () => {
    compareClientsAndRenderTable(mainPage.tableHeadingName);
  });

  /* ниже реализован поиск с автодополнением */
  let timeout;
  function timeoutAndRenderSearchResults(searchBox) {
    clearTimeout(timeout);
    timeout = setTimeout(findAndRender, 600);

    async function findAndRender() {
      const searchResultsWrapper = document.querySelector('.search-results__wrapper');
      searchResultsWrapper.classList.remove('visually-hidden');
      const inputValueTrimmed = searchBox.value.trim();
      const inputValue = inputValueTrimmed.toLowerCase().split(' ').join('');
      const clients = await getClients();
      const filteredArray = clients.filter(client => {
        const fullname = client.surname.toLowerCase() + client.name.toLowerCase() + client.lastName.toLowerCase();
        return fullname.includes(inputValue);
      });
      return filteredArray.length === 0 ? searchResultsWrapper.classList.add('visually-hidden') : createSearchResult(filteredArray);
    }
  }

  const searchBox = document.getElementById('header__search-box');
  searchBox.addEventListener('input', function () {
    const searchResultsWrapper = document.querySelector('.search-results__wrapper');
    searchBox.value.trim() === '' ? searchBox.value = '' && searchResultsWrapper.classList.add('visually-hidden') : false;

    document.addEventListener('click', (e) => {
      if (!e.target.className.includes('search')) {
        searchBox.value = '';
        searchResultsWrapper.classList.add('visually-hidden');
      }
      if (e.target.className.includes('search') && e.target instanceof HTMLLIElement) {
        searchBox.value = '';
        searchResultsWrapper.classList.add('visually-hidden');
      }
    });

    timeoutAndRenderSearchResults(searchBox);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  wait(1500)
    .then(() => {
      return getClients();
    })
    .then((clientsList) => {
      document.querySelector('body').innerHTML = '';
      createApp(clientsList);

    });

  window.addEventListener('hashchange', async () => {
    const clientsList = await getClients();
    createApp(clientsList);
  });
});
