from __future__ import unicode_literals

from django.db import models
import uuid
# Create your models here.
class InventoryTable(models.Model):
	item_name=models.CharField(max_length=100,blank=False,null=False, unique=True, db_index=True)
	quantity_inside=models.IntegerField()
	quantity_outside=models.IntegerField()
	minimum_quantity=models.IntegerField()
	unit_price=models.DecimalField(max_digits=10, decimal_places=5)
	description=models.TextField()
	vendor=models.CharField(max_length=100,blank=False,null=False)

	def update(self):
		self.save()

	def __str__(self):
		return self.item_name

class PendingRequest(models.Model):
	id_no=models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
	item_name=models.CharField(max_length=100,blank=False,null=False)
	requested_quantity=models.IntegerField()
	requestee=models.CharField(max_length=100,blank=False,null=False)
	store_manager=models.CharField(max_length=100,blank=False,null=False)
	description=models.TextField()
	date_of_request=models.DateField(auto_now=True)

	def update(self):
		self.save()

	def __str__(self):
		return str(self.id_no)