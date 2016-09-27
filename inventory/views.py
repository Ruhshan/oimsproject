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
#from django.core.urlresolvers import reverse
#imported models

from .models import InventoryTable, PendingRequest, ProcessedRequest
# Create your views here.
def user_login(request):
	#context=RequestContext(request)
	if request.method=='POST':
		email=request.POST['email']
		password=request.POST['password']
		password2=request.POST['password2']

		u=User.objects.get(username=email)
		g=str(u.groups.all()[0])

		

		if g=="head":
			if password2=="9800":
				user=authenticate(username=email,password=password)
			else:
				return HttpResponse("Invalid Seccondary password")
		else:
			user=authenticate(username=email,password=password)

		

		if user is not None:
			if user.is_active:
				login(request,user)
				return HttpResponseRedirect("/home/")	
			else:
				return HttpResponse("Your OIMS account is disabled.")
		else:
			return HttpResponse("Invalid login")
	else:
		return render(request,'inventory/login.html', {})

def view_home(request):
	if request.user.is_authenticated():
		inv=InventoryTable.objects.all()
		g=request.user.groups.all()[0]
		item_names=InventoryTable.objects.values('item_name')

		processed=ProcessedRequest.objects.filter(acknowledgement=0)

		requestee_suggestion=ProcessedRequest.objects.values_list('requestee',flat=True)

		pending=PendingRequest.objects.raw('''select inventory_pendingrequest.id_no, 
													quantity_inside,
													requested_quantity,
													requestee,
													inventory_inventorytable.item_name, 
													inventory_pendingrequest.description 
													from 
													inventory_inventorytable 
													inner join
													inventory_pendingrequest on
													inventory_inventorytable.item_name=inventory_pendingrequest.item_name''')
		
		#return render(request, 'inventory/t.html',{'inv':inv, 'item_names':item_names,'pending':pending,'processed':processed})
		return render(request, 'inventory/home.html',{'inv':inv,'item_names':item_names,'pending':pending,'processed':processed, 'group':g, 'requestee':requestee_suggestion})
	else:
		return render(request, 'inventory/unloggedhome.html',)

@login_required
def user_logout(request):
	logout(request)
	return HttpResponseRedirect("/home/")

@login_required
def itemqty(request):
	name=request.GET['requested_name']
	qty=int(InventoryTable.objects.get(item_name=str(name)).quantity_inside)
	s=""
	for i in range(1,qty+1):
		s+="""<option value="{}">{}</option>\n""".format(i,i)

	return HttpResponse(s)

@login_required
def place_request(request):
	if request.method=='POST':
		nitem_name=request.POST['requested_item_name_dropdown']
		nrequested_quantity=request.POST['requested_quantity']
		nrequestee=request.POST['requestee']
		nstore_manager=request.user.username
		ndescription=request.POST['description']

		p=PendingRequest(item_name=nitem_name, requested_quantity=nrequested_quantity,requestee=nrequestee,store_manager=nstore_manager, description=ndescription)
		p.save()

		quantity_inside=InventoryTable.objects.get(item_name=nitem_name).quantity_inside

		print nitem_name, nrequestee, quantity_inside, nrequested_quantity,ndescription

		parameters={'item_name':nitem_name, 'requestee':nrequestee, 'quantity_inside':quantity_inside,'requested_quantity':nrequested_quantity,'description':ndescription}

		f=file('inventory/templates/inventory/newrequest.html').read()
		
		#print render_to_string('inventory/newrequest.html',{'parameters':parameters})
		f=f.format(nitem_name,nrequestee,nrequested_quantity,quantity_inside,ndescription)


		return HttpResponse(f)



	#request.user.groups.all()[0]
@login_required
def process_request(request):
	if request.method=='POST':
		req_id=request.POST['requested_id']
		decesion=request.POST['decesion']
		value=request.POST['value']

		p=PendingRequest.objects.get(id_no=req_id)

		nid_no=req_id
		nitem_name=p.item_name
		nrequested_quantity=p.requested_quantity
		nrequestee=p.requestee
		nstore_manager=p.store_manager
		ndescription=p.description
		ndate_of_request=p.date_of_request

		nprocessed_by=request.user.username
		

		q=ProcessedRequest(id_no=nid_no, requestee=nrequestee, item_name=nitem_name, requested_quantity=nrequested_quantity, approved_quantity=value,store_manager=nstore_manager, description=ndescription, date_of_request=ndate_of_request,processed_by = nprocessed_by,action=decesion)
		q.save()

		p.delete()

		if decesion=="approve":
			i=InventoryTable.objects.get(item_name=nitem_name)
			i.quantity_inside-=int(value)
			i.quantity_outside+=int(value)
			i.save()

		print nrequestee





@login_required
def availqty(request):
	name=request.GET['requested_name']
	qty=int(InventoryTable.objects.get(item_name=str(name)).quantity_inside)
	
	return HttpResponse("Available:"+str(qty))

@login_required
def generateoptions(request):
	qty=int(request.GET['given_qty'])
	s=""
	for i in range(qty,0,-1):
		s+="""<option value="{}">{}</option>\n""".format(i,i)
	return HttpResponse(s)

@login_required
def acknowledge(request):
	if request.method=='POST':
		req_id=request.POST['requested_id']
		req_id=req_id.replace("processed_req_panel","")

		p=ProcessedRequest.objects.get(id_no=req_id)
		p.acknowledgement=1
		p.save()

@login_required
def item_details(request, name):

	item=InventoryTable.objects.get(item_name=name)

	remaining= ((float(item.quantity_inside)-float(item.quantity_outside))/item.quantity_inside)*100

	details=ProcessedRequest.objects.filter(item_name=name, action='approve', acknowledgement=1)



	return render(request, 'inventory/item_details.html',{'item':item, 'details':details, 'remaining':int(remaining)})


def isadmin(request):
	if request.method=='POST':
		email=request.POST["email"]
		u=User.objects.get(username=email)
		g=str(u.groups.all()[0])
		if g=='head':
			return HttpResponse(1)
		else:
			return HttpResponse(0)

