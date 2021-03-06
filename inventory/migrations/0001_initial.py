# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-24 08:57
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='InventoryTable',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=100)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('quantity_inside', models.IntegerField()),
                ('quantity_outside', models.IntegerField()),
                ('minimum_quantity', models.IntegerField()),
                ('unit_price', models.DecimalField(decimal_places=5, max_digits=10)),
                ('description', models.TextField()),
                ('vendor', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='InventoryTableTemp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('item_name', models.CharField(max_length=100)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('quantity_inside', models.IntegerField(blank=True, null=True)),
                ('quantity_outside', models.IntegerField(blank=True, null=True)),
                ('minimum_quantity', models.IntegerField(blank=True, null=True)),
                ('unit_price', models.DecimalField(blank=True, decimal_places=5, max_digits=10, null=True)),
                ('description', models.TextField(blank=True)),
                ('creator', models.CharField(blank=True, max_length=100)),
                ('action', models.CharField(blank=True, max_length=100)),
                ('vendor', models.CharField(blank=True, max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Issues',
            fields=[
                ('id_no', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('item', models.CharField(max_length=50)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('person', models.CharField(max_length=50)),
                ('place', models.CharField(max_length=50)),
                ('desc', models.TextField()),
                ('amnt', models.IntegerField()),
                ('occurance_date', models.DateField()),
                ('date_created', models.DateField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ItemHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('action', models.CharField(max_length=100)),
                ('quantity', models.IntegerField()),
                ('date_added', models.DateField(auto_now_add=True)),
                ('added_by', models.CharField(max_length=50)),
                ('modified_name', models.CharField(blank=True, max_length=50, null=True)),
                ('approved_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='LoginHistory',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True, null=True)),
                ('action', models.CharField(max_length=10)),
                ('user_name', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PendingRequest',
            fields=[
                ('id_no', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('item_name', models.CharField(max_length=100)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('requested_quantity', models.IntegerField()),
                ('requestee', models.CharField(max_length=100)),
                ('location', models.CharField(default='Non Specified', max_length=100)),
                ('store_manager', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('date_of_request', models.DateField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProcessedRequest',
            fields=[
                ('id_no', models.UUIDField(default=0, editable=False, primary_key=True, serialize=False)),
                ('item_name', models.CharField(max_length=100)),
                ('category', models.CharField(default='Old', max_length=100)),
                ('requested_quantity', models.IntegerField()),
                ('location', models.CharField(default='Non Specified', max_length=100)),
                ('approved_quantity', models.IntegerField()),
                ('requestee', models.CharField(max_length=100)),
                ('store_manager', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('date_of_request', models.DateField(blank=True, null=True)),
                ('date_of_process', models.DateField(auto_now=True)),
                ('action', models.CharField(max_length=10)),
                ('acknowledgement', models.IntegerField(default=0)),
                ('delivered_price', models.DecimalField(decimal_places=5, max_digits=10)),
                ('processed_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SeccondaryPassword',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('user_name', models.CharField(max_length=100)),
                ('value', models.CharField(max_length=16)),
            ],
        ),
        migrations.CreateModel(
            name='Temp',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('tp', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('alternate_email', models.CharField(max_length=50, null=True)),
                ('mypost', models.CharField(max_length=100, null=True)),
                ('phone_number', models.CharField(max_length=20, null=True)),
                ('created_by', models.CharField(max_length=30, null=True)),
                ('is_deleted', models.IntegerField(default=0)),
                ('nick_name', models.CharField(default='Nick not set', max_length=50)),
                ('uname', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Vendor',
            fields=[
                ('name', models.CharField(max_length=100)),
                ('contact_person', models.CharField(max_length=100)),
                ('address', models.CharField(max_length=200)),
                ('contact', models.CharField(max_length=50)),
                ('email', models.CharField(max_length=100)),
                ('description', models.TextField()),
                ('date_added', models.DateField(auto_now_add=True)),
                ('date_modified', models.DateField(auto_now=True)),
                ('added_by', models.CharField(max_length=50)),
                ('modified_by', models.CharField(max_length=50)),
                ('is_active', models.IntegerField(default=1)),
                ('vendor_id', models.AutoField(primary_key=True, serialize=False)),
            ],
        ),
    ]
