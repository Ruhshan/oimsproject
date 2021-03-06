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
#from django.core.urlresolvers import reverse
#imported models
from hashlib import md5
from .models import InventoryTable, PendingRequest, ProcessedRequest, UserProfile, Vendor, Temp,ItemHistory
from .models import InventoryTableTemp, SeccondaryPassword, LoginHistory
from .extra_functions import *

def changename(oldname, category,newname, request):
	#changin names in already existing table
	it=InventoryTable.objects.filter(item_name=oldname, category=category)
	it.update(item_name=newname)


	pr=ProcessedRequest.objects.filter(item_name=oldname, category=category)
	pr.update(item_name=newname)

	ih=ItemHistory.objects.filter(name=oldname, category=category)
	ih.update(name=newname)

	#addning change entry to table
	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=newname,action="NAMECHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=oldname,new_value=newname,quantity=0, category=category)
	changeentry.save()



def check_password2(name, password2):
	return str(md5(password2).hexdigest())==str(SeccondaryPassword.objects.get(user_name=name).value)





def head_count():
	c=0
	ids=User.objects.filter(is_active=True).exclude(username="superuser")
	for i in ids:
		if str(i.groups.all()[0])=='admin':
			c+=1
	return c

def alert_count():
	quan=InventoryTable.objects.values('quantity_inside')
	minq=InventoryTable.objects.values('minimum_quantity')

	ret_date= len(ProcessedRequest.objects.filter(date_of_return=datetime.date.today()))



	count =0
	for i,j in zip(quan,minq):
		i=i['quantity_inside']
		j=j['minimum_quantity']
		if i<=j:

			count+=1



	return count+ret_date
def alert_content():
	val=InventoryTable.objects.values('item_name','quantity_inside','minimum_quantity')

	content=""
	for v in val:
		if int(v['quantity_inside'])<=int(v['minimum_quantity']):
			content+=v['item_name']+" is left "+str(v['quantity_inside'])+"<br>"

	ret=ProcessedRequest.objects.filter(date_of_return=datetime.date.today())
	for r in ret:
		m="Returning date of "+r.item_name+'s by '+r.requestee+'<br>'
		content+=m
	return content


# Create your views here.
def user_login(request):
	#context=RequestContext(request)
	if request.method=='POST':
		email=request.POST['email']
		password=request.POST['password']
		password2=request.POST['password2']
		next=request.POST['next']
		#print "inside",next

		u=User.objects.get(username=email)
		g=str(u.groups.all()[0])



		if g=="admin":
			if check_password2(email,password2):
				user=authenticate(username=email,password=password)
			else:
				return HttpResponse("Invalid Seccondary password")
		if g=="temporary-admin":
			if check_password2(email,password2):

				user=authenticate(username=email,password=password)

			else:
				return HttpResponse("Invalid Seccondary password")
		else:
			user=authenticate(username=email,password=password)




		if user is not None:
			if user.is_active:
				request.session.set_expiry(1000)
				login(request,user)
				l=LoginHistory(action="Login", user_name=email, nick_name=user.userprofile.nick_name)
				l.save()
				if next:
					return HttpResponseRedirect(next)
				else:
					return HttpResponseRedirect("/home/")
			else:
				return HttpResponse("Your OIMS account is disabled.")
		else:
			return HttpResponse("Invalid login")
	else:
		return render(request,'inventory/login.html', {})

def view_home(request):

	if request.user.is_authenticated():
		#static_info=get_static_info(request)
		try:
			g=request.user.groups.all()[0]
		except:
			return HttpResponse("You don't have permission to view this page, plsease\
				login with a proper account.")
		item_names=InventoryTable.objects.values('item_name','category')

		processed=ProcessedRequest.objects.filter(acknowledgement=0)

		requestee_suggestion=ProcessedRequest.objects.values_list('requestee',flat=True).distinct()

		passwordreq = Temp.objects.values_list('name',flat=True)
		historyitems=ItemHistory.objects.all()
		itemcreate=InventoryTableTemp.objects.all()

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
		try:
			d1=str(acknowledged[0].date_of_process).split('-')
			d2=str(acknowledged[l-1].date_of_process).split('-')
			s=min(d1,d2)
			e=max(d1,d2)
			print d1,d2
			date_range={'start':'/'.join([s[2],s[1],s[0]]),
		    	         'end':'/'.join([e[2],e[1],e[0]])}
		   	print date_range
		except:
			date_range={'start':today(request),'end':today(request)}


		ret_item=ProcessedRequest.objects.filter(action='APPROVED').distinct().values('item_name','category')

		return render(request, 'inventory/home.html',{'item_names':item_names,'pending':pending, 'group':g, 'requestee':requestee_suggestion,
			'date_range':date_range, 'history':acknowledged,'passwordreq':passwordreq,
			'alert_count':alert_count(),'alert_content':alert_content(),
			'historyitems':historyitems,'itemcreate':itemcreate,'ret_item':ret_item,'locations':get_location_names(),
			'static_info':get_static_info(request),'date_range_h':item_history_daterange(request),'processed':processed})
	else:
		return render(request,'inventory/login.html', {'next':"/home/"})

@login_required
def user_logout(request):
	try:
		next=request.GET['next']
	except:
		next='/home/'
	print "In logout",next
	l=LoginHistory(action="Logout", user_name=request.user.username)
	l.save()
	logout(request)
	if next=="/superadminlogin/":
		return HttpResponseRedirect(next)
	return HttpResponseRedirect("/accounts/login/?next={}".format(next))

@login_required
def itemqty(request):
	name=request.GET['requested_name']
	category=request.GET['category']
	qty=int(InventoryTable.objects.get(item_name=str(name),category=category).quantity_inside)
	s=""
	for i in range(1,qty+1):
		s+="""<option value="{}">{}</option>\n""".format(i,i)

	return HttpResponse(s)

@login_required
def place_request(request):
	if request.method=='POST':
		nitem_name=request.POST['requested_item_name_dropdown']
		ncategory=request.POST['category']
		nrequested_quantity=request.POST['requested_quantity']
		nrequestee=request.POST['requestee']
		nstore_manager=request.user.username
		ndescription=request.POST['description']
		nlocation=request.POST['location']
		nret_date=request.POST['return_date']

		p=PendingRequest(item_name=nitem_name, category=ncategory,requested_quantity=nrequested_quantity,
			requestee=nrequestee,store_manager=nstore_manager, description=ndescription,
			location=nlocation, date_of_return=nret_date)
		p.save()

		quantity_inside=InventoryTable.objects.get(item_name=nitem_name).quantity_inside

		print nitem_name, nrequestee, quantity_inside, nrequested_quantity,ndescription

		parameters={'item_name':nitem_name, 'category':ncategory,'requestee':nrequestee, 'quantity_inside':quantity_inside,'requested_quantity':nrequested_quantity,'description':ndescription}

		f=file('inventory/templates/inventory/newrequest.html').read()

		#print render_to_string('inventory/newrequest.html',{'parameters':parameters})
		f=f.format(nitem_name.encode('utf-8'),ncategory.encode('utf-8'),nrequestee.encode('utf-8'),
			nrequested_quantity,nret_date,quantity_inside,ndescription.encode('utf-8'))


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
		ncategory=p.category
		nrequested_quantity=p.requested_quantity
		nrequestee=p.requestee
		nstore_manager=p.store_manager
		ndescription=p.description
		ndate_of_request=p.date_of_request
		nlocation=p.location
		nret_date=p.date_of_return

		nprocessed_by=User.objects.get(username=request.user.username)
		ndelivered_price=InventoryTable.objects.get(item_name=nitem_name).unit_price

		q=ProcessedRequest(id_no=nid_no, requestee=nrequestee, item_name=nitem_name, category=ncategory,
			requested_quantity=nrequested_quantity, approved_quantity=value,
			store_manager=nstore_manager, description=ndescription, date_of_request=ndate_of_request,
			processed_by = nprocessed_by,action=decesion,delivered_price=ndelivered_price,
			location=nlocation,date_of_return=nret_date)
		q.save()

		p.delete()

		if decesion=="APPROVED":
			i=InventoryTable.objects.get(item_name=nitem_name, category=ncategory)
			i.quantity_inside-=int(value)
			i.quantity_outside+=int(value)
			i.save()

		print nrequestee
		return HttpResponse("okay")





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
def item_details(request, id):

	item=InventoryTable.objects.get(id=id)

	remaining=100*float(item.quantity_inside)/(float(item.quantity_inside)+float(item.quantity_outside))

	details=ProcessedRequest.objects.filter(item_name=item.item_name, action='APPROVED')
	g=request.user.groups.all()[0]
	return render(request, 'inventory/item_details.html',{'item':item, 'details':details,
		'remaining':int(remaining),'group':g,'alert_count':alert_count(),'alert_content':alert_content(),
		'static_info':get_static_info(request)})
	# return render(request, 'inventory/item_details.html',{'item':item, 'details':details,
	# 'remaining':int(remaining),'group':g,})


def isadmin(request):
	if request.method=='POST':
		print "isadmin called"
		email=request.POST["email"]
		u=User.objects.get(username=email)
		g=str(u.groups.all()[0])
		print u, g
		if g=='admin' or g=="temporary-admin":
			return HttpResponse(1)
		else:
			return HttpResponse(0)
@login_required
def myaccount(request):
	uname = request.user.username
	user = User.objects.get(username = uname)
	profile=UserProfile.objects.get(uname=user)
	g=request.user.groups.all()[0]
	return 	render (request ,'inventory/myaccount.html',{'user':user,'profile':profile,'group':g,
		'alert_count':alert_count(),'alert_content':alert_content(),'static_info':get_static_info(request)})



@login_required
def updatepersonalinfo(request):
	if request.method == 'POST':
		fname = request.POST['fname']
		lname = request.POST['lname']
		phone = request.POST['phone_number']
		mpost = request.POST['mypost']
		alt_email = request.POST['alternate_email']
		oldp = request.POST['oldp']

		#print "*****",alt_email
		uname = request.user.username
		user = User.objects.get(username = uname)
		if user.check_password(oldp)==True:

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
		else:
			return HttpResponse("wrong password")
@login_required
def users(request):
	g=request.user.groups.all()[0]
	u=User.objects.filter(userprofile__is_deleted=0)
	history=LoginHistory.objects.all()

	if str(g)=="admin":
		return render(request,"inventory/users.html",{'group':g,'alert_count':alert_count(),
			'alert_content':alert_content(),'user':u,'history':history,'static_info':get_static_info(request)})
	else:
		return HttpResponse("You don't have permission!")


@login_required
def historybydate(request):
	if request.method=="GET":
		s,e=str(request.GET["range"]).split('-')

		s=s.split('/')
		e=e.split('/')

		s='-'.join([s[2].replace(' ',''),s[0],s[1]])
		e='-'.join([e[2],e[0].replace(' ',''),e[1]])

		execute=history_ajax(request, s,e)


		return HttpResponse(execute)

@login_required
def adduser(request):
	if request.method=="POST":
		nusertype = request.POST['type']
		nuseremail= request.POST['email']
		npassword = request.POST['password']
		adminp1 = request.POST['adminpassword1']
		adminp2 = request.POST['adminpassword2']
		nick_name=request.POST['nick_name']
		try:
			npassword2= request.POST['password2']
		except:
			print "may be user"

		pcheck=0
		if request.user.check_password(adminp1) and check_password2(request.user.username,adminp2):
				pcheck=1
		if pcheck==0:
			return HttpResponse("password_error")

		if str(nusertype)=="admin":
			h=head_count()
			if h>=2:
				return HttpResponse("admin_exceeded")

		#createuser
		try:
			newuser= User.objects.create_user(username=nuseremail, email=nuseremail, password=npassword,is_staff=True)
			newuser.save()
		except:
			return HttpResponse("user_exists")

		#assigning group and seccondary password
		if str(nusertype)=='admin':
			g = Group.objects.get(name='admin')
			sp=SeccondaryPassword(user_name=nuseremail,value=npassword2)
			sp.save()
		elif str(nusertype)=="user":
			Group.objects.get_or_create(name='user')
			g = Group.objects.get(name='user')
		else:
			Group.objects.get_or_create(name='temporary-admin')
			g = Group.objects.get(name="temporary-admin")
			sp=SeccondaryPassword(user_name=nuseremail,value=npassword2)
			sp.save()
		u = User.objects.get(username=nuseremail)
		g.user_set.add(u)


		#creating empty profile
		profile=UserProfile(uname=u, created_by=request.user.userprofile.nick_name,nick_name=nick_name)
		profile.save()


		print nusertype, nuseremail, npassword

		return HttpResponse("okay")



@login_required
def vendor_view(request):
	vendor_data = Vendor.objects.all()
	g=request.user.groups.all()[0]
	return render (request ,'inventory/vendor.html',{"vendor_data":vendor_data ,'group':g,
		'alert_count':alert_count(),'alert_content':alert_content(),'static_info':get_static_info(request)})

@login_required
def addvendor(request):
	if request.method =="POST":
		vname=request.POST['name']
		cperson=request.POST['cperson']
		vaddress=request.POST['address']
		vcontact=request.POST['contact']
		vemail=request.POST['email']
		vdescription=request.POST['description']

		vadded_by=request.user.username

		newvendor=Vendor(name=vname,contact_person=cperson,address=vaddress,contact=vcontact, email=vemail,description=vdescription, added_by=vadded_by,modified_by=vadded_by)
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
	item_list=InventoryTable.objects.values('item_name','category')
	categories=InventoryTable.objects.values_list('category',flat=True).distinct()
	g=request.user.groups.all()[0]
	if str(g)=='user':
		return render(request, 'inventory/item.html',{'vendor_list':vendor_list,'group':g,
		'item_list':item_list,'alert_count':alert_count(),'alert_content':alert_content()
		,'categories':categories,'static_info':get_static_info(request)})
	else:
		return HttpResponse("You don't have permission!")

@login_required
def add_item(request):
	if request.method=="POST":
		name=request.POST['name']
		quantity=request.POST['quantity']
		category=request.POST['category']
		minquant=request.POST['minquant']
		price=request.POST['price']
		remarks=request.POST['remarks']
		ndescription=request.POST['description']
		nvendor=request.POST['vendor']

		if InventoryTable.objects.filter(item_name=name, category=category).exists():
			return HttpResponse("This item under this category already exists, Pick a new name or choose a new category")
		else:

			i=InventoryTableTemp(item_name=name,quantity_inside=quantity,category=category,
				quantity_outside=0,minimum_quantity=minquant,unit_price=price,
				description=ndescription,vendor=nvendor,action='CREATED',creator=request.user.username,remarks=remarks)
			i.save()
			# h=ItemHistory(name=name,action="create", quantity=quantity,added_by=request.user.username, approved_by="admin")
			# h.save()

			return HttpResponse("oka")

@login_required
def getinfo(request):
	name=request.GET['item_name']
	category=request.GET['category']
	print name, category
	blob=InventoryTable.objects.get(item_name=name,category=category)
	print blob
	r="{}-{}-{}-{}-{}-{}".format(blob.quantity_inside,blob.minimum_quantity, blob.unit_price,blob.vendor,blob.remarks,blob.description)
	return HttpResponse(r)


@login_required
def updateitem(request):
	if request.method=="POST":
		name=request.POST['name']
		category=request.POST['category']
		quant=request.POST['quantity']
		minquant=request.POST['minquant']
		price=request.POST['price']
		desc=request.POST['description']
		vendor=request.POST['vendor']
		newname=request.POST['newname']
		remarks=request.POST['remarks']

		ret=""
		if newname:
			changename(name, category,newname,request)
			ret+="namechange"
			name=newname

		m=InventoryTable.objects.get(item_name=name, category=category)

		if quant:
			i=InventoryTableTemp(item_name=name,category=category,creator=request.user.username)
			i.quantity_inside=int(quant)
		if minquant:
			if m.minimum_quantity!=int(minquant):
				changeminquant(name, category, minquant, request)
			m.minimum_quantity=int(minquant)
		if price:
			if m.unit_price!=float(price):
				pricechange(name,category, price,request)
			m.unit_price=float(price)
		if desc:
			if m.description!=desc:
				changedescription(name, category, desc,request)
			m.description=desc
		if vendor:
			if m.vendor!=vendor:
				changevendor(name, category, vendor, request)
			m.vendor=vendor
		if remarks:
			if m.remarks!=remarks:
				changeremarks(name, category, remarks, request)
			m.remarks=remarks
		if quant:
			if int(quant)>0:
				action="ADD"
			if int(quant)<0:
				action="REMOVE"
				i.quantity_inside=int(quant)*(-1)
			i.action=action
			i.save()
			ret+="_itemupdate"
		m.save()

		return HttpResponse(ret)

@login_required
def passwordchange(request):
	if request.method=="POST":
		if str(request.user.groups.all()[0])=="admin":
			uname=request.POST["name"]
			action=request.POST["action"]
			if str(action)=="ok":
				u=User.objects.get(username=uname)
				t=Temp.objects.get(name=uname)
				u.is_active=True
				u.set_password(t.tp)
				u.save()
				t.delete()

				return HttpResponse("okay")
			if str(action)=="cancel":
				u=User.objects.get(username=uname)
				t=Temp.objects.get(name=uname)
				u.is_active=True
				u.save()
				t.delete()

				return HttpResponse("cancel")

@login_required
def itemadminaction(request):
	if request.method=="POST":
		if str(request.user.groups.all()[0])=="admin" or str(request.user.groups.all()[0])=="temporary-admin":
			print request.user.groups.all()[0]

			if request.POST['action']=="ok":
				t=InventoryTableTemp.objects.get(id=request.POST['req_id'])
				nadded_by=User.objects.get(username=t.creator).userprofile.nick_name
				napproved_by=User.objects.get(username=request.user.username)
				i=InventoryTable(item_name=t.item_name,quantity_inside=t.quantity_inside,
				quantity_outside=t.quantity_outside,minimum_quantity=t.minimum_quantity,unit_price=t.unit_price,
				description=t.description,vendor=t.vendor, category=t.category,remarks=t.remarks)
				h=ItemHistory(name=i.item_name,action="CREATED", quantity=i.quantity_inside,
					added_by=nadded_by, approved_by=napproved_by,category=t.category)
				h.save()

				i.save()
				t.delete()

				return HttpResponse("create_ok")
			if request.POST['action']=="cancel":
				t=InventoryTableTemp.objects.get(id=request.POST['req_id'])
				t.delete()



				return HttpResponse("canceled")

			if request.POST['action']=='add':
				t=InventoryTableTemp.objects.get(id=request.POST['req_id'])
				i=InventoryTable.objects.get(item_name=t.item_name)
				i.quantity_inside+=int(t.quantity_inside)
				nadded_by=User.objects.get(username=t.creator).userprofile.nick_name
				napproved_by=User.objects.get(username=request.user.username)

				h=ItemHistory(name=i.item_name,action="ADDED", quantity=t.quantity_inside,
					added_by=nadded_by, approved_by=napproved_by,category=t.category)
				t.delete()
				h.save()
				i.save()
				return HttpResponse("added")
			if request.POST['action']=='remove':
				t=InventoryTableTemp.objects.get(id=request.POST['req_id'])
				i=InventoryTable.objects.get(item_name=t.item_name)
				i.quantity_inside-=int(t.quantity_inside)
				nadded_by=User.objects.get(username=t.creator).userprofile.nick_name
				napproved_by=User.objects.get(username=request.user.username)

				h=ItemHistory(name=i.item_name,action="REMOVED", quantity=t.quantity_inside,
					added_by=nadded_by, approved_by=napproved_by,category=t.category)
				t.delete()
				h.save()
				i.save()

				return HttpResponse("removed")

@login_required
def changestatus(request):
	if request.user.groups.all()[0]!="user":
		if request.method=="POST":
			uid=request.POST['id'].replace('toggle','')
			status=request.POST['status']
			u=User.objects.get(id=uid)
			p1=request.POST['p1']
			p2=request.POST['p2']
			pcheck=0
			if request.user.check_password(p1) and check_password2(request.user.username,p2):
				pcheck=1
			if pcheck==0:
				return HttpResponse("password_error")
			if status=="active":
				if str(u.groups.all()[0])=="admin":
					h=head_count()
					if h>=2:
						return HttpResponse("admin_exceed")
				u.is_active=True
			else:
				u.is_active=False
			u.save()

			return HttpResponse("okay")

def modifyuser(request):
	if request.method=="POST":
		p1=request.POST['p1']
		p2=request.POST['p2']
		uid=request.POST['id']
		target_user=User.objects.get(id=uid)
		pcheck=0
		if request.user.check_password(p1) and check_password2(request.user.username,p2):
				pcheck=1
		if pcheck==0:
			return HttpResponse("password_error")

		try:
			status=request.POST['status']
			print "stat",status
			print "change status",status
			if status=="activate":
				if str(target_user.groups.all()[0])=="admin":
					h=head_count()
					if h>=2:
						return HttpResponse("admin_exceeded")
				else:
					target_user.is_active=True
			else:
				target_user.is_active=False
			target_user.save()
			return HttpResponse("okay")
		except:
			print "no change in status"

		try:
			todelete=request.POST['delete']
			if todelete==target_user.username:
				profile=UserProfile.objects.get(uname=target_user)
				profile.is_deleted=1
				profile.save()
				u=User.objects.get(username=target_user.username)
				u.is_active=0
				u.save()
				return HttpResponse("okay")

			else:
				return HttpResponse("to_delete_not_matched")
		except:
			print "no deletion"
		try:
			editemail=request.POST["newemail"]
			target_user.username=editemail
			target_user.save()
			return HttpResponse("okay")
		except:
			print "no email edit"

@login_required
def changepassword(request):
	if request.method=='POST':
		print request.POST
		if request.POST['type']=="admin":
			print "inside admin"
			old1=request.POST['old1']
			old2=request.POST['old2']
			new1=request.POST['new1']
			new2=request.POST['new2']
			name=request.POST['name']

			if request.user.check_password(old1) and check_password2(request.user.username,old2):
				sp=SeccondaryPassword.objects.get(user_name=request.user.username)
				sp.value=new2
				sp.save()
				u=User.objects.get(username=request.user.username)
				u.set_password(new1)
				u.save()
				return HttpResponse("okay")
			else:
				return HttpResponse("wrong password")

			print old1,old2,new1,new2,name

		if request.POST['type']=="user":
			print "Inside user"
			oldp=request.POST['old1']
			newp=request.POST['new1']
			name=request.POST['name']

			user=User.objects.get(username=name)

			if user.check_password(oldp)==True:
				try:
					t=Temp.objects.get(name=name)
					t.tp=newp
					t.save()
				except ObjectDoesNotExist:
					t=Temp(name=name, tp=newp)
					t.save()
				user.is_active=False
				user.save()
				print "ok"
				return HttpResponse("okay")
			else:
				print "something wrong"
				return HttpResponse("wrong password")



@login_required
def show_requestee(request):
	print "Show requestee"
	item,category=request.GET['item_name'],request.GET['category']
	# reqs=ProcessedRequest.objects.filter(item_name=item,category=category,action="APPROVED").distinct().values('requestee')
	# ret=""
	# for r in reqs:
	# 	ret+="<option value='{}'>{}</option>\n".format(r['requestee'],r['requestee'])
	# print get_requestee_ajax(item, category, request)

	return HttpResponse(get_requestee_ajax(item, category, request))

@login_required
def show_ret_amounts(request):
	execute=get_ret_amount_ajax(request)
	return HttpResponse(execute)


@login_required
def show_locations(request):
	execute=get_location_ajax(request)
	return HttpResponse(execute)

@login_required
def ret_item(request):
	execute=process_return(request)
	return HttpResponse(execute)

@login_required
def create_issue(request):
	execute=process_issue(request)
	return HttpResponse(execute)

@login_required
def issue_ajax(request):
	execute=issue_to_ajax(request)
	return HttpResponse(execute)

def credit(request):
	return render(request,'inventory/credit.html', {})


def inventory_ajax(request):
	execute=inventory_to_ajax(request)
	return HttpResponse(execute)
def itemhistorybydate(request):
	if request.method=="GET":
		s,e=str(request.GET["range"]).split('-')

		s=s.split('/')
		e=e.split('/')

		s='-'.join([s[2].replace(' ',''),s[0],s[1]])
		e='-'.join([e[2],e[0].replace(' ',''),e[1]])

		execute=item_history_ajax(request, s,e)


		return HttpResponse(execute)
def getchangedetails(request):
	id=request.GET["id"]
	execute=getchangedetailsjson(id,request)
	return HttpResponse(execute)

def red_login(request):
	next=request.GET["next"]
	return render(request,'inventory/login.html', {'next':next})
