# Generated by Django 5.1.6 on 2025-03-28 07:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('adoption', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adoption',
            name='pet_vaccinatedstatus',
            field=models.CharField(max_length=100),
        ),
    ]
