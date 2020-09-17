#	-*-	coding:	utf-8	-*-
from flask import Flask, request, render_template, redirect
#	config	import
from config import app_config, app_active
# import config
import wtforms_json
from flask_pymongo import PyMongo
from flask_cors import CORS

config = app_config[app_active]
mongodb: PyMongo


def get_mongo_connection():
    return mongodb


def create_app(config_name):
    global mongodb
    app = Flask(__name__, template_folder='templates')
    CORS(app)
    app.secret_key = config.SECRET
    app.config.from_object(app_config[config_name])
    app.config.from_pyfile('config.py')
    app.config['PYMONGO_DATABASE_URI'] = config.PYMONGO_DATABASE_URI
   
    mongodb = PyMongo(app, uri=app.config['PYMONGO_DATABASE_URI'])

    #compatibilidade com wtforms json
    wtforms_json.init()

    from handlers import error_handler
    app.register_blueprint(error_handler.errors, url_prefix='/error')
    from controller import noticia_controller
    app.register_blueprint(noticia_controller.noticia_blueprint, url_prefix='/noticia')
    


    @app.route('/')
    def index():
        from model.noticia import Noticia
        noticia = Noticia()
        noticia.set_conteudo('Teste 2')
        noticia.set_titulo('titulo')
        noticia.set_data_publicacao('2020-05-01')

        global mongodb
        #result = mongodb.db.noticias.insert_one(noticia.as_dict())
        #noticia.set_id(str(result.inserted_id))
      
        return noticia.as_dict()
    

    return app

