# Generated by Django 4.2.17 on 2024-12-22 03:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('freelancer_platform_app', '0002_webthreeuser_facebook_webthreeuser_github_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='job',
            name='status',
            field=models.CharField(choices=[('NEW', 'New'), ('PUSHED', 'Pushed'), ('ACCEPTED', 'Accepted'), ('COMPLETED', 'Completed'), ('DISPUTED', 'Disputed'), ('RESOLVED', 'Resolved')], default='NEW', max_length=20),
        ),
    ]