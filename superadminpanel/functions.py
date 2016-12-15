import glob
from django.contrib.auth.models import User
import json
import os
import subprocess
from django.contrib.auth.models import Group

from inventory.models import *

def getinfo():
	f=dict()
	with open("superadminpanel/.info","r") as info:
		for line in info:
			i=line.split(":")
			f[i[0]]=i[1]
	return f

def setinfo(currency, orgname, refresh, timeout):
	w="currency:"+currency+"\n"
	w+="orgname:"+orgname+"\n"
	w+="refresh:"+refresh+"\n"
	w+="timeout:"+timeout+"\n"
	o=open("superadminpanel/.info","w")
	o.write(w)
	o.close()

def import_from_json(path):
	#empty_data()
	user_and_group={}
	for u in User.objects.all():
		try:
			g=str(u.groups.all()[0]).split()[0]
			user_and_group[str(u)]=g
		except:
			''
	Group.objects.all().delete()
	if User.objects.filter(username="superuser").exists():
		obj  = json.load(open(path[1:]))
		for i in xrange(len(obj)):
			if obj[i]["model"]=="auth.user":
				if obj[i]['fields']['username']=="superuser":
					obj.pop(i)
					break
		open(path[1:], "w").write(
    		json.dumps(obj, sort_keys=True, indent=4, separators=(',', ': '))
		)
	exe_string="python manage.py loaddata {}".format(path[1:])
	p=subprocess.Popen(exe_string.split(),stdout=subprocess.PIPE)
	ret= p.stdout.read()
	for u in user_and_group.keys():
		Group.objects.get_or_create(name=user_and_group[u])
		g=Group.objects.get(name=user_and_group[u])
		n=User.objects.get(username=u)
		g.user_set.add(n)
		g.save()
	return ret


def empty_data():
	InventoryTable.objects.all().delete()
	InventoryTableTemp.objects.all().delete()
	PendingRequest.objects.all().delete()
	ProcessedRequest.objects.all().delete()
	UserProfile.objects.all().delete()
	Vendor.objects.all().delete()
	Temp.objects.all().delete()
	ItemHistory.objects.all().delete()
	SeccondaryPassword.objects.all().delete()
	LoginHistory.objects.all().delete()
	Issues.objects.all().delete()
	Group.objects.all().delete()
	User.objects.all().exclude(username="superuser").delete()
