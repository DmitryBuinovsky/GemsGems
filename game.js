let config = {
  contentColorBG: '#738f99',

  rulesStatus: 0,
  recordsStatus: 0,

  countRows: 10,
  countCols: 10,

  offsetBorder: 10,
  borderRadius: 8,

  gemSize: null,

  startSwipe: null,
  endSwipe: null,

  imagesCoin: [
    'images/gem_1.png',
    'images/gem_2.png',
    'images/gem_3.png',
    'images/gem_4.png',
    'images/gem_5.png',
    'images/gem_6.png',
    'images/gem_7.png',
    'images/gem_8.png',
  ],

  gemClass: 'gem',
  gemIdPrefix: 'gem',
  gameStates: ['pick', 'switch', 'revert', 'remove', 'refill'],
  gameState: '',

  movingItems: 0,

  movesLeft: 20,

  countScore: 0,
};

let player = {
  selectedRow: -1,
  selectedCol: -1,
  posX: '',
  posY: '',
};

let components = {
  container: document.createElement('div'),
  content: document.createElement('div'),
  wrapper: document.createElement('div'),
  marker: document.createElement('div'),
  score: document.createElement('div'),
  moves: document.createElement('div'),
  gems: new Array(),
};

const game = document.getElementById('game');
const newGame = document.getElementById('new-game');
newGame.onclick = startGame;

// Инициализация всех составляющих игры
function startGame() {
  //Восстанавливаем ходы
  config.movesLeft = 20;
  //Обнуляем счет
  config.countScore = 0;
  soundInit();
  clearField();
  createContentPage();
  createWrapper();
  createScore();
  createMovesLeft();
  createMarker();
  createGrid();
  hideGameOverPlate();
  unload();

  // Переключаем статус игры на "выбор"
  config.gameState = config.gameStates[0];
}

// Задаем размер гемов от размера страницы
function checkPageSize() {
  let pageWidth = document.body.clientWidth;
  let pageHeight = document.body.clientHeight;
  if (pageWidth > pageHeight) {
    config.gemSize = Math.round(pageHeight / 15);
  } else {
    config.gemSize = Math.round(pageWidth / 15);
  }
  addElementsStyles();
}
checkPageSize();

// Меняем размеры элементов
function addElementsStyles() {
  if (config.gameState) {
    {
      const content = document.getElementById('content');
      const marker = document.getElementById('marker');
      const score = document.getElementById('score');
      const moves = document.getElementById('moves');
      const gems = document.getElementsByClassName('gem');
      content.style.width =
        config.gemSize * config.countCols + config.offsetBorder * 2 + 'px';
      content.style.height =
        config.gemSize * config.countCols + config.offsetBorder * 2 + 'px';

      marker.style.width = config.gemSize - 10 + 'px';
      marker.style.height = config.gemSize - 10 + 'px';

      score.style.width = (config.gemSize * config.countCols) / 2 + 'px';
      score.style.height = config.gemSize + 'px';

      moves.style.width = (config.gemSize * config.countCols) / 2 + 'px';
      moves.style.height = config.gemSize + 'px';
      moves.style.left = (config.gemSize * config.countCols) / 2 + 'px';

      for (let i = 0; i < gems.length; i++) {
        let row = parseInt(gems[i].getAttribute('id').split('_')[1]);
        let col = parseInt(gems[i].getAttribute('id').split('_')[2]);
        gems[i].style.width = config.gemSize + 'px';
        gems[i].style.height = config.gemSize + 'px';
        gems[i].style.top = config.gemSize * row + 'px';
        gems[i].style.left = config.gemSize * col + 'px';
      }
    }
  }
}
window.onresize = checkPageSize;

//Отображаем/скрываем правила игры
const rulesButton = document.getElementById('rules');
const rulesPlate = document.getElementById('rulesPlate');
function showRules() {
  if (config.rulesStatus == '0') {
    rulesPlate.style.display = 'block';
    rulesPlate.style.animationName = 'show';
    rulesPlate.style.animationDuration = '.7s';
    rulesPlate.style.animationTimingFunction = 'linear';
    rulesPlate.style.animationFillMode = 'forwards';
    config.rulesStatus = 1;
  } else {
    rulesPlate.style.animationName = 'hide';
    rulesPlate.style.animationDuration = '.7s';
    rulesPlate.style.animationTimingFunction = 'linear';
    rulesPlate.style.animationFillMode = 'forwards';
    config.rulesStatus = 0;
  }
}
rulesButton.onclick = showRules;

//swipe
document.addEventListener('touchstart', startSwipe, false);
document.addEventListener('touchend', endSwipe, false);
rulesButton.addEventListener('touchend', endSwipe, false);

function startSwipe(e) {
  e = e || window.event;
  config.startSwipe = e.changedTouches[0];
}

function endSwipe(e) {
  e = e || window.event;
  config.endSwipe = e.changedTouches[0];
  var x = Math.abs(config.startSwipe.clientX - config.endSwipe.clientX);
  var y = Math.abs(config.startSwipe.clientY - config.endSwipe.clientY);
  if (x > 100 || y > 100) {
    showRules();
  }
}

// Отображаем/скрываем рекорды
const recordsButton = document.getElementById('records');
const recordsTable = document.getElementById('recordsTable');
function showRecords() {
  if (config.recordsStatus == '0') {
    recordsTable.style.display = 'flex';
    recordsTable.style.animationName = 'show';
    recordsTable.style.animationDuration = '.7s';
    recordsTable.style.animationTimingFunction = 'linear';
    recordsTable.style.animationFillMode = 'forwards';
    config.recordsStatus = 1;
  } else {
    recordsTable.style.animationName = 'hide';
    recordsTable.style.animationDuration = '.7s';
    recordsTable.style.animationTimingFunction = 'linear';
    recordsTable.style.animationFillMode = 'forwards';
    config.recordsStatus = 0;
  }
  restoreInfo();
}
recordsButton.onclick = showRecords;

// Создание обертки с контентом
function createContentPage() {
  components.content.id = 'content';
  components.content.style.padding = config.offsetBorder + 'px';
  components.content.style.width =
    config.gemSize * config.countCols + config.offsetBorder * 2 + 'px';
  components.content.style.height =
    config.gemSize * config.countRows + config.offsetBorder * 2 + 'px';
  components.content.style.backgroundColor = config.contentColorBG;
  components.content.style.boxShadow = config.offsetBorder + 'px';
  components.content.style.borderRadius = config.borderRadius + 'px';
  components.content.style.boxSizing = 'border-box';

  game.append(components.content);
}

// Создание обертки для кристаллов, очков и счёта
function createWrapper() {
  components.wrapper.id = 'wrapper';
  components.wrapper.style.position = 'relative';
  components.wrapper.style.height = '100%';
  components.wrapper.addEventListener('click', function (e) {
    handlerTab(e, e.target);
  });

  components.content.append(components.wrapper);
}

// Создание маркера для выделения кристаллов
function createMarker() {
  components.marker.id = 'marker';
  components.marker.style.width = config.gemSize - 10 + 'px';
  components.marker.style.height = config.gemSize - 10 + 'px';
  components.marker.style.border = '5px solid white';
  components.marker.style.borderRadius = '10px';
  components.marker.style.position = 'absolute';
  components.marker.style.display = 'none';

  components.wrapper.append(components.marker);
}
// Показать маркер
function markerShow() {
  components.marker.style.display = 'block';
}
// Скрыть маркер
function markerHide() {
  components.marker.style.display = 'none';
}

// Создание блока для очков
function createScore() {
  components.score.id = 'score';
  components.score.style.width = (config.gemSize * config.countCols) / 2 + 'px';
  components.score.style.height = config.gemSize + 'px';
  components.score.style.display = 'flex';
  components.score.style.justifyContent = 'center';
  components.score.style.alignItems = 'center';
  components.score.style.borderRadius = config.borderRadius + 'px';
  components.score.style.backgroundColor = config.contentColorBG;
  components.score.style.position = 'absolute';
  components.score.style.bottom = 'calc(100% + ' + 24 + 'px)';
  // components.score.style.left =
  //   'calc(50% - ' + parseInt(components.score.style.width) / 2 + 'px)';

  components.score.style.fontFamily = 'sans-serif';
  components.score.style.fontSize = '1.7vw';
  components.score.style.color = '#ffffff';

  updateScore();
}

// Обновляем очки
function updateScore() {
  components.score.innerHTML = 'Счёт: ' + config.countScore;
  components.wrapper.append(components.score);
}

// Добавление очков
function scoreInc(count) {
  if (count >= 4) {
    count *= 2;
  } else if (count >= 5) {
    count = (count + 1) * 2;
  } else if (count >= 6) {
    count *= (count + 2) * 2;
  }

  config.countScore += count;
  updateScore();
}

// Создаем блок для отсчета ходов
function createMovesLeft() {
  components.moves.id = 'moves';
  components.moves.style.width = (config.gemSize * config.countCols) / 2 + 'px';
  components.moves.style.height = config.gemSize + 'px';
  components.moves.style.display = 'flex';
  components.moves.style.justifyContent = 'center';
  components.moves.style.alignItems = 'center';
  components.moves.style.borderRadius = config.borderRadius + 'px';
  components.moves.style.backgroundColor = config.contentColorBG;
  components.moves.style.position = 'absolute';
  components.moves.style.bottom = 'calc(100% + ' + 24 + 'px)';
  components.moves.style.left = (config.gemSize * config.countCols) / 2 + 'px';
  components.moves.style.fontFamily = 'sans-serif';
  components.moves.style.fontSize = '1.7vw';
  components.moves.style.color = '#ffffff';

  updateMovesLeft();
}
// Обновляем оставшееся колв-во ходов
function updateMovesLeft() {
  components.moves.innerHTML = 'Осталось ходов: ' + config.movesLeft;
  components.wrapper.append(components.moves);
  gameOver();
}
// Уменьшаем кол-во оставшихся ходов
function movesDec() {
  config.movesLeft--;
  updateMovesLeft();
}

// Создание гемы
function createGem(t, l, row, col, img) {
  let gem = document.createElement('div');
  gem.classList.add(config.gemClass);
  gem.id = config.gemIdPrefix + '_' + row + '_' + col;
  gem.style.boxSizing = 'border-box';
  gem.style.cursor = 'pointer';
  gem.style.position = 'absolute';
  gem.style.top = t + 'px';
  gem.style.left = l + 'px';
  gem.style.width = config.gemSize + 'px';
  gem.style.height = config.gemSize + 'px';
  gem.style.border = '1px solid transparent';
  gem.style.backgroundImage = 'url(' + img + ')';
  gem.style.backgroundSize = '100%';
  gem.style.backgroundRepeat = 'no-repeat';
  gem.style.backgroundPosition = 'center';

  components.wrapper.append(gem);
}

// Создание и наполнение сетки для гемов
function createGrid() {
  // Создание пустой сетки
  for (i = 0; i < config.countRows; i++) {
    components.gems[i] = new Array();
    for (j = 0; j < config.countCols; j++) {
      components.gems[i][j] = -1;
    }
  }

  // Заполняем сетку
  for (i = 0; i < config.countRows; i++) {
    for (j = 0; j < config.countCols; j++) {
      do {
        components.gems[i][j] = Math.floor(Math.random() * 8);
      } while (isStreak(i, j));

      createGem(
        i * config.gemSize,
        j * config.gemSize,
        i,
        j,
        config.imagesCoin[components.gems[i][j]]
      );
    }
  }
}

// Проверка на группу сбора
function isStreak(row, col) {
  return isVerticalStreak(row, col) || isHorizontalStreak(row, col);
}
// Проверка на группу сбора по колонкам
function isVerticalStreak(row, col) {
  let gemValue = components.gems[row][col];
  let streak = 0;
  let tmp = row;

  while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = row;

  while (
    tmp < config.countRows - 1 &&
    components.gems[tmp + 1][col] == gemValue
  ) {
    streak++;
    tmp++;
  }

  return streak > 1;
}
// Проверка на группу сбора по строкам
function isHorizontalStreak(row, col) {
  let gemValue = components.gems[row][col];
  let streak = 0;
  let tmp = col;

  while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
    streak++;
    tmp--;
  }

  tmp = col;

  while (
    tmp < config.countCols - 1 &&
    components.gems[row][tmp + 1] == gemValue
  ) {
    streak++;
    tmp++;
  }

  return streak > 1;
}

// Обработчик клика
function handlerTab(e, target) {
  e = e || window.event;
  // Если это элемент с классом config.gameClass
  // и
  // Если подходящее состояние игры
  if (target.classList.contains(config.gemClass) && config.gameStates[0]) {
    // определить строку и столбец
    let row = parseInt(target.getAttribute('id').split('_')[1]);
    let col = parseInt(target.getAttribute('id').split('_')[2]);

    // Выделяем гем курсором
    markerShow();
    components.marker.style.top = parseInt(target.style.top) + 'px';
    components.marker.style.left = parseInt(target.style.left) + 'px';

    // Если это первый выбор, то сохраняем выбор
    if (player.selectedRow == -1) {
      player.selectedRow = row;
      player.selectedCol = col;
    } else {
      // Если гем находится рядом с первым выбором то меняем их местами
      if (
        (Math.abs(player.selectedRow - row) == 1 &&
          player.selectedCol == col) ||
        (Math.abs(player.selectedCol - col) == 1 && player.selectedRow == row)
      ) {
        markerHide();

        // После выбора меняем состояние игры
        config.gameState = config.gameStates[1];

        // сохранить позицию второго выбранного гема
        player.posX = col;
        player.posY = row;

        // поменять их местами
        gemSwitch();
      } else {
        // Если второй выбор произошел не рядом,
        // то делаем его первым выбором.
        player.selectedRow = row;
        player.selectedCol = col;
      }
    }
  }
}

// Меняем гемы местами
function gemSwitch() {
  let yOffset = player.selectedRow - player.posY;
  let xOffset = player.selectedCol - player.posX;

  // Метка для гемов, которые нужно двигать
  document
    .querySelector(
      '#' +
        config.gemIdPrefix +
        '_' +
        player.selectedRow +
        '_' +
        player.selectedCol
    )
    .classList.add('switch');
  document
    .querySelector(
      '#' +
        config.gemIdPrefix +
        '_' +
        player.selectedRow +
        '_' +
        player.selectedCol
    )
    .setAttribute('dir', '-1');

  document
    .querySelector(
      '#' + config.gemIdPrefix + '_' + player.posY + '_' + player.posX
    )
    .classList.add('switch');
  document
    .querySelector(
      '#' + config.gemIdPrefix + '_' + player.posY + '_' + player.posX
    )
    .setAttribute('dir', '1');

  // меняем гемы местами
  $('.switch').each(function () {
    config.movingItems++;

    $(this).animate(
      {
        left: '+=' + xOffset * config.gemSize * $(this).attr('dir'),
        top: '+=' + yOffset * config.gemSize * $(this).attr('dir'),
      },
      {
        duration: 250,
        complete: function () {
          //Проверяем доступность данного хода
          checkMoving();
        },
      }
    );

    $(this).removeClass('switch');
  });

  // поменять идентификаторы гемов
  document
    .querySelector(
      '#' +
        config.gemIdPrefix +
        '_' +
        player.selectedRow +
        '_' +
        player.selectedCol
    )
    .setAttribute('id', 'temp');
  document
    .querySelector(
      '#' + config.gemIdPrefix + '_' + player.posY + '_' + player.posX
    )
    .setAttribute(
      'id',
      config.gemIdPrefix + '_' + player.selectedRow + '_' + player.selectedCol
    );
  document
    .querySelector('#temp')
    .setAttribute(
      'id',
      config.gemIdPrefix + '_' + player.posY + '_' + player.posX
    );

  // поменять гемы в сетке
  let temp = components.gems[player.selectedRow][player.selectedCol];
  components.gems[player.selectedRow][player.selectedCol] =
    components.gems[player.posY][player.posX];
  components.gems[player.posY][player.posX] = temp;
}

// Проверка перемещенных гемов
function checkMoving() {
  config.movingItems--;

  // Действуем тольпо после всех перемещений
  if (config.movingItems == 0) {
    // Действия в зависимости от состояния игры
    switch (config.gameState) {
      // После передвижения гемов проверяем на появление групп сбора
      case config.gameStates[1]:
      case config.gameStates[2]:
        // проверяем, появились ли группы сбора
        if (
          !isStreak(player.selectedRow, player.selectedCol) &&
          !isStreak(player.posY, player.posX)
        ) {
          // Если групп сбора нет, нужно отменить совершенное движение
          // а если действие уже отменяется, то вернуться к исходному состоянию ожидания выбора
          if (config.gameState != config.gameStates[2]) {
            config.gameState = config.gameStates[2];
            gemSwitch();
          } else {
            config.gameState = config.gameStates[0];
            player.selectedRow = -1;
            player.selectedCol = -1;
          }
        } else {
          // Если группы сбора есть, нужно их удалить
          config.gameState = config.gameStates[3];
          // Если совершили ход, уменьшим кол-во оставшихся ходов
          movesDec();
          // Отметим все удаляемые гемы
          if (isStreak(player.selectedRow, player.selectedCol)) {
            removeGems(player.selectedRow, player.selectedCol);
          }

          if (isStreak(player.posY, player.posX)) {
            removeGems(player.posY, player.posX);
          }

          // Убираем с поля
          gemFade();
        }
        break;
      // После удаления нужно заполнить пустоту
      case config.gameStates[3]:
        checkFalling();
        break;
      case config.gameStates[4]:
        placeNewGems();
        break;
    }
  }
}

// Отмечаем элементы для удаления и убираем их из сетки
function removeGems(row, col) {
  let gemValue = components.gems[row][col];
  let tmp = row;

  document
    .querySelector('#' + config.gemIdPrefix + '_' + row + '_' + col)
    .classList.add('remove');
  let countRemoveGem = document.querySelectorAll('.remove').length;

  if (isVerticalStreak(row, col)) {
    while (tmp > 0 && components.gems[tmp - 1][col] == gemValue) {
      document
        .querySelector('#' + config.gemIdPrefix + '_' + (tmp - 1) + '_' + col)
        .classList.add('remove');
      components.gems[tmp - 1][col] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = row;

    while (
      tmp < config.countRows - 1 &&
      components.gems[tmp + 1][col] == gemValue
    ) {
      document
        .querySelector('#' + config.gemIdPrefix + '_' + (tmp + 1) + '_' + col)
        .classList.add('remove');
      components.gems[tmp + 1][col] = -1;
      tmp++;
      countRemoveGem++;
    }
  }

  if (isHorizontalStreak(row, col)) {
    tmp = col;

    while (tmp > 0 && components.gems[row][tmp - 1] == gemValue) {
      document
        .querySelector('#' + config.gemIdPrefix + '_' + row + '_' + (tmp - 1))
        .classList.add('remove');
      components.gems[row][tmp - 1] = -1;
      tmp--;
      countRemoveGem++;
    }

    tmp = col;

    while (
      tmp < config.countCols - 1 &&
      components.gems[row][tmp + 1] == gemValue
    ) {
      document
        .querySelector('#' + config.gemIdPrefix + '_' + row + '_' + (tmp + 1))
        .classList.add('remove');
      components.gems[row][tmp + 1] = -1;
      tmp++;
      countRemoveGem++;
    }
  }

  components.gems[row][col] = -1;

  scoreInc(countRemoveGem);
}

// Удаляем гемы
function gemFade() {
  $('.remove').each(function () {
    config.movingItems++;

    $(this).animate(
      {
        opacity: 0,
      },
      {
        duration: 200,
        complete: function () {
          $(this).remove();
          checkMoving();
          markerHide(); //прячем маркер
          fadeSound(); //звук уничножения гемов
          vibro(); //вибро при уничтожении гемов
        },
      }
    );
  });
}

// Заполняем пустоту
function checkFalling() {
  let fellDown = 0;

  for (j = 0; j < config.countCols; j++) {
    for (i = config.countRows - 1; i > 0; i--) {
      if (components.gems[i][j] == -1 && components.gems[i - 1][j] >= 0) {
        document
          .querySelector('#' + config.gemIdPrefix + '_' + (i - 1) + '_' + j)
          .classList.add('fall');
        document
          .querySelector('#' + config.gemIdPrefix + '_' + (i - 1) + '_' + j)
          .setAttribute('id', config.gemIdPrefix + '_' + i + '_' + j);
        components.gems[i][j] = components.gems[i - 1][j];
        components.gems[i - 1][j] = -1;
        fellDown++;
      }
    }
  }

  $('.fall').each(function () {
    config.movingItems++;

    $(this).animate(
      {
        top: '+=' + config.gemSize,
      },
      {
        duration: 100,
        complete: function () {
          $(this).removeClass('fall');
          checkMoving();
        },
      }
    );
  });

  // Если все элементы передвинули, то сменить состояние игры
  if (fellDown == 0) {
    config.gameState = config.gameStates[4];
    config.movingItems = 1;
    checkMoving();
  }
}

// Создание новых гемов
function placeNewGems() {
  let gemsPlaced = 0;

  // Поиск мест, в которых необходимо создать гем
  for (i = 0; i < config.countCols; i++) {
    if (components.gems[0][i] == -1) {
      components.gems[0][i] = Math.floor(Math.random() * 8);

      createGem(
        0,
        i * config.gemSize,
        0,
        i,
        config.imagesCoin[components.gems[0][i]]
      );
      gemsPlaced++;
    }
  }

  // Если мы создали гемы, то проверяем необходимость их сдвинуть вниз.
  if (gemsPlaced) {
    config.gameState = config.gameStates[3];
    checkFalling();
  } else {
    // Проверка на группы сбора
    let combo = 0;

    for (i = 0; i < config.countRows; i++) {
      for (j = 0; j < config.countCols; j++) {
        if (
          j <= config.countCols - 3 &&
          components.gems[i][j] == components.gems[i][j + 1] &&
          components.gems[i][j] == components.gems[i][j + 2]
        ) {
          combo++;
          removeGems(i, j);
        }
        if (
          i <= config.countRows - 3 &&
          components.gems[i][j] == components.gems[i + 1][j] &&
          components.gems[i][j] == components.gems[i + 2][j]
        ) {
          combo++;
          removeGems(i, j);
        }
      }
    }

    // удаляем найденные группы сбора
    if (combo > 0) {
      config.gameState = config.gameStates[3];
      gemFade();
    } else {
      // Запускаем основное состояние игры
      config.gameState = config.gameStates[0];
      player.selectedRow = -1;
    }
  }
}
// Конец игры
function gameOver() {
  const gameOverPlate = document.getElementById('game-over-wrapper');
  const playerNameField = document.getElementById('playerName');
  if (config.movesLeft == 0) {
    gameOverPlate.style.display = 'block';
    playerNameField.focus();
  }
}
function hideGameOverPlate() {
  const gameOverPlate = document.getElementById('game-over-wrapper');
  gameOverPlate.style.display = 'none';
}
// Чистим поле, чистим счет
function clearField() {
  let elems = document.querySelectorAll('.gem');
  for (let i = 0; i < elems.length; i++) {
    elems[i].remove();
  }
}

// Добавляем аудио
const fadeAudio = new Audio('../media/remove_sound.mp3');

// Запускаем звук и разу останавливаем
function soundInit() {
  fadeAudio.play();
  fadeAudio.pause();
}
function fadeSound() {
  fadeAudio.currentTime = 0;
  fadeAudio.play();
}
// Добавим вибро-отклик
function vibro(longFlag) {
  // есть поддержка Vibration API?
  if (navigator.vibrate) {
    if (!longFlag) {
      // вибрация 100мс
      window.navigator.vibrate(100);
    }
  }
}
// Предупреждение при закрытии вкладки, браузера, когда освежаем страницу
function unload() {
  window.addEventListener('beforeunload', BefUnload);
  function BefUnload(e) {
    e = e || window.event;
    if (config.gameState) {
      //идет процесс игры
      e.returnValue = 'Вы уверены? Достижерния в игре будут утрачены!';
    }
  }
}

//AJAX рекорды
const ajaxHandlerScript = 'https://fe.it-academy.by/AjaxStringStorage2.php';
let updatePassword;
const stringName = 'BUINOVSKY_GEMSGEMS_RECORDS';
const addRecord = document.getElementById('playerNameBtn');
addRecord.onclick = storeInfo;

function storeInfo() {
  updatePassword = Math.random();
  $.ajax({
    url: ajaxHandlerScript,
    type: 'POST',
    cache: false,
    dataType: 'json',
    data: { f: 'LOCKGET', n: stringName, p: updatePassword },
    success: lockGetReady,
    error: errorHandler,
  });
  hideGameOverPlate();
  clearField();
}

let playerName = document.getElementById('playerName');

//Добавляем данные о рекорде на сервер
function lockGetReady(callresult) {
  if (callresult.error != undefined) alert(callresult.error);
  else {
    let record = JSON.parse(callresult.result);
    let info = { name: playerName.value, record: config.countScore };
    record.push(info);

    $.ajax({
      url: ajaxHandlerScript,
      type: 'POST',
      cache: false,
      dataType: 'json',
      data: {
        f: 'UPDATE',
        n: stringName,
        v: JSON.stringify(record),
        p: updatePassword,
      },
      success: updateReady,
      error: errorHandler,
    });
  }
}

//Загружаем таблицу рекордов с сервера
function restoreInfo() {
  $.ajax({
    url: ajaxHandlerScript,
    type: 'POST',
    cache: false,
    dataType: 'json',
    data: { f: 'READ', n: stringName },
    success: readReady,
    error: errorHandler,
  });
}
//Создаём таблицу с рекордами
function readReady(callresult) {
  if (callresult.error != undefined) console.log(callresult.error);
  else if (callresult.result != '') {
    let result = JSON.parse(callresult.result);
    createRecordTable(recordsTable, result);
  }
}

function createRecordTable(field, data) {
  var pageHTML = '';
  data.sort(compareScore);
  pageHTML += '<table> <thead> Таблица рекордов </thead><tbody>';
  pageHTML +=
    '<td>' +
    'МЕСТО' +
    '</td>' +
    '<td>' +
    'ИМЯ' +
    '</td>' +
    '<td>' +
    'СЧЁТ' +
    '</td>';
  for (var i = 0; i < data.length; i++) {
    if (i > 9) {
      break;
    }
    pageHTML += '<tr>';
    pageHTML +=
      '<td>' +
      (i + 1) +
      '</td>' +
      '<td>' +
      data[i].name +
      '</td>' +
      '<td>' +
      data[i].record +
      '</td>';
    pageHTML += '</tr>';
  }
  pageHTML += '</tbody></table>';
  field.innerHTML = pageHTML;
}

//Сортируем данные по убыванию
function compareScore(a, b) {
  return b.record - a.record;
}

function updateReady(callresult) {
  if (callresult.error != undefined) console.log(callresult.error);
}
function errorHandler(jqXHR, statusStr, errorStr) {
  alert(statusStr + ' ' + errorStr);
}
