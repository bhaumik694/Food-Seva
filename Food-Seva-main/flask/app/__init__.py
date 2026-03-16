from flask import Flask
from flask_cors import CORS
from os import path
from .routes import routes
from config import AppConfig
cors=CORS(origins="http://localhost:5173",supports_credentials=True)
def create_app():
    app=Flask(__name__)
    app.config.from_object(AppConfig)
    cors.init_app(app)
    app.register_blueprint(routes)
    return app