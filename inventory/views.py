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

from .models import InventoryTable, PendingRequest, ProcessedRequest, UserProfile, Vendor
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
		#finding date range for history display
		acknowledged=ProcessedRequest.objects.filter(acknowledgement=1)
		l=acknowledged.count()
		s=str(acknowledged[0].date_of_process).split('-')
		e=str(acknowledged[l-1].date_of_process).split('-')
		date_range={'start':'/'.join([s[1],s[2],s[0]]),
		             'end':'/'.join([e[1],e[2],e[0]])}

		
		return render(request, 'inventory/home.html',{'inv':inv,'item_names':item_names,'pending':pending,'processed':processed, 'group':g, 'requestee':requestee_suggestion,'date_range':date_range, 'history':acknowledged})
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

	details=ProcessedRequest.objects.filter(item_name=name, action='approve')



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
@login_required
def myaccount(request):
	uname = request.user.username
	user = User.objects.get(username = uname)
	profile=UserProfile.objects.get(uname=user)
	g=request.user.groups.all()[0]
	return 	render (request ,'inventory/myaccount.html',{'user':user,'profile':profile,'group':g})



@login_required
def updatepersonalinfo(request):
	if request.method == 'POST':
		fname = request.POST['fname']
		lname = request.POST['lname']
		phone = request.POST['phone_number']
		mpost = request.POST['mypost']
		alt_email = request.POST['alternate_email']

		print "*****",alt_email
		
		uname = request.user.username
		user = User.objects.get(username = uname)

		user.first_name=fname
		user.last_name=lname

		profile= UserProfile.objects.get(uname=user)
		
		profile.alternate_email=alt_email
		profile.mypost= mpost
		profile.phone_number=phone

		user.save()
		profile.save()
		g=request.user.groups.all()[0]

		return HttpResponseRedirect("/myaccount/")
@login_required
def users(request):
	g=request.user.groups.all()[0]
	if str(g)=="head":
		return render(request,"inventory/users.html")
	else:
		return HttpResponse("You don't have permission!")


@login_required
def historybydate(request):
	if request.method=="POST":
		s,e=str(request.POST["range"]).split('-')

		s=s.split('/')
		e=e.split('/')

		s='-'.join([s[2].replace(' ',''),s[0],s[1]])
		e='-'.join([e[2],e[0].replace(' ',''),e[1]])

		history=ProcessedRequest.objects.filter(date_of_process__range=[s,e])

		return render(request,'inventory/historytable.html',{"history":history})

@login_required
def adduser(request):
	if request.method=="POST":
		nusertype = request.POST['type']
		nuseremail= request.POST['email']
		npassword = request.POST['password']

		#createuser
		newuser= User.objects.create_user(username=nuseremail, email=nuseremail, password=npassword,is_staff=True)
		newuser.save()

		#assigning group
		if str(nusertype)=='head':
			g = Group.objects.get(name='head')
		else:
			g = Group.objects.get(name='manager')
		u = User.objects.get(username=nuseremail)
		g.user_set.add(u)


		#creating empty profile
		profile=UserProfile(uname=u)
		profile.save()


		print nusertype, nuseremail, npassword

		return HttpResponse("okay")



@login_required
def vendor_view(request):
	vendor_data = Vendor.objects.all()
	g=request.user.groups.all()[0]
	return render (request ,'inventory/vendor.html',{"vendor_data":vendor_data ,'group':g})

@login_required
def addvendor(request):
	if request.method =="POST":
		vname=request.POST['name']
		vaddress=request.POST['address']
		vcontact=request.POST['contact']
		vemail=request.POST['email']
		vdescription=request.POST['description']

		vadded_by=request.user.username

		newvendor=Vendor(name=vname,address=vaddress,contact=vcontact, email=vemail,description=vdescription, added_by=vadded_by,modified_by=vadded_by)
		newvendor.save()

		new_row='''
				<tr>
						<td>{}</td>
						<td>{}</td> 
						<td>{}</td> 
						<td>{}</td> 
						<td>{}</td> 
						<td>{}</td>  

					</tr>'''.format(vname,vcontact,vemail,vaddress,vdescription,"1/2/3")

		return HttpResponse(new_row)

@login_required
def item_view(request):
	vendor_list=Vendor.objects.values_list('name',flat=True)
	return render(request, 'inventory/item.html',{'vendor_list':vendor_list})

@login_required
def add_item(request):
	if request.method=="POST":
		name=request.POST['name']
		quantity=request.POST['quantity']
		minquant=request.POST['minquant']
		price=request.POST['price']
		ndescription=request.POST['description']
		nvendor=request.POST['vendor']

		i=InventoryTable(item_name=name,quantity_inside=quantity, 
			quantity_outside=0,minimum_quantity=minquant,unit_price=price,
			description=ndescription,vendor=nvendor)
		i.save()

		return HttpResponse("oka")