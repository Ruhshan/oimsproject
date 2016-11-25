from django.conf.urls import url
from django.contrib import admin
from . import views
urlpatterns = [
    url(r'^superadminpanel/$', views.superadmin_home, name='superadmin_home'),
    url(r'^superadminlogin/$', views.superadmin_login, name='superadmin_login'),
    url(r'^superadminexport/$', views.superadmin_export, name='superadmin_export'),
    url(r'^superadminflush/$',views.superadmin_flush, name="superadmin_flush"),
    url(r'^superadminimport/$',views.superadmin_import, name="superadmin_import"),
    ]
