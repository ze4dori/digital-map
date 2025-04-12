import schedule
import time
from app.parser.fetcher import fetch_posts
from app.parser.xml_writer import write_to_xml

def job():
    url = "https://anton-nemkin.ru/digital_russia"
    posts = fetch_posts(url)
    if posts:
        write_to_xml(posts, "posts.xml")
        print("Новости обновлены.")
    else:
        print("Не удалось получить новости.")

# def start_scheduler():
#     """Планирование задач"""
#     schedule.every(5).minutes.do(job)
#     while True:
#         schedule.run_pending()
#         time.sleep(1)
