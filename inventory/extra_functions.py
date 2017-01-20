from .models import ProcessedRequest, InventoryTable, Issues, UserProfile, ItemHistory
import uuid
from django.contrib.auth.models import User
from django.utils.dateparse import parse_date
import datetime
from django.core import serializers
from django.db.models import Q
import json
import sys
reload(sys)
sys.setdefaultencoding('utf8')

def get_nick(id):
	return User.objects.get(id=id).userprofile.nick_name
def get_location_names():
	return ProcessedRequest.objects.all().values('location').distinct()

def get_location_ajax(request):
	item=request.GET['item']
	category=request.GET['category']
	requestee=request.GET['req_name']
	if requestee=="Non":
		requestee=requestee.replace("Non","Non Specified")
	if requestee=="Not":
		requestee=requestee.replace("Not","Not Specified")
	print requestee
	locations=ProcessedRequest.objects.filter(Q(action='APPROVED') | Q(action='RETURNED'),requestee=requestee, item_name=item, category=category).values('location','action','approved_quantity')
	approved={}
	returned={}
	#print locations
	for l in locations:
		if l['action']=='APPROVED':
			try:
				approved[l['location']]+=l['approved_quantity']
			except:
				approved[l['location']]=l['approved_quantity']
		if l['action']=='RETURNED':
			try:
				returned[l['location']]+=l['approved_quantity']
			except:
				returned[l['location']]=l['approved_quantity']
	locations_left=[]
	for a in approved.keys():
		try:
			if approved[a]-returned[a]>=0:
				locations_left.append(a)
		except:
			locations_left.append(a)
	r=""
	for l in locations_left:
		r+="<option>{}</option>\n".format(l)
	print r
	return r

def get_ret_amount_ajax(request):
	item=request.GET['item']
	req_name=request.GET['req_name']
	ret_location=request.GET['ret_location']

	amount = ProcessedRequest.objects.filter(item_name=item, requestee=req_name,
		action='APPROVED',location=ret_location).values('approved_quantity')
	ret=ProcessedRequest.objects.filter(item_name=item, requestee=req_name,
		action='RETURNED',location=ret_location).values('approved_quantity')

	s=sum([a['approved_quantity'] for a in amount])

	k=sum([a['approved_quantity'] for a in ret])
	return s-k

def process_return(request):
	item=request.GET['item']
	category=request.GET['category']
	person=request.GET['person']
	place=request.GET['loc']
	amnt=request.GET['amnt']
	print item,person,place,amnt
	inv=InventoryTable.objects.get(item_name=item)
	inv.quantity_inside+=int(amnt)
	inv.quantity_outside-=int(amnt)

	u=User.objects.get(username=request.user.username)
	p=ProcessedRequest(id_no=uuid.uuid4(), requestee=person, item_name=item,
			requested_quantity=amnt, approved_quantity=amnt,
			store_manager=request.user.username, description="",
			processed_by = u,action="RETURNED",delivered_price=inv.unit_price,
			location=place,acknowledgement=1,category=category,)
	p.save()
	inv.save()
	return "ok"


def process_issue(request):
	item=request.GET['item']
	category=request.GET['category']
	person=request.GET['person']
	place=request.GET['loc']
	amnt=request.GET['amnt']
	desc=request.GET['desc']
	date=request.GET['date'].split('/')
	#print item,person,place,amnt,desc,date
	formated_date='-'.join((date[2],date[0],date[1]))

	datetime_object=datetime.datetime.strptime(str(formated_date), "%Y-%m-%d").date()
	i=Issues(item=item, category=category, person=person, place=place, desc=desc, amnt=amnt, occurance_date=formated_date)
	i.save()
	return "ok"

def issue_to_ajax(request):
	ajax_format ={"data":[['1'],['2']]}
	data=Issues.objects.all().values('item','category','person','place','amnt','occurance_date','desc')
	list_data=[]
	for d in data:
		x=[str(d['item']),str(d['category']),str(d['person']),str(d['place']),str(d['amnt']),str(d['occurance_date']),str(d['desc']).encode('utf-8')]
		list_data.append(x)
	ajax_format["data"]=list_data



	return json.dumps(ajax_format,indent=4, separators=(',', ': '))

def get_static_info(request):

	f=dict()
	with open("superadminpanel/.info","r") as info:
		for line in info:
			i=line.split(":")
			f[i[0]]=i[1]
	return f

def today(request):
	d=str(datetime.datetime.today()).split()[0].split('-')
	return '/'.join((d[1],d[2],d[0]))

def history_ajax(request, s,e):
	print s,e
	data=ProcessedRequest.objects.filter(date_of_process__range=[s,e]).values('date_of_process',
		'item_name','category','location','delivered_price','approved_quantity','action','requestee',
		'processed_by')
	list_data=[]
	ajax_format={}
	for d in data:
		item_id=InventoryTable.objects.get(item_name=d['item_name']).id
		details="<a href='item/{}' target='_blank'>{}</a>".format(item_id,d['item_name'])

		x=[str(d['date_of_process']),str(details),str(d['category']),str(d['location']),
		str(round(d['delivered_price'],3)),str(d['approved_quantity']),str(d['action']),str(d['requestee']),
		str(get_nick(d['processed_by']))]
		list_data.append(x)
	ajax_format["data"]=list_data
	return json.dumps(ajax_format,indent=4, separators=(',', ': '))

def inventory_to_ajax(request):
	data=InventoryTable.objects.all().values('id','item_name','category','quantity_inside','quantity_outside',
		'unit_price','vendor','remarks')
	list_data=[]
	ajax_format={}
	for d in data:
		details="<a href='item/{}' target='_blank'>{}</a>".format(d['id'],d['item_name'])
		x=[str(details),str(d['category']),str(d['quantity_inside']),str(d['quantity_outside']),
		str(round(d['unit_price'],3)),str(d['vendor']),str(d['remarks'])]
		list_data.append(x)
	ajax_format["data"]=list_data
	return json.dumps(ajax_format,indent=4, separators=(',', ': '))

def item_history_daterange(request):
	history=ItemHistory.objects.all()
	l=history.count()
	try:
		d1=str(history[0].date_added).split('-')
		d2=str(history[l-1].date_added).split('-')
		s=min(d1,d2)
		e=max(d1,d2)
		#print d1,d2
		date_range={'start':'/'.join([s[2],s[1],s[0]]),
					 'end':'/'.join([e[2],e[1],e[0]])}
		print date_range
	except:
		date_range={'start':today(request),'end':today(request)}
	return date_range
def decide_style(id,x):
	if len(x)<10:
		return x
	else:

		mid="<a href='#' onclick='showchangedetails({})'><span class='glyphicon glyphicon-info-sign'></span></a>".format(id)
		#print '<divclas="overflow:hidden">'+pref+mid+suf+'</div>'
		return "<div style='overflow:hidden;width: 100px;height: 20px;'>"+mid+x+"</div>"
def item_history_ajax(request, s,e):
	print s,e
	data = ItemHistory.objects.filter(date_added__range=[s,e]).values('id','date_added','name','category','quantity',
	'action','new_value','previous_value','added_by','approved_by')

	list_data=[]
	ajax_format={}
	for d in data:
		item_id=InventoryTable.objects.get(item_name=d['name']).id
		details="<a href='item/{}' target='_blank'>{}</a>".format(item_id,d['name'])
		x=[str(d['date_added']),str(details),str(d['category']),str(d['quantity']),
		str(d['action']),
		decide_style(d['id'],str(d['new_value'])),
		decide_style(d['id'],str(d['previous_value'])),
		str(d['added_by']),
		str(get_nick(d['approved_by']))]
		list_data.append(x)
	ajax_format["data"]=list_data
	return json.dumps(ajax_format,indent=4, separators=(',', ': '))
#
# def changename(oldname, category,newname, request):
# 	#changin names in already existing table
# 	it=InventoryTable.objects.filter(item_name=oldname, category=category)
# 	it.update(item_name=newname)
#
#
# 	pr=ProcessedRequest.objects.filter(item_name=oldname, category=category)
# 	pr.update(item_name=newname)
#
# 	ih=ItemHistory.objects.filter(name=oldname, category=category)
# 	ih.update(name=newname)
#
# 	#addning change entry to table
# 	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
# 	napproved_by=User.objects.get(username=request.user.username)
# 	changeentry=ItemHistory(name=newname,action="NAMECHANGE", added_by=nadded_by,
# 		approved_by=napproved_by,modification_of=oldname,quantity=0, category=category)
# 	changeentry.save()


def changeminquant(name, category, minquant, request):
	it=InventoryTable.objects.get(item_name=name, category=category)

	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=name,action="MINQUANTECHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=it.minimum_quantity, new_value=minquant,quantity=0, category=category)
	changeentry.save()

def pricechange(name,category, price,request):
	it=InventoryTable.objects.get(item_name=name, category=category)

	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=name,action="PRICECHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=it.unit_price, new_value=price,quantity=0, category=category)
	changeentry.save()

def changedescription(name, category, desc,request):
	it=InventoryTable.objects.get(item_name=name, category=category)

	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=name,action="DESCRIPCHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=it.description, new_value=desc,quantity=0, category=category)
	changeentry.save()

def changevendor(name, category, vendor,request):
	it=InventoryTable.objects.get(item_name=name, category=category)

	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=name,action="VENDORCHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=it.vendor, new_value=vendor,quantity=0, category=category)
	changeentry.save()
def changeremarks(name, category, remarks, request):
	it=InventoryTable.objects.get(item_name=name, category=category)

	nadded_by=User.objects.get(username=request.user.username).userprofile.nick_name
	napproved_by=User.objects.get(username=request.user.username)
	changeentry=ItemHistory(name=name,action="REMARKSCHANGE", added_by=nadded_by,
		approved_by=napproved_by,previous_value=it.remarks, new_value=remarks, quantity=0, category=category)
	changeentry.save()



def get_requestee_ajax(item, category, request):
	reqs=ProcessedRequest.objects.filter(Q(action="APPROVED")|Q(action="RETURNED"),item_name=item,category=category).distinct().values('requestee','action','approved_quantity')
	approved={}
	returned={}
	#print locations
	for r in reqs:
		if r['action']=='APPROVED':
			try:
				approved[r['requestee']]+=r['approved_quantity']
			except:
				approved[r['requestee']]=r['approved_quantity']
		if r['action']=='RETURNED':
			try:
				returned[r['requestee']]+=r['approved_quantity']
			except:
				returned[r['requestee']]=r['approved_quantity']
	# print approved
	# print returned
	requestees_left=[]
	for a in approved.keys():
		try:
			if approved[a]-returned[a]>=0:
				requestees_left.append(a)
		except:
			requestees_left.append(a)
	print requestees_left
	r=""
	for n in requestees_left:
		print n
		r+="<option value='{}'>{}</option>\n".format(n,n)

	#return "<option value='legend'>legend</option>\n<option value='wrath'>wrath</option>"
	print r
	return r

def getchangedetailsjson(id,request):
	data=ItemHistory.objects.get(id=id)
	#values('name','category','action','new_value','previous_value')
	ajax_format={}
	ajax_format["name"]=data.name
	ajax_format["category"]=data.category
	ajax_format["action"]=data.action
	ajax_format["new_value"]=data.new_value
	ajax_format["previous_value"]=data.previous_value
	return json.dumps(ajax_format,indent=4, separators=(',', ': '))
	#return "ok"
