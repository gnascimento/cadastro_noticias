class ValidationException(Exception):
    id = None
    message = None
    list_of_errors = []

    def __init__(self, id=None, message=None, list_of_errors=[]):
        self.id = id
        self.message = message
        self.list_of_errors = list_of_errors

    @staticmethod
    def from_wt_forms(form):
        list_of_errors = []
        for k, m in form.errors.items():
            list_of_errors.append({'id': k, 'message': m})
        return ValidationException(list_of_errors=list_of_errors)
