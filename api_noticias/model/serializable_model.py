from datetime import datetime, date
class SerializableModel:
    def as_dict(self, include_id = False):
        dictionary = {c: getattr(self, c) for c in dir(self)}
        if (include_id == False):
            dictionary = { k:v for (k, v) in dictionary.items() if k != '_id'}

        #remove primeiro underscore das chaves, exceto o id
        remove_start_underscore = lambda k: k[1:] if k.startswith('_') and k != '_id' else k
        dictionary = { remove_start_underscore(k): v for (k,v) in dictionary.items()}
        
        #trata objetos filhos
        convert_to_json = lambda v : v.as_dict() if isinstance(v, SerializableModel) else v
        dictionary = {c: convert_to_json(v) for c,v in dictionary.items()}

        #trata datas datetime para o format %Y-%m-%d %H:%M:%S
        convert_datetime = lambda v : v.strftime( '%Y-%m-%dT%H:%M:%S.%f%z') if isinstance(v, datetime) else v
        dictionary = {c: convert_datetime(v) for c,v in dictionary.items()}

        #trata datas date para o format %Y-%m-%d
        convert_date = lambda v : v.strftime('%Y-%m-%d') if isinstance(v, date) else v
        dictionary = {c: convert_date(v) for c,v in dictionary.items()}

        return dictionary