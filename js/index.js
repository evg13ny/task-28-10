// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

const minWeightFruit = document.querySelector('.minweight__input'); // поле минимального диапазона значений фильтрации
const maxWeightFruit = document.querySelector('.maxweight__input'); // поле максимального диапазона значений фильтрации

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON);

const colorClasses = new Map([
  ['фиолетовый', 'fruit_violet'],
  ['зеленый', 'fruit_green'],
  ['розово-красный', 'fruit_carmazin'],
  ['желтый', 'fruit_yellow'],
  ['светло-коричневый', 'fruit_lightbrown'],
  ['другой', 'fruit_grey']
]);

function colorToClass(color) {
  return colorClasses.get(color);
};

/*** ОТОБРАЖЕНИЕ ***/

// отрисовка карточек
function display() {
  // TODO: очищаем fruitsList от вложенных элементов,
  // чтобы заполнить актуальными данными из fruits (done)
  fruitsList.innerHTML = "";

  for (let i = 0; i < fruits.length; i++) {
    // TODO: формируем новый элемент <li> при помощи document.createElement,
    // и добавляем в конец списка fruitsList при помощи document.appendChild (done)

    // создаю элемент li с классом "fruit__item" и дополняю класс цветом "fruit_color"
    const colorClass = colorToClass(fruits[i].color);
    let fruitLi = document.createElement('li');
    fruitLi.className = `fruit__item ${colorClass}`;

    // вставляю элемент li
    fruitLi.innerHTML = `<div class="fruit__info">
                        <div>index: ${i}</div>
                        <div>kind: ${fruits[i].kind}</div>
                        <div>color: ${fruits[i].color}</div>
                        <div>weight (кг): ${fruits[i].weight}</div>
                      </div>`;

    fruitsList.append(fruitLi);
  }
};

// первая отрисовка карточек
display();

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// перемешивание массива
const shuffleFruits = () => {
  let result = [];

  // копирую массив
  let oldFruits = fruits.slice();

  // ATTENTION: сейчас при клике вы запустите бесконечный цикл и браузер зависнет
  while (fruits.length > 0) {
    // TODO: допишите функцию перемешивания массива (done)
    // Подсказка: находим случайный элемент из fruits, используя getRandomInt
    // вырезаем его из fruits и вставляем в result.
    // ex.: [1, 2, 3], [] => [1, 3], [2] => [3], [2, 1] => [], [2, 1, 3]
    // (массив fruits будет уменьшатся, а result заполняться)
    let fruitRandom = getRandomInt(0, fruits.length - 1);
    result.push(fruits.slice(fruitRandom, fruitRandom + 1)[0]);
    fruits.splice(fruitRandom, 1);
  }

  // вывожу предупреждение, если массив не изменился
  fruits = result;
  if (JSON.stringify(oldFruits) === JSON.stringify(fruits)) {
    alert('Порядок не изменился!');
  }
};

// после перемешивания необходимо отсортировать
shuffleButton.addEventListener('click', () => {
  sortTimeLabel.textContent = 'sorting...';
  shuffleFruits();
  display();
});

/*** ФИЛЬТРАЦИЯ ***/

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((item) => {
    // TODO: допишите функцию (done)
    return (item.weight >= minWeightFruit.value && item.weight <= maxWeightFruit.value);
  });
};

// проверяю диапазон фильтрации
filterButton.addEventListener('click', () => {
  if (isNaN(minWeightFruit.value) || isNaN(maxWeightFruit.value)) {
    alert('Введите положительные min и max weight для фильтрации!');
    return false;
  } else if (minWeightFruit.value <= 0 || maxWeightFruit.value <= 0) {
    alert('Введите положительные min и max weight для фильтрации!');
    return false;
  } else if (minWeightFruit.value > maxWeightFruit.value) {
    let temp = minWeightFruit.value;
    minWeightFruit.value = maxWeightFruit.value;
    maxWeightFruit.value = temp;
  }

  filterFruits();
  display();
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

const comparationColor = (a, b) => {
  // TODO: допишите функцию сравнения двух элементов по цвету (done)

  // сортировка по алфавиту
  return a.color > b.color ? true : false;
};

const sortAPI = {
  bubbleSort(arr, comparation) {
    // TODO: допишите функцию сортировки пузырьком (done)
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - 1; j++) {
        if (comparation(arr[j], arr[j + 1])) {
          let temp = arr[j + 1];
          arr[j + 1] = arr[j];
          arr[j] = temp;
        }
      }
    }
  },

  // функция обмена элементов
  swap(items, firstIndex, secondIndex) {
    const temp = items[firstIndex];
    items[firstIndex] = items[secondIndex];
    items[secondIndex] = temp;
  },

  // функция разделитель
  partition(items, left, right) {
    var pivot = items[Math.floor((right +
      let) / 2)],
      i = left;
    j = right;
    while (i <= j) {
      while (items[i] < pivot) {
        i++;
      }
      while (items[j] > pivot) {
        j--;
      }
      if (i <= j) {
        this.swap(items, i, j);
        i++;
        j--;
      }
    }
    return i;
  },

  quickSort(items, left, right) {
    // TODO: допишите функцию быстрой сортировки (done)
    var index;
    if (items.length > 1) {
      left = typeof left != "number" ? 0 : left;
      right = typeof right != "number" ? items.length - 1 : right;
      index = this.partition(items, left, right);
      if (left < index - 1) {
        this.quickSort(items, left, index - 1);
      }
      if (index < right) {
        this.quickSort(items, index, right);
      }
    }
    return items;
  },

  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
sortKindLabel.textContent = sortKind;
sortTimeLabel.textContent = sortTime;

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort' (done)
  sortKindLabel.textContent === 'bubbleSort' ? sortKindLabel.textContent = 'quickSort' : sortKindLabel.textContent = 'bubbleSort';
  sortTimeLabel.textContent = '-';
});

sortActionButton.addEventListener('click', () => {
  // TODO: вывести в sortTimeLabel значение 'sorting...' (done - с кнопкой Перемешать смотрится красивее)
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display();
  // TODO: вывести в sortTimeLabel значение sortTime (done)
  sortTimeLabel.textContent = sortTime;
});

/*** ДОБАВИТЬ ФРУКТ ***/

function addCard() {
  let newFruit = {
    kind: kindInput.value,
    color: colorInput.value,
    weight: weightInput.value
  };
  fruits.push(newFruit);
};

// TODO: создание и добавление нового фрукта в массив fruits (done)
// необходимые значения берем из kindInput, colorInput, weightInput
function validateAdd() {
  if ((kindInput.value == "") || (weightInput.value == "")) {
    alert('Заполните недостающие поля!');
    return false;
  } else return true;
};

addActionButton.addEventListener('click', () => {
  if (validateAdd() === true) {
    addCard(kindInput.value, colorInput.value, weightInput.value);
    display();
  }
});