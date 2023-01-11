# rmodal
*modal window plugin*

## Описание плагина
Данный плагин плавно открывает и закрывает модальные окна без потери доступности для пользователей.
Установка и инициализация

Установить плагин можно с npm: npm i set-rmodal

Ссылка на плагин в npm: https://www.npmjs.com/package/set-rmodal?activeTab=readme

### *Перед инициализацией:*

Для работы плагина добавьте следующую HTML разметку со следующими атрибутами:
```html
<div class="modal" data-modal-overlay>
	<div class="modal-window" data-modal-target="first-modal"></div>
	<div class="modal-window" data-modal-target="middle-modal"></div>
	<div class="modal-window" data-modal-target="last-modal"></div>
</div>
```
Для того чтобы открыть модальное окно - задайте кнопке следующий атрибут: `data-modal="modal"` 

Для того чтобы связать кнопку открытия модального окна с самим окном нужно прописать в атрибуте `data-modal` и `data-modal-target` прописать одинаковое значение. Например:
```html
<button type="button" class="btn" data-modal="my-modal">Модальное окно<button>

<div class="modal" data-modal-overlay>
	<div class="modal-window" data-modal-target="my-modal"></div>
</div>
```
После установки для инициализации пропишите следующий код:
```javaScript
const modal = new Rmodal('[data-modal]');
```
## Настройки плагина

**Скорость анимации появления/скрытия модального окна.** Для настройки скорости задайте кнопке атрибут `data-modal-speed` с необходимым вам значением.
```html
<button type="button" class="btn" data-modal="my-modal"data-modal-speed="400">Открыть модальное окно</button>
```
### *Примечание:*
Если не задать атрибут скорости, то задастся скорость по умолчанию (0.3 сек). Данный параметр тоже можно изменить, прописав в настройки плагина `defaultSpeed` с необходимым значением. 

```javaScript
const modal = new Rmodal('[data-modal]', {
  defaultSpeed: 700,
});
```
**Автоматическое переключение фокуса к кнопке "закрыть модальное окно".** Если в модальном окне есть кнопка закрытия этого окна, то по открытию окна, фокус автоматически переключится к данной кнопке. Для этого кнопке необходимо задать атрибут  `data-modal-close` и в настройках плагина задать `autoFocusToCloseBtn` со значением `true`.

```javaScript
const modal = new Rmodal('[data-modal]', {
  autoFocusToCloseBtn: true,
});
```
## "Окно внутри окна"

Если нужно открыть модальное окно из уже открытого модального окна, то в таком случае просто разместите внутри модального окна нужную кнопку с нужными вам значениями:

```html
<div class="modal" data-modal-overlay>
  <div class="modal-window" data-modal-target="first-modal">
  <button type="button" class="btn" data-modal="last-modal" data-modal-speed="700">Модальное окно 3</button>
</div>

<div class="modal-window" data-modal-target="middle-modal"></div>
<div class="modal-window" data-modal-target="last-modal"></div></div>
```

## "Изменение атрибутов и селекторов"

Для изменения стандартных атрибутов и селектов пропишите в настройки следующее:
```javaScript
const modal = new Rmodal('[data-modal]', {
  modalOverlayName: 'data-modal-overlay', // ваш атрибут
  modalWindowName: 'data-modal-target', // ваш атрибут
  modalWindowSpeedName: 'data-modal-speed', // ваш атрибут
  modalCloseBtnName: 'data-modal-close', // ваш атрибут
  autoOpenName: 'data-auto-open', // ваш атрибут
  modalOverlayBlockName: 'show', // ваш селектор
  disableScrollName: 'dis-scroll', // ваш селектор
  modalWindowBlockName: 'block', // ваш селектор
  modalWindowShowName: 'show', // ваш селектор
});
```