# Generated by Django 5.1.6 on 2025-04-16 15:08

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('services', '0007_alter_category_created_at_alter_services_created_at'),
    ]

    operations = [
        migrations.RenameField(
            model_name='services',
            old_name='descriception',
            new_name='description',
        ),
        migrations.AddField(
            model_name='services',
            name='price',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=10),
        ),
        migrations.AlterField(
            model_name='category',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime.now, editable=False),
        ),
        migrations.AlterField(
            model_name='services',
            name='created_at',
            field=models.DateTimeField(default=datetime.datetime.now, editable=False),
        ),
    ]
