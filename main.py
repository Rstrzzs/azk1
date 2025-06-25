import os
import logging
import time

import telebot
from telebot.types import ReplyKeyboardMarkup, KeyboardButton
from web3 import Web3
from eth_account import Account
import requests

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO
)
logger = logging.getLogger(__name__)

# Конфигурация
TOKEN = '8191840337:AAHnIR4r4NMFqeUxnQyuAM5Ruqsx1g3uJKQ'
INFURA_URL = '01063d1643764a949d720d2ff4a8e3a6'
AML_API_KEY = os.getenv('AML_API_KEY')

# Инициализация бота
bot = telebot.TeleBot(TOKEN)

# Инициализация Web3
w3 = Web3(Web3.HTTPProvider(INFURA_URL)) if INFURA_URL else None

# База данных курсов
COURSES = {
    'crypto_basics': {
        'title': 'Основы криптовалют и блокчейна',
        'description': 'Изучите основы технологии блокчейн и криптовалют.',
        'price': 50
    },
    'defi_advanced': {
        'title': 'Продвинутый DeFi',
        'description': 'Углубленный курс по децентрализованным финансам.',
        'price': 150
    },
    'nft_mastery': {
        'title': 'Мастерство NFT',
        'description': 'Все что нужно знать о невзаимозаменяемых токенах.',
        'price': 100
    }
}

# Состояния пользователей
user_states = {}

user_activity = {}


def check_flood(chat_id):
    """Проверяет, не флудит ли пользователь"""
    current_time = time.time()

    if chat_id not in user_activity:
        user_activity[chat_id] = {'count': 1, 'time': current_time}
        return False

    # Если прошло больше 5 секунд - сбрасываем счетчик
    if current_time - user_activity[chat_id]['time'] > 5:
        user_activity[chat_id] = {'count': 1, 'time': current_time}
        return False

    user_activity[chat_id]['count'] += 1

    # Если больше 3 сообщений за 5 секунд - флуд
    if user_activity[chat_id]['count'] > 3:
        # Блокируем на 10 секунд
        user_activity[chat_id]['time'] = current_time + 10
        return True

    return False

# Главное меню
def main_menu():
    markup = ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    markup.add(
        KeyboardButton("🏦 О нас"),
        KeyboardButton("📊 Курсы"),
        KeyboardButton("✅ AML проверка кошелька"),
        KeyboardButton("🛠️ Связаться с нами"),
        KeyboardButton("📊 Биржа"),

    )
    return markup


# Меню курсов
def courses_menu():
    markup = ReplyKeyboardMarkup(resize_keyboard=True, row_width=1)
    for course_id, course in COURSES.items():
        markup.add(KeyboardButton(f"{course['title']} - {course['price']} USDT"))
    markup.add(KeyboardButton("Назад ↩️"))
    return markup


# Меню кошелька
def wallet_menu():
    markup = ReplyKeyboardMarkup(resize_keyboard=True, row_width=2)
    markup.add(
        KeyboardButton("Пополнить ↗️"),
        KeyboardButton("Отправить ↘️"),
        KeyboardButton("Обменять 💱"),
        KeyboardButton("История транзакций 📜"),
        KeyboardButton("Назад ↩️")
    )
    return markup


# Обработчик команды /start
@bot.message_handler(commands=['start'])
def start(message):
    user = message.from_user
    bot.send_message(
        message.chat.id,
        f'Добро пожаловать в Mosca\n\n📍 Москва, Пресненская набережная 12, Башня Федерация. Восток, этаж 11\n\n'
        f'📅 Мы работаем для вас 24/7. Без обеда и выходных.\n\n💵 Мы работаем только за наличные рубли.\n\n💹 Самый низкий курс на покупку USDT и лучший курс покупки USDT в Москве.\n\n'
        f'🤑 Отсутствие каких либо комиссии на покупку и продажу USDT\n\nДля покупки USDT нажмите на кнопку "Обмен"',
        reply_markup=main_menu()
    )

def get_exchange_rate(base="USD", target="UAH"):
    url = f"https://api.exchangerate-api.com/v4/latest/{base}"
    try:
        response = requests.get(url)
        data = response.json()
        return data["rates"].get(target)
    except Exception as e:
        return {"error": str(e)}


# Обработчик текстовых сообщений
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    chat_id = message.chat.id

    if check_flood(chat_id):
        bot.send_message(chat_id, "Мы обнаружили подозрительную активность. Пожалуйста, подождите 10 секунд.")
        return

    text = message.text

    if text == "🏦 О нас":
        show_about(message)
    elif text == "📊 Курсы":
        show_courses(message)
    elif text == "✅ AML проверка кошелька":
        start_aml_check(message)
    elif text == "🛠️ Связаться с нами":
        show_contact(message)
    elif text == "📊 Биржа":
        show_exchange(message)
    elif text == "Назад ↩️":
        back_to_main(message)
    else:
        bot.send_message(chat_id, "Пожалуйста, используйте меню для навигации.", reply_markup=main_menu())


# Показать курсы
def show_courses(message):
    bot.send_message(
        message.chat.id,f'Курс обмена рублей на USDT:\n\nКупить 1 USDT = {get_exchange_rate("USD", "RUB")+1} RUB\nПродать 1 USDT = {get_exchange_rate("USD", "RUB")-1} RUB\n\n*данный курс является биржевым и меняется каждую минуту. '
                        '\n\nКоммисия 3$ за вывод USDT в сети Tron.\n\nДля получения пропуска к нам в офис и покупки USDT, вам нужно создать заявку - нажмите на кнопку "Обмен"',
        parse_mode='HTML',
        reply_markup=main_menu()
    )



# Начать AML проверку
def start_aml_check(message):
    user_states[message.chat.id] = 'waiting_wallet'
    markup = ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(KeyboardButton("Назад ↩️"))

    bot.send_message(
        message.chat.id,
        "Введите адрес криптовалютного кошелька для AML проверки:",
        reply_markup=main_menu()
    )


# Обработать адрес кошелька


# AML проверка (заглушка)
def perform_aml_check(wallet_address: str) -> dict:
    try:
        # Здесь должен быть реальный запрос к AML API
        return {
            'risk_score': 'low',
            'is_risky': False,
            'details': 'Не обнаружено подозрительной активности'
        }
    except Exception as e:
        logger.error(f"AML check error: {e}")
        return {
            'risk_score': 'unknown',
            'is_risky': False,
            'details': 'Не удалось выполнить проверку'
        }


# Показать биржу
def show_exchange(message):
    markup = ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(KeyboardButton("Обменять 💱"))
    markup.add(KeyboardButton("Назад ↩️"))

    bot.send_message(
        message.chat.id,'С радостью сообщаем вам об открытии криптовалютной биржи Mosca! 🎉\n\n🌐 https://moscaex.org\n\n'
                        'Мы стремимся предоставить нашим клиентам лучший сервис и надежные инструменты для успешной торговли. \n\n'
                        'Наша команда всегда на связи!\n\nПрисоединяйтесь к нам и откройте новые горизонты в мире криптовалют! 🚀',
        parse_mode='HTML',
        reply_markup=main_menu()
    )





# Показать информацию о нас
def show_about(message):
    markup = ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(KeyboardButton("Назад ↩️"))

    bot.send_message(
        message.chat.id, "🤖 О нас\n\nДобро пожаловать в наш бот для обмена криптовалюты!\n\n💰 Мы занимаемся обменом криптовалют более 3х лет.\n\n📅 Мы работаем для вас 24/7."
                         "\n\n💵 Мы работаем только за наличные рубли.\n\n💹 У нас вы можете купить USDT без комиссии по самому лучшему курсу в Москве.  "
                         "\n\nКомиссия 3$ за вывод USDT в сети Tron.\n\n адрес: Москва, Пресненская набережная 12, Башня Федерация. Восток, этаж 11\n\nДля получения пропуска к нам в офис и покупки USDT, вам нужно создать заявку через приложение",
        parse_mode='HTML',
        reply_markup=main_menu()
    )


# Показать контакты
def show_contact(message):
    markup = ReplyKeyboardMarkup(resize_keyboard=True)
    markup.add(KeyboardButton("Назад ↩️"))

    bot.send_message(
        message.chat.id,
        'Наши операторы на связи 24/7 и готовы ответить на любые ваши вопросы.\n\nДля связи с нами напишите  - @Mosca67_Support\n\n'
        'Для получения пропуска к нам в офис и покупки USDT, вам нужно создать заявку - нажмите на кнопку "Обмен"',
        parse_mode='HTML',
        reply_markup=main_menu()
    )


# Вернуться в главное меню
def back_to_main(message):
    bot.send_message(
        message.chat.id,
        "Главное меню:",
        reply_markup=main_menu()
    )


# Запуск бота
if __name__ == '__main__':
    logger.info("Бот запущен...")
    bot.infinity_polling()