from flask import jsonify, make_response


def json_response(status, message, body):
    json_obj = jsonify(status= 'OK', message= message, content= body)
    return make_response(json_obj, status)