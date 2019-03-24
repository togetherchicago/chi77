import json

def extract_data_request(request):
    """
    Extract category and query from request
    
    Arguments:
        request {Request} -- Django request
    """
    if request.method == 'GET':
        return request.GET['resource'], request.GET['category'], json.loads(request.GET['query'])
    elif request.method == 'POST':
        return request.GET['resource'], request.POST['category'], json.loads(request.POST['query'])
    return None