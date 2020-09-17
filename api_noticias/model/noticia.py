from model.serializable_model import SerializableModel
from datetime import date, datetime


class Noticia(SerializableModel):
    _id = None
    _titulo = None
    _conteudo = None
    _data_publicacao = None

    def get_id(self):
        return self._id

    def set_id(self, id):
        if (type(id) is str):
            self._id = id
        else:
            raise Exception('Tipo inválido')
    
    def get_titulo(self):
        return self._titulo

    def set_titulo(self, titulo):
        if (type(titulo) is str):
            self._titulo = titulo
        else:
            raise Exception('Tipo inválido')

    def get_conteudo(self):
        return self._conteudo

    def set_conteudo(self, conteudo):
        if (type(conteudo) is str):
            self._conteudo = conteudo
        else:
            raise Exception('Tipo inválido')
    
    def get_data_publicacao(self):
        return self.data_publicacao
    
    def set_data_publicacao(self, data_publicacao):
        if (isinstance(data_publicacao, date)):
            self._data_publicacao = datetime(data_publicacao.year, data_publicacao.month, data_publicacao.day, 0, 0, 0)
        elif (isinstance(data_publicacao, datetime)):
            self._data_publicacao = data_publicacao
        elif (type(data_publicacao) is str):
            try:
                self._data_publicacao = datetime.strptime(data_publicacao, '%Y-%m-%dT%H:%M:%S.%f%z')
            except ValueError as e:
                try:
                    self._data_publicacao = datetime.strptime(data_publicacao, '%Y-%m-%dT%H:%M:%S.%f')
                except ValueError as e:
                    raise ValueError('Data de publicação inválida')
        else:
            raise Exception('Tipo da data de publicação inválido')
    
    def __dir__(self):
        return ['_id', '_titulo', '_conteudo', '_data_publicacao']


    
    