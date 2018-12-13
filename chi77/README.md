# chi77 Main Django Application 

Here you will find the root of Django server that runs our backend. 

Two important files here: 

settings.py:  defines configuration for Django. Note that we are using two Django apps, `chicagomap` and `getdata`. For specifics for how those work, please see their respective READMEs. 

urls.py: defines our API routes. 

General Notes: 
While we currently have two Django applications, we realized that the separation is probably unnecessary. 

We also recommend placing the `migrations` folders in the `.gitignore`. This caused us a bit of grief when we made conflicting changes to our models. 

