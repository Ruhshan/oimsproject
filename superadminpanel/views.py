from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib.auth.models import Group

from django.http import HttpResponseRedirect, HttpResponse
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib.auth.decorators import login_required
from django.template.loader import render_to_string
from django.template import loader
from django.core.exceptions import ObjectDoesNotExist
from functions import * 
from django.views.static import serve
#from django.core.urlresolvers import reverse
#imported models
import os
# Create your views here.
def superadmin_home(request):
	if request.user.is_authenticated():
		if request.method=='POST':
			currency= request.POST['currency']
			orgname=request.POST['org']
			refresh=request.POST['refresh']
			timeout=request.POST['timeout']
			setinfo(currency, orgname, refresh, timeout)
		
		info=getinfo()
		return render(request, 'superadminpanel/home.html',{'info':info})
	else:
		return HttpResponseRedirect("/superadminlogin/")

def superadmin_login(request):
	if request.method=='POST':
		uname=request.POST['suname']
		password=request.POST['password']

		user=authenticate(username=uname,password=password)

		if user is not None:	
			if user.is_active:
				login(request,user)
				 
				return HttpResponseRedirect("/superadminpanel/")	
			else:
				return HttpResponse("Your OIMS account is disabled.")
		else:
			return HttpResponse("Invalid login")
	else:
		return render(request,'superadminpanel/login.html')

def superadmin_export(request):
	if request.method=='POST':
		print "hehe"
	else:
		os.system("python manage.py dumpdata inventory auth.user > exports/inventory.json")
		filepath = 'exports/inventory.json'
		return serve(request, os.path.basename(filepath), os.path.dirname(filepath))

def superadmin_flush(request):
	os.system("python manage.py flush")
	user = User.objects.create_user('superuser', '', 'superuser1234')

	return HttpResponseRedirect('/superadminlogin/')
