# Generated by Django 5.1.6 on 2025-04-30 06:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cart', '0002_remove_cart_product_id_cart_is_active_cart_product_and_more'),
        ('event', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='cart',
            name='event',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='cart_items', to='event.event'),
        ),
    ]
