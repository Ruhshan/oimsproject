from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
import uuid
import hashlib
import datetime
# Create your models here.
class InventoryTable(models.Model):
	item_name=models.CharField(max_length=100,blank=False,null=False)
	category=models.CharField(max_length=100,default="Old")
	quantity_inside=models.IntegerField()
	quantity_outside=models.IntegerField()
	minimum_quantity=models.IntegerField()
	unit_price=models.DecimalField(max_digits=10, decimal_places=5)
	description=models.TextField()
	vendor=models.CharField(max_length=100,blank=True,null=True)
	remarks=models.CharField(max_length=100, default="Default Remarks")



	def update(self):
		self.save()

	def __str__(self):
		return self.item_name
class InventoryTableTemp(models.Model):
	item_name=models.CharField(max_length=100,blank=False,null=False)
	category=models.CharField(max_length=100,default="Old")
	quantity_inside=models.IntegerField(blank=True,null=True)
	quantity_outside=models.IntegerField(blank=True,null=True)
	minimum_quantity=models.IntegerField(blank=True,null=True)
	unit_price=models.DecimalField(max_digits=10, blank=True,decimal_places=5,null=True)
	description=models.TextField(blank=True)
	creator=models.CharField(max_length=100,blank=True)
	action=models.CharField(max_length=100,blank=True)
	vendor=models.CharField(max_length=100,blank=True,null=True)
	remarks=models.CharField(max_length=100, default="Default Remarks")


	def update(self):
		self.save()

	def __str__(self):
		return self.item_name

class PendingRequest(models.Model):
	id_no=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	item_name=models.CharField(max_length=100,blank=False,null=False)
	category=models.CharField(max_length=100,default="Old")
	requested_quantity=models.IntegerField()
	requestee=models.CharField(max_length=100,blank=False,null=False)
	location = models.CharField(max_length=100, default="Non Specified")
	store_manager=models.CharField(max_length=100,blank=False,null=False)
	description=models.TextField()
	date_of_request=models.DateField(auto_now=True)
	date_of_return=models.DateField(default=datetime.date(2050,1,1))

	def update(self):
		self.save()

	def __str__(self):
		return str(self.id_no)


class ProcessedRequest(models.Model):
	id_no=models.UUIDField(primary_key=True,default=0, editable=False)
	item_name=models.CharField(max_length=100,blank=False,null=False)
	category=models.CharField(max_length=100,default="Old")
	requested_quantity=models.IntegerField()
	location = models.CharField(max_length=100, default="Non Specified")
	approved_quantity=models.IntegerField()
	requestee=models.CharField(max_length=100,blank=False,null=False)
	store_manager=models.CharField(max_length=100,blank=False,null=False)
	description=models.TextField()
	date_of_request=models.DateField(blank=True,null=True)
	date_of_return=models.DateField(default=datetime.date(2050,1,1))

	#processed_by=models.CharField(max_length=100,blank=False,null=False)
	processed_by=models.ForeignKey(User, on_delete=models.CASCADE)
	date_of_process=models.DateField(auto_now=True)
	action=models.CharField(max_length=10, blank=False, null=False)
	acknowledgement=models.IntegerField(default=0)
	delivered_price=models.DecimalField(max_digits=10, decimal_places=5)


	def update(self):
		self.save()

	def __str__(self):
		return str(self.id_no)

class UserProfile(models.Model):
	uname = models.OneToOneField(User)

	alternate_email = models.CharField(max_length=50,blank=False,null=True)
	mypost = models.CharField(max_length=100,blank=False,null=True)
	phone_number =models.CharField(max_length=20,blank=False,null=True)
	created_by=models.CharField(max_length=30,blank=False,null=True)
	is_deleted=models.IntegerField(default=0)
	nick_name=models.CharField(max_length=50,default="Nick not set")

	def __str__(self):
		return self.uname.username


class Vendor(models.Model):
	name = models.CharField(max_length=100,blank=False,null=False)
	contact_person=models.CharField(max_length=100, blank=False, null=False)
	address = models.CharField(max_length=200,blank=False,null=False)
	contact = models.CharField(max_length=50,blank=False,null=False)
	email = models.CharField(max_length=100,blank=False,null=False)
	description = models.TextField()
	date_added = models.DateField(auto_now_add= True)
	date_modified = models.DateField(auto_now= True)
	added_by = models.CharField(max_length=50,blank=False,null=False)
	modified_by = models.CharField(max_length=50,blank=False,null=False)
	is_active = models.IntegerField(default=1)
	vendor_id = models.AutoField(primary_key=True)

	def __str__(self):
		return str(self.vendor_id)


class Temp(models.Model):
	name = models.CharField(max_length=100,blank=False,null=False)
	tp= models.CharField(max_length=100,blank=False,null=False)

	def __str__(self):
		return str(self.name)

class ItemHistory(models.Model):
	name=models.CharField(max_length=100,blank=False,null=False)
	category=models.CharField(max_length=100,default="Old")
	action=models.CharField(max_length=100,blank=False,null=False)
	quantity=models.IntegerField()
	date_added = models.DateField(auto_now_add= True)
	added_by = models.CharField(max_length=50,blank=False,null=False)
	#added_by = models.ForeignKey(User, on_delete=models.CASCADE)
	#approved_by = models.CharField(max_length=50,blank=False,null=False)
	approved_by= models.ForeignKey(User, on_delete=models.CASCADE)
	new_value=models.TextField(default="Default")
	previous_value=models.TextField(default="Default")

	def __str__(self):
		return str(self.name)

class SeccondaryPassword(models.Model):
	user_name=models.CharField(max_length=100,blank=False,null=False)
	value=models.CharField(max_length=16)

	def save(self, *args, **kwargs):
		self.value = hashlib.md5(self.value).hexdigest()
		super(SeccondaryPassword, self).save(*args, **kwargs)

	def __str__(self):
		return str(self.user_name)

class LoginHistory(models.Model):
	timestamp = models.DateTimeField(auto_now_add=True, null=True)
	action = models.CharField(max_length=10)
	user_name = models.CharField(max_length=50, null=True, blank=True)
	nick_name = models.CharField(max_length=50, null=True, blank=True)

	def __str__(self):
		return str(self.user_name)

class Issues(models.Model):
	id_no=models.UUIDField(primary_key=True,default=uuid.uuid4, editable=False)
	item=models.CharField(max_length=50)
	category=models.CharField(max_length=100,default="Old")
	person=models.CharField(max_length=50)
	place=models.CharField(max_length=50)
	desc=models.TextField()
	amnt=models.IntegerField()
	occurance_date=models.DateField()
	date_created = models.DateField(auto_now_add= True)

	def __str__(self):
		return str(self.id_no)
