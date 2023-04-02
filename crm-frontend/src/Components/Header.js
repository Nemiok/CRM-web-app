import { el, setAttr, mount } from 'redom';
import logo_320 from '../assets/images/skb-logo-320+.svg';
import logo_1024 from '../assets/images/skb-logo-1024+.svg';

export class Header {
  constructor() {
    this.createHeader();
  }
  createHeader() {
    const body = document.querySelector('body');
    const header = el('header');
    const headerContains = el('div');
    setAttr(headerContains, { class: 'header-container' });
    const picture = el('picture');
    setAttr(picture, { class: 'skb-logo' });
    const pictureSource = el('source');
    setAttr(pictureSource, { media: '(max-width: 1920px)', srcset: logo_1024 });
    const pictureSourceSecond = el('source');
    setAttr(pictureSourceSecond, { media: '(max-width: 767px)', srcset: logo_320 });
    const pictureImg = el('img');
    setAttr(pictureImg, { src: logo_320, alt: 'skb-logo' });

    const searchWrapper = el('div');
    setAttr(searchWrapper, { class: 'header__search-wrapper' });
    const searchBox = el('input');
    setAttr(searchBox, { type: 'text', name: 'search-for-students', id: 'header__search-box', placeholder: 'Введите запрос', class: 'search' });
    const searchResults = this.createSearchResults();

    mount(body, header);
    mount(header, headerContains);
    mount(headerContains, picture);
    mount(picture, pictureSource);
    mount(picture, pictureSourceSecond);
    mount(picture, pictureImg);
    mount(searchWrapper, searchBox);
    mount(searchWrapper, searchResults);
    mount(headerContains, searchWrapper);
  }

  createSearchResults() {
    const wrapper = el('div');
    setAttr(wrapper, { class: 'search-results__wrapper visually-hidden search' });
    const listOfResults = el('ul');
    setAttr(listOfResults, { class: 'search-results__list search' });
    listOfResults.setAttribute('data-simplebar', true);
    mount(wrapper, listOfResults);
    return wrapper;
  }
}
