from django.contrib import admin

# Register your models here.
from .models import InventoryTable, PendingRequest, ProcessedRequest, UserProfile, Vendor, Temp,ItemHistory

admin.site.register(InventoryTable)
admin.site.register(PendingRequest)
admin.site.register(ProcessedRequest)
admin.site.register(UserProfile)
admin.site.register(Vendor)
admin.site.register(Temp)
admin.site.register(ItemHistory)