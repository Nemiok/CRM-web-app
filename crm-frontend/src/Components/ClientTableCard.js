import { el, setAttr, mount } from 'redom';
import vkSVG from '../assets/images/vk.svg';
import facebookSVG from '../assets/images/facebook.svg';
import phoneSVG from '../assets/images/phone.svg';
import mailSVG from '../assets/images/mail.svg';
import anotherContactSVG from '../assets/images/another-contact.svg';
import tippy from 'tippy.js';
import { getClients } from '../api';
import { renderClientPage } from '../dom';

export class ClientTableCard {
  constructor(client) {
    this.name = client.name;
    this.surname = client.surname;
    this.fullname = client.lastName !== '' ? `${client.surname} ${client.name} ${client.lastName}` : `${client.surname} ${client.name}`;
    this.id = client.id;
    this.contacts = client.contacts;
    this.createdAt = client.createdAt;
    this.updatedAt = client.updatedAt;
  }

  createTableRow() {
    const row = el('tr');
    setAttr(row, { class: 'table__row' });
    return row;
  }

  createIDCell() {
    const id = el('td');
    id.textContent = this.id;
    setAttr(id, { class: 'table__id-cell table__cell', id: this.id });
    this.initializeTippyJSForClientID(id, this.id);
    id.addEventListener('click', async () => {
      window.history.pushState(null, '', `/#id=${this.id}`);
      const url = new URL(window.location.href);
      const hash = url.hash;
      const id = hash.replace(/\D/g, '');
      const client = await getClients(id);
      renderClientPage(client);
    });
    return id;
  }

  createFullnameCell() {
    const fullname = el('td');
    fullname.textContent = this.fullname;
    setAttr(fullname, { class: 'table__fullname-cell table__cell' });
    return fullname;
  }

  processDate(date) {
    const createdAt = el('td');
    const creationTime = new Date(date);
    const year = creationTime.getFullYear();
    const month = creationTime.getMonth() + 1 < 10 ? `0${creationTime.getMonth() + 1}` : creationTime.getMonth() + 1;
    const day = creationTime.getDate() < 10 ? `0${creationTime.getDate()}` : creationTime.getDate();
    const hours = creationTime.getHours() < 10 ? `0${creationTime.getHours()}` : creationTime.getHours();
    const minutes = creationTime.getMinutes() < 10 ? `0${creationTime.getMinutes()}` : creationTime.getMinutes();
    const finalDate = `${day}.${month}.${year}`;
    const finalTime = `${hours}:${minutes}`;

    const spanForDate = el('span');
    spanForDate.textContent = finalDate;

    const spanForTime = el('span');
    spanForTime.textContent = finalTime;
    setAttr(spanForTime, { class: 'time-in-table' });

    mount(createdAt, spanForDate);
    mount(createdAt, spanForTime);
    setAttr(createdAt, { class: 'table__time-cell table__cell' });
    return createdAt;
  }

  createCreatiionTimeCell() {
    return this.processDate(this.createdAt);
  }

  createUpdatedTimeCell() {
    return this.processDate(this.updatedAt);
  }

  createContactLink(contactLogo, type) {
    const a = el('a');
    setAttr(a, { data: type });
    const img = el('img');
    setAttr(img, { src: contactLogo });
    mount(a, img);
    return a;
  }

  initializeTippyJSForClientID(element, id) {
    const location = window.location.href;
    const href = `${location}/#id=${id}`;
    tippy(element, {
      content: '<a href="' + href + '"><span class="colored-link">' + href + '</span></a>',
      allowHTML: true,
      interactive: true,
    });
  }

  initializeTippyJSForContacts(element, type) {
    /* ссылки в тултипах некрасиво выглядят, мне кажется они должны быть без localhost в начале */
    const href = element.href;
    tippy(element, {
      content: `${type}: ` + '<a href="' + href + '"><span class="colored-link">' + href + '</span></a>',
      allowHTML: true,
      interactive: true,
    });
  }

  handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index) {
    if (!firstContainer.querySelector('.show-more-contacts')) {
      const showMoreContacts = el('button');
      setAttr(showMoreContacts, { class: 'show-more-contacts' });
      showMoreContacts.textContent = `+${arrayOfContacts.length - index}`;
      showMoreContacts.addEventListener('click', (e) => {
        e.preventDefault();
        secondContainer.classList.remove('visually-hidden');
        showMoreContacts.remove();
        secondContainer.children.length >= 1 ? firstContainer.append(secondContainer.children[0]) && secondContainer.children[0].remove() : false;
      });
      mount(firstContainer, showMoreContacts);
    }
  }

  createContactsCell(arrayOfContacts) {
    const contacts = el('td');
    setAttr(contacts, { class: 'table__contacts-cell table__cell' });
    const firstContainer = el('div');
    setAttr(firstContainer, { class: 'contact-icons-container' });
    const secondContainer = el('div');
    setAttr(secondContainer, { class: 'visually-hidden contact-icons-container' });
    mount(contacts, firstContainer);
    mount(contacts, secondContainer);

    arrayOfContacts.forEach((contact, index) => {

      switch (contact.type) {
        case 'Телефон': {
          const link = this.createContactLink(phoneSVG, contact.type);
          const phoneNumber = contact.value.replace(/\D/g, '');
          link.href = phoneNumber;
          this.initializeTippyJSForContacts(link, contact.type);
          index <= 3 ? mount(firstContainer, link) : mount(secondContainer, link) && this.handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index);
          break;
        }
        case 'Email': {
          const link = this.createContactLink(mailSVG, contact.type);
          link.href = contact.value;
          this.initializeTippyJSForContacts(link, contact.type);
          index <= 3 ? mount(firstContainer, link) : mount(secondContainer, link) && this.handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index);
          break;
        }
        case 'Vk': {
          const link = this.createContactLink(vkSVG, contact.type);
          link.href = contact.value;
          this.initializeTippyJSForContacts(link, contact.type);
          index <= 3 ? mount(firstContainer, link) : mount(secondContainer, link) && this.handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index);
          break;
        }
        case 'Facebook': {
          const link = this.createContactLink(facebookSVG, contact.type);
          link.href = contact.value;
          this.initializeTippyJSForContacts(link, contact.type);
          index <= 3 ? mount(firstContainer, link) : mount(secondContainer, link) && this.handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index);
          break;
        }
        default: {
          const link = this.createContactLink(anotherContactSVG);
          link.href = contact.value;
          this.initializeTippyJSForContacts(link, contact.type);
          index <= 3 ? mount(firstContainer, link) : mount(secondContainer, link) && this.handleContactsCounter(firstContainer, secondContainer, arrayOfContacts, index);
          break;
        }
      }
      return;
    });
    return contacts;
  }

  createEditAndDeleteWrapper() {
    const wrapperCell = el('td');
    setAttr(wrapperCell, { class: 'table__actions-cell table__cell' });
    this.editButton = this.createEditCell();
    this.deleteButton = this.createDeleteCell();
    const actionButtonsWrapper = el('div');
    setAttr(actionButtonsWrapper, { class: 'actions-cell__buttons-wrapper' });
    mount(actionButtonsWrapper, this.editButton);
    mount(actionButtonsWrapper, this.deleteButton);
    mount(wrapperCell, actionButtonsWrapper);
    return wrapperCell;
  }

  createEditCell() {
    /* const change = el('div'); */
    const button = el('button');
    const span1 = el('span');
    const span2 = el('span');
    setAttr(span2, { class: 'edit-btn-icon' });
    button.textContent = 'Изменить';
    button.addEventListener('click', () => {
      span2.classList.add('edit-btn_clicked');
      setAttr(span1, { class: 'edit-btn-loader' });
    });
    setAttr(button, { class: 'edit-client-btn' });
    mount(button, span1);
    mount(button, span2);
    /*   mount(change, button); */
    /*  setAttr(change, { class: 'table__change-cell table__cell' }); */
    return button;
  }

  createDeleteCell() {
    /* const deleteCell = el('div'); */
    const button = el('button');
    setAttr(button, { class: 'delete-client-btn' });
    button.textContent = 'Удалить';
    /*    mount(deleteCell, button); */
    /*  setAttr(deleteCell, { class: 'table__delete-cell table__cell' }); */
    return button;
  }

}
