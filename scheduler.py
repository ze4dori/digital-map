import logging
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from tasks.scheduler import job

# Настроим логирование
logging.basicConfig(filename="scheduler.log", level=logging.DEBUG)

scheduler = BackgroundScheduler()

# Добавляем задачу
scheduler.add_job(
    func=job,
    trigger=CronTrigger(hour=12, minute=0),
    id="fetch_news",
    name="Обновление новостей каждый день в 12:00",
    replace_existing=True
)

# Логирование старта планировщика
logging.info("Запуск планировщика...")

try:
    scheduler.start()
    logging.info("Планировщик запущен.")
    while True:
        pass
except Exception as e:
    logging.error(f"Ошибка при запуске планировщика: {e}")
