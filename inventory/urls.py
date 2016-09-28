from django.conf.urls import url
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^login/$', views.user_login, name='login'),
    url(r'^home/$',views.view_home,name='home_view'),
    url(r'^home/item/(?P<name>[-\w]+)/$',views.item_details,name='item_details'),
    url(r'^logout/$',views.user_logout,name='logout'),
    url(r'^home/itemqty/$',views.itemqty,name='itemqty'),
    url(r'^home/availableqty/$',views.availqty,name='availqty'),
    url(r'^home/placerequest/$',views.place_request,name='placerequest'),
    url(r'^home/processrequest/$',views.process_request,name='processrequest'),
    url(r'^home/generateoptions/$',views.generateoptions,name='generateoptions'),
    url(r'^home/acknowledge/$',views.acknowledge,name='acknowledge'),
    url(r'^login/isadmin/$',views.isadmin,name='isadmin'),
    url(r'^myaccount/$',views.myaccount,name='myaccount'),
    url(r'^myaccount/updatepersonalinfo/$',views.updatepersonalinfo,name='updatepersonalinfo'),
    url(r'^myaccount/login/$',views.user_login,name='user_login'),
    

]
