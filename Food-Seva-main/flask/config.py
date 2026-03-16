from dotenv import load_dotenv
from datetime import timedelta

load_dotenv()
import os
class AppConfig:
    SECRET_KEY=os.environ['SECRET_KEY']
    DEBUG = True
    port=8080