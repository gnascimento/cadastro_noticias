'''Application error handlers.'''
from exceptions.ValidationException import ValidationException
from flask import Blueprint, jsonify, make_response

errors = Blueprint('errors', __name__)


@errors.app_errorhandler(ValidationException)
def handle_validation_error(error: ValidationException):
    status_code = 400
    message = []
    if error.id is not None:
        message = [{ 'id': error.id, 'message': error.message}]
    else:
        message = error.list_of_errors

    error = {'type': error.__class__.__name__,
             'details': message}
    json_object = jsonify(status='Error', message='Ocorreu um erro inesperado.', error=error)

    return make_response(json_object, status_code)


@errors.app_errorhandler(Exception)
def handle_unexpected_error(error):
    status_code = 500
    message = [str(x) for x in error.args]
    error = { 'type': error.__class__.__name__,
               'details': message }
    json_object = jsonify(status='Error', message='Ocorreu um erro inesperado.', error=error)

    return make_response(json_object, status_code)
