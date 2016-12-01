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
from django.core.files.storage import FileSystemStorage

from inventory.models import SeccondaryPassword, UserProfile, LoginHistory

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
				l=LoginHistory(action="Login", user_name=request.user.username) 
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
		os.system("python manage.py dumpdata inventory auth.user auth.group > exports/inventory.json")
		filepath = 'exports/inventory.json'
		return serve(request, os.path.basename(filepath), os.path.dirname(filepath))

def superadmin_flush(request):
	os.system("python manage.py flush --noinput")
	user = User.objects.create_user('superuser', '', 'superuser1234',is_superuser=True, is_staff=True)
	user.save()
	
	

	return HttpResponseRedirect('/superadminlogin/')

def superadmin_import(request):
	if request.method == 'POST' and request.FILES['myfile']:
		myfile = request.FILES['myfile']
		fs = FileSystemStorage()
		filename = fs.save(myfile.name, myfile)
		uploaded_file_url = fs.url(filename)
		
		m=import_from_json(uploaded_file_url)
		return render(request, 'superadminpanel/dbimport.html',{'message':m})
	return render(request, 'superadminpanel/dbimport.html')

def superadmin_changepass(request):
	if request.method=="POST":
		oldp=request.POST['oldp']
		newp=request.POST['newp']

		u=User.objects.get(username = 'superuser')

		if u.check_password(oldp)==False:
			return HttpResponse("wrong password")
		u.set_password(newp)
		u.save()
		return HttpResponse("ok")

def superadmin_create(request):
	if request.method=="POST":
		email=request.POST['email']
		nick=request.POST['nick']
		pwd1=request.POST['pwd1']
		pwd2=request.POST['pwd2']
		pwds=request.POST['pwds']

		u=User.objects.get(username = 'superuser')

		if u.check_password(pwds)==False:
			return HttpResponse("wrong password")
		try:
			newuser= User.objects.create_user(username=email, email=email, password=pwd1,is_staff=True)
			newuser.save()
			
		except Exception as e:
			if e=="UNIQUE constraint failed: auth_user.username":
				return HttpResponse("exists")
			else:
				u=User.objects.get(username=email)
				u.delete()
				return HttpResponse(e) 


		new=User.objects.get(username=email)
		print new
		Group.objects.get_or_create(name='head')
		g = Group.objects.get(name="head")
		if SeccondaryPassword.objects.filter(user_name=email).exists()==False:
			sp=SeccondaryPassword(user_name=email,value=pwd2)
			sp.save()
		if UserProfile.objects.filter(uname=u).exists()==False:
			profile=UserProfile(uname=u, created_by="superuser",nick_name=nick)
			profile.save()

		g.user_set.add(new)
		g.save()

		return HttpResponse("ok")
