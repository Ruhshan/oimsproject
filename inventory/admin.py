from django.contrib import admin

# Register your models here.
from .models import InventoryTable, PendingRequest, ProcessedRequest, UserProfile, Vendor, Temp,ItemHistory
from .models import InventoryTableTemp, SeccondaryPassword, LoginHistory, Issues
admin.site.register(InventoryTable)
admin.site.register(PendingRequest)
admin.site.register(ProcessedRequest)
admin.site.register(UserProfile)
admin.site.register(Vendor)
admin.site.register(Temp)
admin.site.register(ItemHistory)
admin.site.register(InventoryTableTemp)
admin.site.register(SeccondaryPassword)
admin.site.register(LoginHistory)
admin.site.register(Issues)