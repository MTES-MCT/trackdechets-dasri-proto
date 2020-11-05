# Generated by Django 3.1.3 on 2020-11-05 16:59

from django.db import migrations, models
import django.db.models.deletion
import django_fsm
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DasriForm',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('readableId', models.CharField(blank=True, db_index=True, editable=False, max_length=30, unique=True, verbose_name='Identifiant lisible')),
                ('state', django_fsm.FSMField(choices=[('DRAFT', 'Brouillon'), ('CANCELED', 'Annulé'), ('WAITING_FOR_TAKE_OVER', "En attente d'enlèvement"), ('SENT', 'Envoyé'), ('RECEIVED', 'Reçu'), ('ACCEPTED', 'Accepté'), ('REFUSED', 'Refusé'), ('PROCESSED', 'Traité')], default='DRAFT', max_length=50)),
                ('createdAt', models.DateTimeField(auto_now_add=True)),
                ('updatedAt', models.DateTimeField(blank=True)),
                ('isDeleted', models.BooleanField(default=False)),
                ('emitterCompanyName', models.CharField(blank=True, max_length=256, verbose_name='Nom du producteur')),
                ('emitterCompanySiret', models.CharField(blank=True, max_length=8, verbose_name='Siret du producteur')),
                ('emitterCompanyAddress', models.CharField(blank=True, max_length=256, verbose_name='Adresse du producteur')),
                ('emitterCompanyContact', models.CharField(blank=True, max_length=64, verbose_name='Nom de la PRED')),
                ('emitterCompanyPhone', models.CharField(blank=True, max_length=10, verbose_name='Téléphone du producteur')),
                ('emitterCompanyMail', models.EmailField(blank=True, max_length=254, verbose_name='Email du producteur')),
                ('signeByEmitter', models.DateTimeField(blank=True, null=True, verbose_name='Signé par le producteur')),
                ('transporterCompanyName', models.CharField(blank=True, max_length=256, verbose_name='Nom du transporteur')),
                ('transporterCompanySiret', models.CharField(blank=True, max_length=8, verbose_name='Siret du transporteur')),
                ('transporterCompanyAddress', models.CharField(blank=True, max_length=256, verbose_name='Adresse du transporteur')),
                ('transporterCompanyContact', models.CharField(blank=True, max_length=64, verbose_name="Nom de l'exploitant (transporteur)")),
                ('transporterCompanyPhone', models.CharField(blank=True, max_length=10, verbose_name='Téléphone du transporteur')),
                ('transporterCompanyMail', models.EmailField(blank=True, max_length=254, verbose_name='Email du transporteur')),
                ('recipientCompanyName', models.CharField(blank=True, max_length=256, verbose_name='Nom du destinataire')),
                ('recipientCompanySiret', models.CharField(blank=True, max_length=8, verbose_name='Siret du destinataire')),
                ('recipientCompanyAddress', models.CharField(blank=True, max_length=256, verbose_name='Adresse du destinataire')),
                ('recipientCompanyContact', models.CharField(blank=True, max_length=64, verbose_name="Nom de l'exploitant (destinataire)")),
                ('recipientCompanyPhone', models.CharField(blank=True, max_length=10, verbose_name='Téléphone du destinataire')),
                ('recipientCompanyMail', models.EmailField(blank=True, max_length=254, verbose_name='Email du destinataire')),
                ('wasteDetailsCode', models.CharField(blank=True, choices=[('', '--'), ('18 01 03*', "déchets dont la collecte et l'élimination font l'objet de prescriptions particulières vis-à-vis des risques d'infection"), ('18 02 02* ', "déchets dont la collecte et l'élimination font l'objet de prescriptions particulières vis-à-vis des risques d'infection")], default='', max_length=256, verbose_name='Code déchet')),
                ('wasteDetailsOnuCode', models.CharField(blank=True, max_length=9, verbose_name='Code ADR')),
                ('wasteDetailsQuantity', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Quantité de déchets remis (en kg)')),
                ('wasteDetailsQuantityType', models.CharField(blank=True, choices=[('', '--'), ('REAL', 'Réelle'), ('ESTIMATED', 'Estimée')], default='', max_length=9, verbose_name='Réelle ou estimée')),
                ('wasteDetailsVolume', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Quantité de déchets remis (en l)')),
            ],
            options={
                'verbose_name': 'Formulaire dasri',
                'verbose_name_plural': 'Formulaires dasri',
                'ordering': ('-createdAt',),
            },
        ),
        migrations.CreateModel(
            name='WastePackaging',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('packaging_type', models.CharField(blank=True, choices=[('', '--'), ('CARDBOARD_BOX', 'Caisse en carton avec sac en plastique'), ('JERRYCAN', 'Fût ou jerrican à usage unique'), ('SHARP_WASTE_BOX', 'Boîtes et Mini-collecteurs pour déchets perforants'), ('BIG_PACKAGE', 'Grand emballage'), ('BIG_CONTAINER', 'Grand récipient pour vrac')], default='', max_length=20)),
                ('other_packaging_type', models.CharField(blank=True, max_length=128)),
                ('volume', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Capacité')),
                ('quantity', models.PositiveSmallIntegerField(blank=True, null=True, verbose_name='Nombre')),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='packagings', to='dasriforms.dasriform')),
            ],
            options={
                'verbose_name': 'Conditionnement',
                'verbose_name_plural': 'Conditionnements',
                'ordering': ('packaging_type',),
            },
        ),
        migrations.CreateModel(
            name='WasteIdentifier',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('number', models.CharField(blank=True, max_length=128, verbose_name="Numéro d'identification d'un container")),
                ('form', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='identifiers', to='dasriforms.dasriform')),
            ],
            options={
                'verbose_name': 'Identifiant de container',
                'verbose_name_plural': 'Identifiants de container',
            },
        ),
    ]
