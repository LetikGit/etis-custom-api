# ETIS Custom API

### Дисклеймер

Проект представляет собой инструмент для получения данных с ЕТИС посредством парсинга страниц. Проект не является официальным API и только является парсингом страниц.
Все совпадения с ссылками и классами на страницах случайны :)
Проект не несет в себе цели навредить ЕТИС и сделан только для упрощения разработки студенческих проектов для студентов ПГНИУ.

Если Вы являетесь представителем ПГНИУ и глубоко обижены и оскорблены этим проектом и немедленно требуете его удалить, то пишите [вот сюда](https://vk.com/dletovaltsev)

На текущий момент API умеет:

+ получение оценок за сессии (**/api/sessionMarks/**)
+ получение контрольных точек за триместр (**/api/marksByTrim/:trim**)
+ получение расписания по номеру недели (**/api/schedule/:week**)
+ получение текущего расписания (**/api/schedule**)
+ получение списка преподавателей (**/api/teachers**)
+ авторизация, получения сессии (**/api/login**)
+ получение общей информации об аккаунте студента (**/api/account**)

### Зачем это надо?

Привет разработчикам ЕТИС, которые планируют пока ЕТИС полностью не загнется оставлять его на древних технологиях без какого-либо внешнего API для реализации студенческих проектов.
Проект поможет заинтересованным разработчикам делать своих ботов, приложения и прочие сервисы для своего удобства, удобства одногруппников и других студентов. Прекрасный отдел ответственный за ЕТИС борится с публичными проектами, однако приватные проекты смогут развиваться и поэтому я выкладываю этот проект.

### Установка

```
git clone https://github.com/LetikGit/etis-custom-api.git
cd etis-custom-api
npm install
```

### Как с ним работать?

Первоначально нужно получить сессию. При каждом запросе нужно передавать сессию в body.

Получить сессию можно на:
```/api/login```

Пример запроса на fetch для получения сессии:

```js
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "username": "Иванов",
  "password": "Иванов1337"
});

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/api/login", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

Мы получили сессию. Теперь например, мы хотим получить информацию об аккаунте. Нам нужно сделать запрос на
```/api/account```

С сессией, которую мы получили, в body.
Пример:

```js
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  "session": "XXXXXXXXX" // сюда пишем сессию
});

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/api/account", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
```

Таким образом можно легко получать данные из ЕТИС. 

### Короче говоря

Если вы заинтересованы, то присылайте свои MR-ы для улучшения этого API. 
Так же советую при использовании проекта использовать ещё пару вещей

- [pm2](https://www.npmjs.com/package/pm2)
- [morgan](https://www.npmjs.com/package/morgan)

### Как запустить?

Есть такой прикол, что приложение для обхода капчи во время логина использует NightmareJS, поэтому при запуске на Linux нужно писать такую команду.

```xvfb-run node --harmony app.js```

### Планы на будущее

- [ ] Тесты
- [ ] Error Handling
- [ ] Дополнительные методы
- [ ] Написать еще планов