from .models import ProcessedRequest, InventoryTable, Issues, UserProfile
import uuid
from django.contrib.auth.models import User
from django.utils.dateparse import parse_date
import datetime
from django.core import serializers
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
	locations=ProcessedRequest.objects.filter(requestee=requestee, item_name=item, category=category,action='APPROVED').values('location').distinct()
	print locations
	r=""
	for l in locations:
		r+="<option>{}</option>\n".format(l['location'])
	return r

def get_ret_amount_ajax(request):
	item=request.GET['item']
	req_name=request.GET['req_name']
	ret_location=request.GET['ret_location']

	amount = ProcessedRequest.objects.filter(item_name=item, requestee=req_name,
		action='APPROVED',location=ret_location).values('approved_quantity')
	ret=ProcessedRequest.objects.filter(item_name=item, requestee=req_name,
		action='Returned',location=ret_location).values('approved_quantity')

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
	data=ProcessedRequest.objects.filter(date_of_process__range=[s,e]).values('date_of_process',
		'item_name','category','location','delivered_price','approved_quantity','action','requestee',
		'processed_by')
	list_data=[]
	ajax_format={}
	for d in data:
		x=[str(d['date_of_process']),str(d['item_name']),str(d['category']),str(d['location']),
		str(round(d['delivered_price'],3)),str(d['approved_quantity']),str(d['action']),str(d['requestee']),
		str(get_nick(d['processed_by']))]
		list_data.append(x)
	ajax_format["data"]=list_data
	return json.dumps(ajax_format,indent=4, separators=(',', ': '))
