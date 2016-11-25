import glob
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