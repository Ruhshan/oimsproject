# -*- coding: utf-8 -*-
# Generated by Django 1.10.3 on 2016-11-23 15:46
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='CustomInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('table', models.CharField(default='custominfo', max_length=10)),
                ('currency', models.CharField(default='Set Your Currency', max_length=20)),
                ('orgname', models.CharField(default='Set Your Organization Name', max_length=100)),
                ('refresh', models.CharField(default='60', max_length=20)),
                ('timeout', models.CharField(default='300', max_length=20)),
            ],
        ),
    ]