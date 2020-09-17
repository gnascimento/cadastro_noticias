from flask import Blueprint, request, redirect, render_template
from model.noticia import Noticia
from wtforms import Form, StringField, DateTimeField, IntegerField, validators
from exceptions.ValidationException import ValidationException
from utils.controllers_util import json_response
from app import get_mongo_connection
from bson.objectid import ObjectId


class NoticiaForm(Form):
    titulo = StringField('titulo', [validators.Length(min=4, max=40, message='O campo "titulo" precisa ter entre 4 e 40 caracteres')])
    conteudo = StringField('conteudo', [validators.Length(min=6, max=250, message='O campo "conteudo" precisa ter entre 6 e 250 caracteres')])
    data_publicacao = DateTimeField('data_publicacao', format='%Y-%m-%dT%H:%M:%S.%f%z')


class QueryForm(Form):
    query = StringField('query')
    skip = IntegerField('skip')
    limit = IntegerField('limit')


noticia_blueprint = Blueprint('noticia', __name__)


@noticia_blueprint.route('/', methods=['POST'])
def salvar_noticia():
    form = NoticiaForm.from_json(request.json)
    if (form.validate()):
        noticia = Noticia()
        noticia.set_titulo(form.titulo.data)
        noticia.set_conteudo(form.conteudo.data)
        noticia.set_data_publicacao(form.data_publicacao.data)

        mongodb = get_mongo_connection()
        result = mongodb.db.noticias.insert_one(noticia.as_dict())
        noticia.set_id(str(result.inserted_id))
        return noticia.as_dict(include_id=True)
    else:
        raise ValidationException.from_wt_forms(form)


@noticia_blueprint.route('/<string:id>', methods=['PUT'])
def atualizar_noticia(id):
    form = NoticiaForm.from_json(request.json)
    if (form.validate()):
        noticia = Noticia()
        noticia.set_titulo(form.titulo.data)
        noticia.set_conteudo(form.conteudo.data)
        noticia.set_data_publicacao(form.data_publicacao.data)

        mongodb = get_mongo_connection()
        result = mongodb.db.noticias.replace_one({ "_id" : {"$eq" : ObjectId(id)}}, noticia.as_dict())
        return noticia.as_dict(include_id=True)
    else:
        raise ValidationException.from_wt_forms(form)


@noticia_blueprint.route('/', methods=['GET'])
def obter_noticias():
    query = request.args.get('q')
    skip = request.args.get('skip')
    limit = request.args.get('limit')

    mongodb = get_mongo_connection()
    search = { "$or": [{ 
        "titulo": { "$regex": query, "$options": "i" }
    }, { 
        "conteudo": { "$regex": query, "$options": "i" }
    }]}
    results = mongodb.db.noticias.find(search)
    
    count = results.count()

    if skip is not None and limit is not None and int(limit) > 0:
        results = results.skip(int(skip)).limit(int(limit))


    list_result = []
    for row in results:
        noticia = Noticia()
        noticia.set_titulo(row['titulo'])
        noticia.set_conteudo(row['conteudo'])
        noticia.set_data_publicacao(row['data_publicacao'])
        noticia.set_id(str(row['_id']))
        noticia_dic = noticia.as_dict(include_id=True)
        list_result.append(noticia_dic)
    return { "results": list_result, "num_elems": count }


@noticia_blueprint.route('/<string:id>', methods=['GET'])
def obter_noticia(id):
    mongodb = get_mongo_connection()
    result = mongodb.db.noticias.find_one({ "_id" : ObjectId(id)})

    noticia = Noticia()
    noticia.set_titulo(result['titulo'])
    noticia.set_conteudo(result['conteudo'])
    noticia.set_data_publicacao(result['data_publicacao'])
    noticia.set_id(str(result['_id']))
    return noticia.as_dict(include_id=True)


@noticia_blueprint.route('/<string:id>', methods=['DELETE'])
def apagar_noticia(id):
    mongodb = get_mongo_connection()
    result = mongodb.db.noticias.delete_one({ "_id" : ObjectId(id)})
    message = { "status" : "ok" }
    return message