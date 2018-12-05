# Generated by Django 2.0.2 on 2018-12-05 16:01

import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Domain',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('geom', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
                ('domain_name', models.CharField(default='', max_length=64)),
                ('name', models.CharField(max_length=64)),
            ],
        ),
        migrations.CreateModel(
            name='Equivalency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('intersection', django.contrib.gis.db.models.fields.MultiPolygonField(srid=4326)),
                ('pct_a', models.FloatField(null=True)),
                ('pct_b', models.FloatField(null=True)),
                ('geom_a', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='geom_a', to='chicagomap.Domain')),
                ('geom_b', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='geom_b', to='chicagomap.Domain')),
            ],
        ),
    ]
