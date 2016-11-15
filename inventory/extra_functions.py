from .models import ProcessedRequest, InventoryTable
import uuid
from django.contrib.auth.models import User

def get_location_names():
	return ProcessedRequest.objects.all().values('location').distinct()

def get_location_ajax(request):
	item=request.GET['item']
	requestee=request.GET['req_name']
	if requestee=="Non":
		requestee=requestee.replace("Non","Non Specified")
	if requestee=="Not":
		requestee=requestee.replace("Not","Not Specified")
	print requestee
	locations=ProcessedRequest.objects.filter(requestee=requestee, item_name=item, action='approve').values('location').distinct()
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
		action='approve',location=ret_location).values('approved_quantity')
	ret=ProcessedRequest.objects.filter(item_name=item, requestee=req_name, 
		action='Returned',location=ret_location).values('approved_quantity')
	
	s=sum([a['approved_quantity'] for a in amount])

	k=sum([a['approved_quantity'] for a in ret])
	return s-k

def process_return(request):
	item=request.GET['item']
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
			processed_by = u,action="Returned",delivered_price=inv.unit_price,
			location=place,acknowledgement=1)
	p.save()
	inv.save()
	return "ok"	