import os
import requests
import logging
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
from config import Config
import time

logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

file_path = os.path.join(os.path.dirname(__file__), '../static/posts.xml')

def get_first_sentence(link, retries=3):
    """Функция для получения первых 22 слов из текста новости с обработкой ошибок"""
    attempt = 0
    while attempt < retries:
        try:
            response = requests.get(
                Config.BASE_URL,
                params={"api_key": Config.API_KEY, "url": link, "render": "true"}
            )
            if response.status_code == 200:
                soup = BeautifulSoup(response.content, 'html.parser')
                first_paragraph = soup.find('div', class_='t-redactor__text')
                if first_paragraph:
                    text = first_paragraph.get_text(separator=" ", strip=True)
                    words = text.split()
                    if words:
                        return " ".join(words[:21]) + "..." if len(words) > 25 else text
                logging.warning(f"Не удалось найти текст на странице: {link}")
                return ""
            elif response.status_code == 500:
                logging.error(f"Ошибка 500 при загрузке страницы {link}. Попытка повторного запроса...")
                attempt += 1
                time.sleep(2)  # Задержка перед повторной попыткой
            else:
                logging.error(f"Ошибка загрузки страницы {link}: {response.status_code}")
                return ""
        except Exception as e:
            logging.error(f"Ошибка при извлечении текста из {link}: {e}")
            return ""

    logging.error(f"Ошибка 500 не была устранена после {retries} попыток для страницы {link}")
    return ""


def fetch_posts(url):
    """Функция для получения постов через ScraperAPI"""
    try:
        # Читаем последнюю сохраненную новость
        last_title, last_link = None, None
        if os.path.exists(file_path):
            try:
                tree = ET.parse(file_path)
                root = tree.getroot()
                first_post = root.find('post')
                if first_post is not None:
                    last_title = first_post.find('title').text if first_post.find('title') is not None else None
                    last_link = first_post.find('link').text if first_post.find('link') is not None else None
            except Exception as e:
                logging.error(f"Ошибка чтения XML-файла: {e}")

        response = requests.get(
            Config.BASE_URL,
            params={"api_key": Config.API_KEY, "url": url, "render": "true"}
        )
        if response.status_code != 200:
            logging.error(f"Ошибка загрузки страницы: {response.status_code}")
            return []

        soup = BeautifulSoup(response.content, 'html.parser')
        posts = soup.find_all('li', class_='js-feed-post')

        fetched_posts = []
        if posts:
            for post in posts[:4]:  # Берем только 4 поста
                title = post.find('div', class_='js-feed-post-title').get_text(strip=True)
                link = post.find('a', class_='t-feed__link')['href']
                date = post.find('span', class_='js-feed-post-date').get_text(strip=True)

                image_tag = post.find('div', class_='t-feed__post-bgimg')
                image_url = image_tag['data-original'] if image_tag else 'Нет изображения'


                # Проверяем, совпадает ли первая новость с последней сохраненной
                if last_title == title and last_link == link:
                    logging.info("Новости не изменились, парсинг пропущен.")
                    return []

                first_sentence = get_first_sentence(link)

                fetched_posts.append({
                    "title": title,
                    "link": link,
                    "date": date,
                    "image_url": image_url,
                    "first_sentence": first_sentence
                })

        return fetched_posts
    except Exception as e:
        logging.error(f"Ошибка выполнения скрипта: {e}")
        return []
