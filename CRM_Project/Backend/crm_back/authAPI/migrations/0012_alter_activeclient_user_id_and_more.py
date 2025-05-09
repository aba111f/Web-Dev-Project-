# Generated by Django 5.1.7 on 2025-04-22 13:03

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authAPI', '0011_activeclient_user_id_activeproject_user_id_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='activeclient',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='active_client', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='activeproject',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='active_project', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='totalprofit',
            name='user_id',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='total_profit', to=settings.AUTH_USER_MODEL),
        ),
    ]
