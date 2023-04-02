import { el, mount, setAttr } from 'redom';
import Choices from 'choices.js';
import IMask from 'imask';
import validator from 'validator';

export class ClientModal {
  constructor() {
    this.counter = 0;
    this.errors = [];
  }

  createSaveButton() {
    this.saveButton = el('button');
    this.saveButton.textContent = 'Сохранить';
    const span = el('span');
    setAttr(span, { class: 'save-btn-span' });
    mount(this.saveButton, span);
    setAttr(this.saveButton, { class: 'modal-window__save-btn', type: 'submit' });
    return this.saveButton;
  }

  createCancelButton() {
    this.cancelButton = el('button');
    this.cancelButton.textContent = 'Отмена';
    setAttr(this.cancelButton, { class: 'modal-window__cancel-btn', type: 'button' });
    this.cancelButton.addEventListener('click', () => { this.modalWrapper.remove(); });
    return this.cancelButton;
  }

  createCloseButton() {
    this.closeButton = el('button');
    this.closeButton.innerHTML = '<svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M22.2333 7.73333L21.2666 6.76666L14.4999 13.5334L7.73324 6.7667L6.76658 7.73336L13.5332 14.5L6.7666 21.2667L7.73327 22.2333L14.4999 15.4667L21.2666 22.2334L22.2332 21.2667L15.4666 14.5L22.2333 7.73333Z" fill="#B0B0B0"/></svg>';
    setAttr(this.closeButton, { class: 'modal__close-btn', type: 'button' });
    this.closeButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.modalWrapper.remove();
    });
    return this.closeButton;
  }

  createDeleteContactFieldButton() {
    const deleteContactbutton = el('button');
    deleteContactbutton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z" fill="#B0B0B0"/></svg>';
    setAttr(deleteContactbutton, { class: 'modal-window__delete-contact-btn', type: 'button' });
    deleteContactbutton.addEventListener('click', (e) => {
      e.preventDefault();
      const contact = deleteContactbutton.parentElement;
      const contacts = Array.from(document.querySelectorAll('.modal-window__contact-field-wrapper'));
      const indexOfContact = contacts.findIndex(i => i === contact);
      contacts[indexOfContact].remove();
      this.counter--;
      this.counter <= 0 ? this.contactsSecondaryWrapper.classList.add('no-padding') : false;
      console.log(this.counter);
      if (this.counter <= 10) {
        const container = document.querySelector('.modal-window__add-contact-wrapper');
        mount(container, this.addContactButton);
        console.log(this.counter);
      }
      const indexOfError = this.errors.findIndex(err => {
        return err.includes('Email') ? err.includes('Email') : err.includes('Телефон');
      });
      indexOfError !== -1 ? this.errors.splice(indexOfError, 1) : false;

    });
    return deleteContactbutton;
  }

  createContactField() {
    const oneContactFieldWrapper = el('div');
    setAttr(oneContactFieldWrapper, { class: 'modal-window__contact-field-wrapper' });
    const selectOfContacts = el('select');
    setAttr(selectOfContacts, { class: 'modal-window__select', name: 'select' });
    const optionVk = el('option', 'Vk');
    const optionFacebook = el('option', 'Facebook');
    const optionEmail = el('option', 'Email');
    const optionPhone = el('option', 'Телефон');
    const optionElse = el('option', 'Другое');
    const inputWithContact = el('input');
    setAttr(optionVk, { class: 'choices__item', value: 'Vk' });
    setAttr(optionFacebook, { class: 'choices__item', value: 'Facebook' });
    setAttr(optionEmail, { class: 'choices__item', value: 'Email' });
    setAttr(optionPhone, { class: 'choices__item', value: 'Телефон' });
    setAttr(optionElse, { class: 'choices__item', value: 'Другое' });
    setAttr(inputWithContact, { class: 'modal-window__contact-input', placeholder: 'Введите данные контакта' });
    const container = document.querySelector('.modal-window__add-contact-wrapper_secondary');
    const deleteContactButton = this.createDeleteContactFieldButton();
    mount(container, oneContactFieldWrapper);
    mount(oneContactFieldWrapper, selectOfContacts);
    mount(selectOfContacts, optionVk);
    mount(selectOfContacts, optionFacebook);
    mount(selectOfContacts, optionEmail);
    mount(selectOfContacts, optionPhone);
    mount(selectOfContacts, optionElse);
    mount(oneContactFieldWrapper, inputWithContact);
    mount(oneContactFieldWrapper, deleteContactButton);
    this.initializeChoicesJS(selectOfContacts);
    inputWithContact.addEventListener('click', (e) => {
      e.preventDefault();
      new IMask(inputWithContact, {
        mask: [
          {
            mask: '+0 (000) 000-00-00[0000000000000000]'
          },
          {
            mask: /(.*?)/
          }
        ],
      });
    });

    return { selectOfContacts, container, inputWithContact, oneContactFieldWrapper, optionVk, optionFacebook, optionEmail, optionPhone, optionElse };
  }

  initializeChoicesJS(element) {
    new Choices(element, {
      searchEnabled: false,
      itemSelectText: '',
      searchChoices: false,
      allowHTML: true
    });
  }

  createAddContactButton() {
    const contactsPrimaryWrapper = el('div');
    setAttr(contactsPrimaryWrapper, { class: 'modal-window__add-contact-wrapper' });
    this.contactsSecondaryWrapper = el('div');
    setAttr(this.contactsSecondaryWrapper, { class: 'modal-window__add-contact-wrapper_secondary' });
    this.addContactButton = el('button');
    const addContactTextWrapper = el('span');
    addContactTextWrapper.textContent = 'Добавить контакт';
    setAttr(addContactTextWrapper, { class: 'center-span' });
    mount(this.addContactButton, addContactTextWrapper);
    setAttr(this.addContactButton, { class: 'modal-window__add-contact-btn', type: 'button' });
    mount(contactsPrimaryWrapper, this.contactsSecondaryWrapper);
    mount(contactsPrimaryWrapper, this.addContactButton);
    this.addContactButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.counter++;
      if (this.counter >= 10) {
        this.addContactButton.remove();
        const contactField = this.createContactField();
        this.initializeChoicesJS(contactField.selectOfContacts);
        setAttr(contactField.container, { class: 'modal-window__add-contact-wrapper_secondary' });

        console.log(this.counter);
        return;
      }
      const contactField = this.createContactField();
      this.initializeChoicesJS(contactField.selectOfContacts);
      setAttr(contactField.container, { class: 'padding-for-contact-field modal-window__add-contact-wrapper_secondary' });
      console.log(this.counter);
    });
    return contactsPrimaryWrapper;
  }

  createWrapper() {
    this.modalWrapper = el('div');
    setAttr(this.modalWrapper, { class: 'modal-wrapper' });
    this.modalWrapper.addEventListener('click', (e) => {
      try {
        /* ловлю ошибку при нажатии на крестик,
        ошибка возникает из-за отсутствия класса у SVG-элемента,
        так как проверка включает наличие класса у элемента.
        Модальное окно все равно закрывается, так как
        на кнопке закрытия висит обработчик события 'click' */
        if (e.target.className.includes('modal-wrapper'))
          this.modalWrapper.remove();


      } catch { console.log('Модальное окно закрылось'); }
    });
    return this.modalWrapper;
  }

  createForm() {
    const form = el('form');
    setAttr(form, { class: 'modal-window-common', id: 'form1' });
    /*  validateForm(form); */
    return form;
  }

  createTitle(name) {
    const title = el('h2', name);
    setAttr(title, { class: 'modal-window-common__title' });
    return title;
  }

  showClientID(clientID) {
    const id = el('span', `ID: ${clientID}`);
    setAttr(id, { class: 'modal__id' });
    return id;
  }

  createInputs() {
    this.inputName = el('input');
    setAttr(this.inputName, { class: 'modal-window__input', placeholder: 'Имя*', type: 'text' });
    const inputName = this.inputName;

    this.inputSurname = el('input');
    setAttr(this.inputSurname, { class: 'modal-window__input', placeholder: 'Фамилия*', type: 'text' });
    const inputSurname = this.inputSurname;

    this.inputPatronymic = el('input');
    setAttr(this.inputPatronymic, { class: 'modal-window__input', placeholder: 'Отчество', type: 'text' });
    const inputPatronymic = this.inputPatronymic;

    return { inputName, inputSurname, inputPatronymic };
  }

  createErrorsField() {
    this.errorsField = el('ul');
    setAttr(this.errorsField, { class: 'modal-window__errors-field visually-hidden' });
    return this.errorsField;
  }

  createDeleteClientButton() {
    const deleteButton = el('button');
    deleteButton.textContent = 'Удалить клиента';
    setAttr(deleteButton, { class: 'modal-window__cancel-btn' });
    return deleteButton;
  }

  isFormValid() {
    this.contacts = Array.from(document.querySelectorAll('.modal-window__contact-input')) || [];
    this.inputs = [this.inputName, this.inputSurname, ...this.contacts];
    const messageOnEmptyInput = 'Выделенные поля обязательны к заполнению';
    this.inputs.forEach(input => {
      if (!input.value.trim() && !this.errors.includes(messageOnEmptyInput)) {
        this.errors.push(messageOnEmptyInput);
      }
    });

    if (this.inputs.every(input => input.value.trim()) && this.errors.includes(messageOnEmptyInput)) {
      const indexOfMessageOfEmptyInput = this.errors.findIndex(err => err === messageOnEmptyInput);
      this.errors.splice(indexOfMessageOfEmptyInput, 1);
    }

    this.contacts.forEach(contact => {
      const parentOfInput = contact.parentElement;
      const option = parentOfInput.children[0].children[0].children[0].children[0];
      console.log(option);
      const messageOnIncorrectContact = `Введите корректный ${option.value}`;
      const contactString = contact.value.trim();
      const phoneNumber = contactString.replace(/\D/g, '');
      switch (option.value) {
        case 'Email': {
          if (contact.value.trim() && !validator.isEmail(contact.value.trim()) && !this.errors.includes(messageOnIncorrectContact)) {
            this.errors.push(messageOnIncorrectContact);
          }
          /* условие ниже можно было по идее опустить, если идти от условия выше (от противного) */
          if (validator.isEmail(contact.value.trim()) && this.errors.includes(messageOnIncorrectContact)) {
            const indexOfIncorrectContact = this.errors.findIndex(err => err === messageOnIncorrectContact);
            this.errors.splice(indexOfIncorrectContact, 1);
          }
          break;
        }
        case 'Телефон': {
          if (contact.value.trim() && !validator.isMobilePhone(phoneNumber) && !this.errors.includes(messageOnIncorrectContact)) {
            this.errors.push(messageOnIncorrectContact);

          }
          if (validator.isMobilePhone(phoneNumber) && this.errors.includes(messageOnIncorrectContact)) {
            const indexOfIncorrectContact = this.errors.findIndex(err => err === messageOnIncorrectContact);
            this.errors.splice(indexOfIncorrectContact, 1);
            console.log(messageOnIncorrectContact);
          }
          break;
        }
      }
    });
    return !this.errors.length ? true : false;
  }
}
