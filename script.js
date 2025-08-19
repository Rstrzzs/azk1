// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVwEqDhZ1PWrJNycW0QIrtK-HUKFEdcws",
  authDomain: "mosvca-c81cc.firebaseapp.com",
  projectId: "mosvca-c81cc",
  storageBucket: "mosvca-c81cc.firebasestorage.app",
  messagingSenderId: "929517510680",
  appId: "1:929517510680:web:fdd55587b485af4358e36d",
  measurementId: "G-RFW682CENX"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Функция проверки админа
async function checkAdmin() {
    try {
      // Получаем данные Telegram WebApp
      const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
      if (!tgUser || !tgUser.username) return false;

      // Проверяем в Firebase
      const snapshot = await firebase.database().ref('admins').once('value');
      const admins = snapshot.val();

      if (admins && Object.values(admins).includes(tgUser.username)) {
        localStorage.setItem('isAdmin', 'true');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Admin check error:', error);
      return false;
    }
}

           document.getElementById('rateButton').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('rateContainer').style.display = 'block';
            fetchExchangeRates(); // Загружаем актуальные курсы
        });

        document.getElementById('backButtonRate').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('rateContainer').style.display = 'none';
        });

        document.getElementById('exchangeButton').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('exchangeContainer').style.display = 'block';
        });

        document.getElementById('exchangeButton').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('exchangeContainer').style.display = 'block';
        });

        document.getElementById('backButtonBuy').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('exchangeContainer').style.display = 'none';
        });

        document.getElementById('backButtonSell').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('exchangeContainer').style.display = 'none';
        });

        // Переключение между покупкой и продажей
        document.getElementById('buyOption').addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('sellOption').classList.remove('active');
            document.getElementById('buyMenu').style.display = 'block';
            document.getElementById('sellMenu').style.display = 'none';
        });

        document.getElementById('sellOption').addEventListener('click', function() {
            this.classList.add('active');
            document.getElementById('buyOption').classList.remove('active');
            document.getElementById('buyMenu').style.display = 'none';
            document.getElementById('sellMenu').style.display = 'block';
        });
        async function fetchExchangeRates() {
  try {
    const snapshot = await firebase.database().ref('exchangeRates').once('value');
    const rates = snapshot.val();

    if (rates) {
      document.getElementById('buyRate').textContent = `${rates.buy.toFixed(2)} RUB`;
      document.getElementById('sellRate').textContent = `${rates.sell.toFixed(2)} RUB`;
    } else {
      // Значения по умолчанию, если в базе нет данных
      document.getElementById('buyRate').textContent = '79.85 RUB';
      document.getElementById('sellRate').textContent = '77.00 RUB';
    }
  } catch (error) {
    console.error('Ошибка при получении курса:', error);
    document.getElementById('buyRate').textContent = '79.85 RUB';
    document.getElementById('sellRate').textContent = '77.00 RUB';
  }
}




        // Обработчик для кнопки "Назад" в экране заявок
        document.getElementById('backButtonOrders').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('ordersContainer').style.display = 'none';
        });

        // Инициализация при загрузке
        document.addEventListener('DOMContentLoaded', function() {
            // Можно сразу загрузить курсы
             fetchExchangeRates();
        });

        // Обработчик для кнопки "Поддержка"
        document.querySelector('.square-buttons .square-button:nth-child(3)').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('supportContainer').style.display = 'block';
        });

        // Обработчик для кнопки "Назад" в экране поддержки
        document.getElementById('backButtonSupport').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('supportContainer').style.display = 'none';
        });

        // Обработчик для кнопки "Чат"
        document.getElementById('chatButton').addEventListener('click', function() {
            window.open('https://t.me/Mosca67_Support', '_blank');
        });

        // Обработчик для кнопки "О нас"
        document.querySelector('.square-buttons .square-button:nth-child(4)').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'none';
            document.getElementById('aboutContainer').style.display = 'block';
        });

        // Обработчик для кнопки "Назад" в экране "О нас"
        document.getElementById('backButtonAbout').addEventListener('click', function() {
            document.querySelector('.main-container').style.display = 'block';
            document.getElementById('aboutContainer').style.display = 'none';
        });

        //
// Находим кнопку и добавляем обработчик
document.getElementById('createOrderBtn').addEventListener('click', createOrder);

// Функция для создания заявки
function createOrder() {
            // Получаем значения из полей
            const lastName = document.getElementById('lastNameInput').value.trim();
            const firstName = document.getElementById('firstNameInput').value.trim();
            const username_telegram = document.getElementById('middleNameInput').value.trim();
            const walletAddress = document.getElementById('walletInput').value.trim();
            const amount = document.getElementById('amountInput').value.trim();

            // Проверяем заполнение полей
            if (!lastName || !firstName || !username_telegram || !walletAddress || !amount) {
                showNotification('Заполните все поля!', 'error');
                return;
            }

            // Проверяем, что сумма - число
            if (isNaN(amount)) {
                showNotification('Введите корректную сумму!', 'error');
                return;
            }

            // Создаем объект заявки с статусом "Новая"
            const orderData = {
                lastName,
                firstName,
                username_telegram,
                walletAddress,
                amount: parseFloat(amount),
                timestamp: new Date().toISOString(),
                status: "Новая" // Устанавливаем статус "Новая" по умолчанию
            };

            // Отправляем в Firebase
            sendOrderToFirebase(orderData);
        }

// Функция для отправки данных в Firebase
function sendOrderToFirebase(orderData) {
    const ordersRef = firebase.database().ref('orders');

    ordersRef.push(orderData)
        .then(() => {
            showNotification('Заявка успешно создана!', 'success');
            // Очищаем поля (опционально)
            clearForm();
        })
        .catch((error) => {
            console.error("Ошибка отправки заявки:", error);
            showNotification('Ошибка при создании заявки!', 'error');
        });
}

// Функция для показа уведомлений
function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Очистка формы после отправки
function clearForm() {
    document.querySelector('#buyMenu .exchange-input').value = '';
    const inputs = document.querySelectorAll('#buyMenu .exchange-field-input');
    inputs.forEach(input => input.value = '');
    document.getElementById('termsCheckBuy').checked = false;
}


        /////////////
        document.getElementById('createOrderBtnSale').addEventListener('click', createOrderSale);

// Функция для создания заявки
function createOrderSale() {
            // Получаем значения из полей
            const lastNameSale = document.getElementById('lastNameInputSale').value.trim();
            const firstNameSale = document.getElementById('firstNameInputSale').value.trim();
            const username_telegramSale = document.getElementById('middleNameInputSale').value.trim();

            // Проверяем заполнение полей
            if (!lastNameSale || !firstNameSale || !username_telegramSale) {
                showNotification('Заполните все поля!', 'error');
                return;
            }

            // Создаем объект заявки с статусом "Новая"
            const orderDataSale = {
                lastNameSale,
                firstNameSale,
                username_telegramSale,
                timestamp: new Date().toISOString(),
                status: "Новая" // Устанавливаем статус "Новая" по умолчанию
            };

            // Отправляем в Firebase
            sendOrderSaleToFirebase(orderDataSale);
        }

// Функция для отправки данных в Firebase
function sendOrderSaleToFirebase(orderDataSale) {
    const ordersRefSale = firebase.database().ref('ordersSale');

    ordersRefSale.push(orderDataSale)
        .then(() => {
            showNotificationSale('Заявка успешно создана!', 'success');
            // Очищаем поля (опционально)
            clearFormSale();
        })
        .catch((error) => {
            console.error("Ошибка отправки заявки:", error);
            showNotificationSale('Ошибка при создании заявки!', 'error');
        });
}

// Функция для показа уведомлений
function showNotificationSale(message, type) {
    const notification = document.getElementById('notificationSale');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Скрываем уведомление через 3 секунды
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Очистка формы после отправки
function clearFormSale() {
    document.querySelector('#buyMenu .exchange-input').value = '';
    const inputs = document.querySelectorAll('#buyMenu .exchange-field-input');
    inputs.forEach(input => input.value = '');
    document.getElementById('termsCheckBuy').checked = false;
}


// Показываем кнопку админа если пользователь админ
document.addEventListener('DOMContentLoaded', async function() {
  const isAdmin = await checkAdmin();
  if (isAdmin) {
    document.getElementById('adminButton').style.display = 'block';
  }
});

// Обработчики для админ-панели
document.getElementById('adminButton').addEventListener('click', function() {
  document.querySelector('.main-container').style.display = 'none';
  document.getElementById('adminContainer').style.display = 'block';
  loadBuyOrders();
});

document.getElementById('backButtonAdmin').addEventListener('click', function() {
  document.querySelector('.main-container').style.display = 'block';
  document.getElementById('adminContainer').style.display = 'none';
});

// Переключение вкладок
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');
    document.getElementById(this.dataset.tab).style.display = 'block';
  });
});

// Загрузка заказов на покупку (с сортировкой от новых к старым)
// Загрузка заявок на покупку (исправленная версия)
// Загрузка заявок на покупку (исправленная версия)
async function loadBuyOrders(page = 1, limit = 10, statusFilter = 'all') {
    try {
        const ordersRef = firebase.database().ref('orders');
        const snapshot = await ordersRef.once('value');
        const orders = snapshot.val();

        const ordersList = document.getElementById('buyOrdersList');
        if (!ordersList) return;

        // Очищаем список только если вкладка активна
        const tabContent = document.getElementById('buy-orders');
        if (tabContent && tabContent.style.display === 'block') {
            ordersList.innerHTML = `
                <div class="admin-filter">
                    <select id="buyStatusFilter">
                        <option value="all">Все статусы</option>
                        <option value="Новая">Новая</option>
                        <option value="В обработке">В обработке</option>
                        <option value="Завершенная">Завершенная</option>
                    </select>
                    <button id="applyBuyFilter">Применить</button>
                </div>
            `;

            // Устанавливаем выбранный фильтр
            if (statusFilter !== 'all') {
                document.getElementById('buyStatusFilter').value = statusFilter;
            }

            // Обработчики для фильтра
            document.getElementById('applyBuyFilter').addEventListener('click', () => {
                const filter = document.getElementById('buyStatusFilter').value;
                loadBuyOrders(1, 10, filter);
            });

            if (!orders) {
                ordersList.innerHTML += '<p>Нет заявок на покупку</p>';
                return;
            }

            // Преобразуем объект в массив и сортируем по дате (новые сначала)
            let sortedOrders = Object.entries(orders)
                .map(([id, order]) => ({ id, ...order }))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Применяем фильтр
            if (statusFilter !== 'all') {
                sortedOrders = sortedOrders.filter(order => {
                    if (statusFilter === 'Новая') return !order.status || order.status === 'Новая';
                    if (statusFilter === 'В обработке') return order.status && order.status.startsWith('В обработке');
                    if (statusFilter === 'Завершенная') return order.status === 'Завершенная';
                    return true;
                });
            }

            if (sortedOrders.length === 0) {
                ordersList.innerHTML += '<p>Нет заявок с выбранным статусом</p>';
                return;
            }

            sortedOrders.forEach(({ id, ...order }) => {
                const orderItem = document.createElement('div');
                orderItem.className = 'admin-order-item';

                // Определяем класс статуса
                let statusClass = 'status-new';
                if (order.status && order.status.startsWith('В обработке')) statusClass = 'status-processing';
                if (order.status === 'Завершенная') statusClass = 'status-completed';

                orderItem.innerHTML = `
                    <div>
                        <strong>${order.firstName} ${order.lastName}</strong>
                        <span class="admin-order-status ${statusClass}">
                            ${order.status || 'Новая'}
                        </span>
                    </div>
                    <div>${order.amount} USDT</div>
                    <div>${new Date(order.timestamp).toLocaleString()}</div>
                `;
                orderItem.addEventListener('click', () => showOrderDetails(id, order, 'buy'));
                ordersList.appendChild(orderItem);
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки заявок на покупку:', error);
        const ordersList = document.getElementById('buyOrdersList');
        if (ordersList) {
            ordersList.innerHTML = '<p>Произошла ошибка при загрузке заявок</p>';
        }
    }
}

// Загрузка заявок на продажу (исправленная версия)
async function loadSellOrders(page = 1, limit = 10, statusFilter = 'all') {
    try {
        const ordersRef = firebase.database().ref('ordersSale');
        const snapshot = await ordersRef.once('value');
        const orders = snapshot.val();

        const ordersList = document.getElementById('sellOrdersList');
        if (!ordersList) return;

        // Очищаем список только если вкладка активна
        const tabContent = document.getElementById('sell-orders');
        if (tabContent && tabContent.style.display === 'block') {
            ordersList.innerHTML = `
                <div class="admin-filter">
                    <select id="sellStatusFilter">
                        <option value="all">Все статусы</option>
                        <option value="Новая">Новая</option>
                        <option value="В обработке">В обработке</option>
                        <option value="Завершенная">Завершенная</option>
                    </select>
                    <button id="applySellFilter">Применить</button>
                </div>
            `;

            // Устанавливаем выбранный фильтр
            if (statusFilter !== 'all') {
                document.getElementById('sellStatusFilter').value = statusFilter;
            }

            // Обработчики для фильтра
            document.getElementById('applySellFilter').addEventListener('click', () => {
                const filter = document.getElementById('sellStatusFilter').value;
                loadSellOrders(1, 10, filter);
            });

            if (!orders) {
                ordersList.innerHTML += '<p>Нет заявок на продажу</p>';
                return;
            }

            // Преобразуем объект в массив и сортируем по дате (новые сначала)
            let sortedOrders = Object.entries(orders)
                .map(([id, order]) => ({ id, ...order }))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            // Применяем фильтр
            if (statusFilter !== 'all') {
                sortedOrders = sortedOrders.filter(order => {
                    if (statusFilter === 'Новая') return !order.status || order.status === 'Новая';
                    if (statusFilter === 'В обработке') return order.status && order.status.startsWith('В обработке');
                    if (statusFilter === 'Завершенная') return order.status === 'Завершенная';
                    return true;
                });
            }

            if (sortedOrders.length === 0) {
                ordersList.innerHTML += '<p>Нет заявок с выбранным статусом</p>';
                return;
            }

            sortedOrders.forEach(({ id, ...order }) => {
                const orderItem = document.createElement('div');
                orderItem.className = 'admin-order-item';

                // Определяем класс статуса
                let statusClass = 'status-new';
                if (order.status && order.status.startsWith('В обработке')) statusClass = 'status-processing';
                if (order.status === 'Завершенная') statusClass = 'status-completed';

                orderItem.innerHTML = `
                    <div>
                        <strong>${order.firstNameSale || ''} ${order.lastNameSale || ''}</strong>
                        <span class="admin-order-status ${statusClass}">
                            ${order.status || 'Новая'}
                        </span>
                    </div>
                    <div>${order.username_telegramSale || ''}</div>
                    <div>${order.timestamp ? new Date(order.timestamp).toLocaleString() : ''}</div>
                `;
                orderItem.addEventListener('click', () => showOrderDetails(id, order, 'sell'));
                ordersList.appendChild(orderItem);
            });
        }
    } catch (error) {
        console.error('Ошибка загрузки заявок на продажу:', error);
        const ordersList = document.getElementById('sellOrdersList');
        if (ordersList) {
            ordersList.innerHTML = '<p>Произошла ошибка при загрузке заявок</p>';
        }
    }
}
// Показ деталей заказа
function showOrderDetails(id, order, type) {
            try {
                const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
                const currentAdmin = tgUser?.username ? `${tgUser.username}` : 'админ';

                const modal = document.createElement('div');
                modal.className = 'admin-modal';
                modal.innerHTML = `
                    <div class="admin-modal-content">
                        <h3>Заявка ${id}</h3>
                        <p><strong>Статус:</strong> ${order.status || 'Новая'}</p>
                        <p><strong>Имя:</strong> ${order.firstName || order.firstNameSale || 'не указано'}</p>
                        <p><strong>Фамилия:</strong> ${order.lastName || order.lastNameSale || 'не указано'}</p>
                        ${order.walletAddress ? `<p><strong>Кошелек:</strong> ${order.walletAddress}</p>` : ''}
                        ${order.amount ? `<p><strong>Сумма:</strong> ${order.amount} USDT</p>` : ''}
                        <p><strong>Telegram:</strong> ${order.username_telegram || order.username_telegramSale || 'не указан'}</p>
                        <p><strong>Дата:</strong> ${order.timestamp ? new Date(order.timestamp).toLocaleString() : 'не указана'}</p>

                        <div class="admin-actions">
                            <button class="status-btn" data-status="В обработке ${currentAdmin}">В обработку</button>
                            <button class="status-btn" data-status="Завершенная">Завершить</button>
                            <button class="delete-btn">Удалить</button>
                        </div>
                        <button class="close-modal">Закрыть</button>
                    </div>
                `;

                document.body.appendChild(modal);

                // Обработчики событий для кнопок
                modal.querySelectorAll('.status-btn').forEach(btn => {
                    btn.addEventListener('click', async () => {
                        const status = btn.dataset.status;
                        await updateOrderStatus(id, status, type);
                        modal.remove();

                        // Обновляем соответствующий список
                        if (type === 'buy') {
                            await loadBuyOrders();
                        } else {
                            await loadSellOrders();
                        }
                    });
                });

                modal.querySelector('.delete-btn').addEventListener('click', async () => {
                    await deleteOrder(id, type);
                    modal.remove();
                    if (type === 'buy') {
                        await loadBuyOrders();
                    } else {
                        await loadSellOrders();
                    }
                });

                modal.querySelector('.close-modal').addEventListener('click', () => {
                    modal.remove();
                });

            } catch (error) {
                console.error('Ошибка при отображении деталей заказа:', error);
            }
        }

// Обновление статуса заказа
async function updateOrderStatus(id, status, type) {
  try {
    const refPath = type === 'buy' ? 'orders' : 'ordersSale';
    await firebase.database().ref(`${refPath}/${id}/status`).set(status);

    // Показываем уведомление
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = 'Статус обновлен!';
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 2000);
  } catch (error) {
    console.error('Ошибка обновления статуса:', error);
  }
}

// Удаление заказа
async function deleteOrder(id, type) {
  const refPath = type === 'buy' ? 'orders' : 'ordersSale';
  await firebase.database().ref(`${refPath}/${id}`).remove();
  if (type === 'buy') loadBuyOrders();
  else loadSellOrders();
}

// Управление админами
async function loadAdmins() {
  const snapshot = await firebase.database().ref('admins').once('value');
  const admins = snapshot.val();
  const adminList = document.getElementById('adminList');

  adminList.innerHTML = '';
  if (!admins) return;

  Object.entries(admins).forEach(([key, username]) => {
    const adminItem = document.createElement('div');
    adminItem.className = 'admin-item';
    adminItem.innerHTML = `
      <span>@${username}</span>
      <button class="remove-admin" data-key="${key}">Удалить</button>
    `;
    adminList.appendChild(adminItem);
  });

  // Обработчики для кнопок удаления
  document.querySelectorAll('.remove-admin').forEach(btn => {
    btn.addEventListener('click', async () => {
      await firebase.database().ref(`admins/${btn.dataset.key}`).remove();
      loadAdmins();
    });
  });
}

// Добавление нового админа
document.getElementById('addAdminBtn').addEventListener('click', async () => {
  const username = document.getElementById('newAdminInput').value.trim();
  if (!username) return;

  try {
    // Генерируем новый ключ
    const snapshot = await firebase.database().ref('admins').once('value');
    const admins = snapshot.val() || {};
    const newKey = `admin${Object.keys(admins).length + 1}`;

    await firebase.database().ref(`admins/${newKey}`).set(username);
    document.getElementById('newAdminInput').value = '';
    loadAdmins();
  } catch (error) {
    console.error('Error adding admin:', error);
  }
});
        // Слушатель изменений в реальном времени
function setupRealtimeListeners() {
            // Для заказов на покупку
            firebase.database().ref('orders').on('value', () => {
                if (document.getElementById('adminContainer').style.display === 'block') {
                    const activeTab = document.querySelector('.admin-tab.active');
                    if (activeTab && activeTab.dataset.tab === 'buy-orders') {
                        loadBuyOrders();
                    }
                }
            });

            // Для заказов на продажу
            firebase.database().ref('ordersSale').on('value', () => {
                if (document.getElementById('adminContainer').style.display === 'block') {
                    const activeTab = document.querySelector('.admin-tab.active');
                    if (activeTab && activeTab.dataset.tab === 'sell-orders') {
                        loadSellOrders();
                    }
                }
            });
        }

// Вызываем при загрузке
document.addEventListener('DOMContentLoaded', () => {
  setupRealtimeListeners();
});
async function initAdminPanel() {
  try {
    const isAdmin = await checkAdmin();
    if (isAdmin) {
      document.getElementById('adminButton').style.display = 'block';

      // Обработчик для кнопки админ-панели
      document.getElementById('adminButton').addEventListener('click', async () => {
        document.querySelector('.main-container').style.display = 'none';
        document.getElementById('adminContainer').style.display = 'block';

        // Загружаем данные сразу при открытии
        const activeTab = document.querySelector('.admin-tab.active');
        if (activeTab) {
          const tabId = activeTab.dataset.tab;
          if (tabId === 'buy-orders') {
            await loadBuyOrders();
          } else if (tabId === 'sell-orders') {
            await loadSellOrders();
          } else if (tabId === 'admins') {
            await loadAdmins();
          }
        } else {
          // Если нет активной вкладки, загружаем заявки на покупку по умолчанию
          await loadBuyOrders();
        }
      });

      // Обработчик для кнопки "Назад"
      document.getElementById('backButtonAdmin').addEventListener('click', () => {
        document.querySelector('.main-container').style.display = 'block';
        document.getElementById('adminContainer').style.display = 'none';
      });

     // Переключение вкладок
document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', async function() {
        // Убираем активный класс у всех вкладок
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        // Добавляем активный класс текущей вкладке
        this.classList.add('active');

        // Скрываем все содержимое вкладок
        document.querySelectorAll('.admin-tab-content').forEach(c => {
            c.style.display = 'none';
        });

        // Показываем содержимое текущей вкладки
        const tabId = this.dataset.tab;
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
            tabContent.style.display = 'block';

            // Загружаем данные для активной вкладки
            if (tabId === 'buy-orders') {
                await loadBuyOrders();
            } else if (tabId === 'sell-orders') {
                await loadSellOrders();
            } else if (tabId === 'admins') {
                await loadAdmins();
            } else if (tabId === 'course-management') {
                await loadExchangeRates();
            }
        }
    });
});

      // Инициализация слушателей реального времени
      setupRealtimeListeners();
    }
  } catch (error) {
    console.error('Ошибка инициализации админ-панели:', error);
  }
}

// Вызов инициализации при загрузке
document.addEventListener('DOMContentLoaded', initAdminPanel);
        async function updateOrderStatus(id, status, type) {
  try {
    const refPath = type === 'buy' ? 'orders' : 'ordersSale';
    await firebase.database().ref(`${refPath}/${id}/status`).set(status);
    showAdminNotification('Статус успешно обновлен!', 'success');
  } catch (error) {
    console.error(`Ошибка при обновлении статуса заявки ${id}:`, error);
    showAdminNotification('Ошибка при обновлении статуса!', 'error');
  }
}

async function deleteOrder(id, type) {
  try {
    const refPath = type === 'buy' ? 'orders' : 'ordersSale';
    await firebase.database().ref(`${refPath}/${id}`).remove();
    showAdminNotification('Заявка успешно удалена!', 'success');
  } catch (error) {
    console.error(`Ошибка при удалении заявки ${id}:`, error);
    showAdminNotification('Ошибка при удалении заявки!', 'error');
  }
}

function showAdminNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `admin-notification ${type}`;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => notification.remove(), 3000);
}
// Обработчик для кнопки "Все заявки"
document.querySelector('.square-buttons .square-button:nth-child(2)').addEventListener('click', function() {
    document.querySelector('.main-container').style.display = 'none';
    document.getElementById('ordersContainer').style.display = 'block';
    loadUserOrders();
});

// Функция для загрузки заявок пользователя
async function loadUserOrders() {
    const tgUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (!tgUser || !tgUser.username) {
        document.getElementById('userOrdersList').innerHTML = '<p>Не удалось определить ваш Telegram username</p>';
        return;
    }

    const username = tgUser.username;
    const ordersList = document.getElementById('userOrdersList');
    ordersList.innerHTML = '<p>Загрузка ваших заявок...</p>';

    try {
        // Ищем заявки в обоих разделах
        const [buyOrdersSnapshot, sellOrdersSnapshot] = await Promise.all([
            firebase.database().ref('orders').orderByChild('username_telegram').equalTo(username).once('value'),
            firebase.database().ref('ordersSale').orderByChild('username_telegramSale').equalTo(username).once('value')
        ]);

        const buyOrders = buyOrdersSnapshot.val() || {};
        const sellOrders = sellOrdersSnapshot.val() || {};

        if (Object.keys(buyOrders).length === 0 && Object.keys(sellOrders).length === 0) {
            ordersList.innerHTML = '<p>У вас нет активных заявок</p>';
            return;
        }

        let html = '';

        // Обрабатываем заявки на покупку
        Object.entries(buyOrders).forEach(([id, order]) => {
            html += `
                <div class="order-details" style="margin-bottom: 20px;">
                    <h3>Заявка на покупку #${id.substring(0, 8)}</h3>
                    <p><strong>Статус:</strong> <span style="color: ${getStatusColor(order.status)}">${order.status || 'в обработке'}</span></p>
                    <p><strong>Сумма:</strong> ${order.amount} RUB</p>
                    <p><strong>Кошелек:</strong> ${order.walletAddress || 'не указан'}</p>
                    <p><strong>Дата:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                </div>
            `;
        });

        // Обрабатываем заявки на продажу
        Object.entries(sellOrders).forEach(([id, order]) => {
            html += `
                <div class="order-details" style="margin-bottom: 20px;">
                    <h3>Заявка на продажу #${id.substring(0, 8)}</h3>
                    <p><strong>Статус:</strong> <span style="color: ${getStatusColor(order.status)}">${order.status || 'в обработке'}</span></p>
                    <p><strong>Имя:</strong> ${order.firstNameSale} ${order.lastNameSale}</p>
                    <p><strong>Дата:</strong> ${new Date(order.timestamp).toLocaleString()}</p>
                </div>
            `;
        });

        ordersList.innerHTML = html;
    } catch (error) {
        console.error('Ошибка загрузки заявок:', error);
        ordersList.innerHTML = '<p>Произошла ошибка при загрузке ваших заявок</p>';
    }
}

// Функция для определения цвета статуса
function getStatusColor(status) {
    if (!status) return '#FFC107'; // желтый для неизвестного статуса
    status = status.toLowerCase();

    if (status.includes('completed') || status.includes('заверш')) return '#4CAF50'; // зеленый
    if (status.includes('cancelled') || status.includes('отмен')) return '#F44336'; // красный
    if (status.includes('processing') || status.includes('обработ')) return '#2196F3'; // синий
    return '#FFC107'; // желтый по умолчанию
}
    // Функция загрузки текущих курсов
async function loadExchangeRates() {
  try {
    const snapshot = await firebase.database().ref('exchangeRates').once('value');
    const rates = snapshot.val() || {};

    if (rates.buy) {
      document.getElementById('buyRateInput').value = rates.buy;
    }
    if (rates.sell) {
      document.getElementById('sellRateInput').value = rates.sell;
    }
  } catch (error) {
    console.error('Ошибка загрузки курсов:', error);
  }
}

// Функция сохранения курсов
async function saveExchangeRates() {
  try {
    const buyRate = parseFloat(document.getElementById('buyRateInput').value);
    const sellRate = parseFloat(document.getElementById('sellRateInput').value);

    if (isNaN(buyRate) || isNaN(sellRate)) {
      showAdminNotification('Введите корректные значения курсов!', 'error');
      return;
    }

    await firebase.database().ref('exchangeRates').set({
      buy: buyRate,
      sell: sellRate,
      lastUpdated: new Date().toISOString()
    });

    showAdminNotification('Курсы успешно сохранены!', 'success');
  } catch (error) {
    console.error('Ошибка сохранения курсов:', error);
    showAdminNotification('Ошибка при сохранении курсов!', 'error');
  }
}

// Обработчик для кнопки сохранения курсов
document.getElementById('saveRatesBtn').addEventListener('click', saveExchangeRates);

// Обновим функцию переключения вкладок, чтобы загружать курсы при открытии
document.querySelectorAll('.admin-tab').forEach(tab => {
  tab.addEventListener('click', async function() {
    document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');

    document.querySelectorAll('.admin-tab-content').forEach(c => {
      c.style.display = 'none';
    });

    const tabId = this.dataset.tab;
    const tabContent = document.getElementById(tabId);
    if (tabContent) {
      tabContent.style.display = 'block';

      if (tabId === 'buy-orders') {
        await loadBuyOrders();
      } else if (tabId === 'sell-orders') {
        await loadSellOrders();
      } else if (tabId === 'admins') {
        await loadAdmins();
      } else if (tabId === 'course-management') {
        await loadExchangeRates();
      }
    }
  });
});