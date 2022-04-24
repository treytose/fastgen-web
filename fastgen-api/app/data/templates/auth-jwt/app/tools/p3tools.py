import traceback, os

def excHandler(func):
    def inner(self, *args, **kwargs):
        try:
            resp = func(self, *args, **kwargs)
            return resp
        except KeyError as ke:
            self.log_error('KeyError: ' + str(traceback.format_exc()))
            return {'error': 8, 'message': f'KeyError in API - Make sure you are passing the proper JSON object with correctly named keys! Error: {str(ke)}', 'data': {}}
        except Exception as e:
            self.log_error('API exception occured: ' + str(traceback.format_exc()))
            return {'error': 6, 'message': 'An unknown error occured', 'data': {}}
    return inner