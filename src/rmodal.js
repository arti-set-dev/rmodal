export default class Rmodal {
  constructor(selector, options) {
    let defaultOptions = {
      isOpen: () => { },
      isClose: () => { },
    };

    this.options = Object.assign(defaultOptions, options);
    this.modal = document.querySelector(selector);

    if (this.modal) {
      this.body = document.body;
      this.currModalWindow = false;
      this.modalOpened = false;
      this.currModalWindow = false;
      this.previusFocusElement = false;
      this.modalActive = false;
      this.focusElements = [
        'a[href]',
        'input',
        'button',
        'select',
        'textarea',
        '[tabindex]'
      ]
    }

    this.events();
  }

  events() {
    document.addEventListener('click', (e) => {
      if (this.modal) {
        const btnOpenModal = e.target.closest('[data-openmodal]');
        if (btnOpenModal) {
          this.options.speed = e.target.dataset.speed;
          const getDataBtn = e.target.dataset.openmodal;
          this.currModalWindow = this.modal.querySelector(`[data-modal="${getDataBtn}"]`);
          // функция срабатывает один раз в определённое время, равное времени анимации
          if (new Date().getTime() - this.lastClick < this.options.speed) return;
          this.lastClick = new Date().getTime();
          // модальное окно открывается
          this.openModal(this.currModalWindow);
        }
        const btnCloseModal = e.target.closest('.close-btn');
        if (e.target == this.modal || btnCloseModal) {
          // модальное окно закрывается
          if (new Date().getTime() - this.lastClick < this.options.speed) return;
          this.lastClick = new Date().getTime();
          this.closeModal(this.currModalWindow);
        }
      }
    })

    document.addEventListener('keydown', (e) => {
      if (this.modal) {
        if (e.keyCode == 27) {
          // модальное окно закрывается по клавише "esc"
          if (new Date().getTime() - this.lastClick < this.options.speed) return;
          this.lastClick = new Date().getTime();
          this.closeModal(this.currModalWindow);
        }
        if (e.keyCode == 9) {
          // если модальное окно открыто, то tabindex работает только внутри модального окна
          this.tabIndexInModal(e);
        }
      }
    })
  }

  openModal(modalWindowElem) {
    if (!this.modalOpened) {
      this.tabIndexOff();
      this.blockScroll();
      this.modal.style.setProperty('--transition-time', `${this.options.speed / 1000}s`);
      this.modal.classList.add('show');
      modalWindowElem.classList.add('in-block');
      setTimeout(() => {
        modalWindowElem.classList.add('show');
      });
      this.previusFocusElement = document.activeElement;
      setTimeout(() => {
        this.modalOpened = true;
        // console.log('modalOpened', modalOpened)
        this.focusInModal();
        this.tabIndexOn();
      }, this.options.speed);
    }
    this.modalActive = this.modal.querySelector('.in-block.show');
    if (this.modalOpened && this.modalActive) {
      this.reOpenModal(modalWindowElem);
    }
  }

  reOpenModal(modalWindowElem) {
    this.modalOpened = false;
    // console.log('modalOpened', modalOpened)
    setTimeout(() => {
      this.modalActive.classList.remove('in-block');
      this.modalOpened = true;
      // console.log('modalOpened', modalOpened)
    }, this.options.speed);
    this.modalActive.classList.remove('show');
    if (!this.modalOpened) {
      modalWindowElem.style.position = 'absolute';
      modalWindowElem.classList.add('in-block');
      setTimeout(() => {
        modalWindowElem.removeAttribute('style');
        modalWindowElem.classList.add('show');
        setTimeout(() => {
          this.focusInModal();
        }, this.options.speed);
      }, this.options.speed);
    }
  }

  closeModal(modalWindowElem) {
    if (this.modalOpened) {
      this.modal.classList.remove('show');
      setTimeout(() => {
        modalWindowElem.classList.remove('in-block');
      }, this.options.speed);
      modalWindowElem.classList.remove('show');
      this.modalOpened = false;
      // console.log('modalOpened', modalOpened)
      this.focusInModal();
      setTimeout(() => {
        this.unlockScoll();
      }, this.options.speed);
    }
  }

  focusInModal() {
    // по открытию модального окна фокус перемещается на первый фокусируемый элемент модального окна
    if (this.modalOpened) {
      const focusToModal = this.currModalWindow.querySelectorAll(this.focusElements);
      focusToModal[0].focus();
    } else {
      setTimeout(() => {
        // если окно закрыто, то фокус перемешается на предыдущий фокусируемый элемент (на кнопку открытия модального окна)
        this.previusFocusElement.focus();
      }, this.options.speed);
    }
  }

  tabIndexOff() {
    // во аремя анимации появления модального окна отключается возможность управлять страцницей клавишей "Tab"
    const focusDocumentElements = document.querySelectorAll(this.focusElements);
    focusDocumentElements.forEach((focusEl) => {
      focusEl.tabIndex = -1;
    })
  }

  tabIndexOn() {
    // когда модальное окно открыто - tabindex включается
    const focusDocumentElements = document.querySelectorAll(this.focusElements);
    focusDocumentElements.forEach((focusEl) => {
      focusEl.removeAttribute('tabIndex');
    })
  }

  tabIndexInModal(e) {
    if (this.modalOpened) {
      // если модальное окно открыто, то tabindex работает только внутри модального окна
      const focusToModal = this.currModalWindow.querySelectorAll(this.focusElements);
      const focusArray = Array.prototype.slice.call(focusToModal);
      const focusedIndex = focusArray.indexOf(document.activeElement);
      if (e.shiftKey && focusedIndex === 0) {
        focusArray[focusArray.length - 1].focus();
        e.preventDefault();
      }
      if (!e.shiftKey && focusedIndex === focusArray.length - 1) {
        focusArray[0].focus();
        e.preventDefault();
      }
    }
  }

  blockScroll() {
    let scrollWidth = window.innerWidth - this.body.offsetWidth + 'px';
    this.body.style.paddingRight = scrollWidth;
    // хак для айфонов, чтобы работал "overflow hidden" и не было прыжка страницы
    let pagePosition = window.scrollY;
    this.body.classList.add('block-scroll');
    this.body.dataset.position = pagePosition;
    this.body.style.top = -pagePosition + 'px';
  }

  unlockScoll() {
    this.body.classList.remove('dis-scroll');
    this.body.removeAttribute('style');
    // хак для айфонов, чтобы работал "overflow hidden" и не было прыжка страницы
    let pagePosition = parseInt(this.body.dataset.position, 10);
    window.scroll({ top: pagePosition, left: 0 });
    this.body.removeAttribute('data-position');
  }
}
