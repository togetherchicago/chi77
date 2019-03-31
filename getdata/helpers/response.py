from django.http import JsonResponse

STATUS_OK = 200
STATUS_NOT_FOUND = 404
STATUS_FORBIDDEN = 403
STATUS_BAD_REQUEST = 400
STATUS_SERVER_ERROR = 500

def respondJSON(status, message, data = None, status_code=200):
    data = {
        'status': status,
        'message': message
    }
    if data: data['data'] = data
    return JsonResponse(data, status=status_code, safe=False)