import uuid

from django.db import models
from django.utils import timezone
from django_fsm import FSMField


class STATE:
    DRAFT = "DRAFT"
    CANCELED = "CANCELED"
    WAITING_FOR_TAKE_OVER = "WAITING_FOR_TAKE_OVER"
    SENT = "SENT"
    RECEIVED = "RECEIVED"
    ACCEPTED = "ACCEPTED"
    REFUSED = "REFUSED"
    PROCESSED = "PROCESSED"


STATE_CHOICES = (
    (
        STATE.DRAFT,
        "Brouillon",
    ),
    (
        STATE.CANCELED,
        "Annulé",
    ),
    (
        STATE.WAITING_FOR_TAKE_OVER,
        "En attente d'enlèvement",
    ),
    (
        STATE.SENT,
        "Envoyé",
    ),
    (
        STATE.RECEIVED,
        "Reçu",
    ),
    (
        STATE.ACCEPTED,
        "Accepté",
    ),
    (
        STATE.REFUSED,
        "Refusé",
    ),
    (
        STATE.PROCESSED,
        "Traité",
    ),
)


class WasteCodes(models.TextChoices):
    BLANK = ("", "--")
    CODE_18_01_03 = (
        "18 01 03*",
        "déchets dont la collecte et l'élimination font l'objet de prescriptions particulières "
        "vis-à-vis des risques d'infection",
    )
    CODE_18_02_02 = (
        "18 02 02* ",
        "déchets dont la collecte et l'élimination font l'objet de prescriptions particulières "
        "vis-à-vis des risques d'infection",
    )


class QuantityTypes(models.TextChoices):
    BLANK = ("", "--")
    QUANTITY_TYPE_REAL = ("REAL", "Réelle")
    QUANTITY_TYPE_ESTIMATED = ("ESTIMATED", "Estimée")


class DasriForm(models.Model):
    """Main dasri form model. Fields casing according js conventions."""

    id = models.UUIDField(
        unique=True, default=uuid.uuid4, editable=False, primary_key=True
    )
    readableId = models.CharField(
        "Identifiant lisible",
        max_length=30,
        unique=True,
        db_index=True,
        blank=True,
        editable=False,
    )

    state = FSMField(choices=STATE_CHOICES, default=STATE.DRAFT)

    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(blank=True)
    isDeleted = models.BooleanField(default=False)

    # Emitter

    emitterCompanyName = models.CharField(
        "Nom du producteur", max_length=256, blank=True
    )
    emitterCompanySiret = models.CharField(
        "Siret du producteur", max_length=8, blank=True
    )
    emitterCompanyAddress = models.CharField(
        "Adresse du producteur", max_length=256, blank=True
    )
    emitterCompanyContact = models.CharField(
        "Nom de la PRED", max_length=64, blank=True
    )
    emitterCompanyPhone = models.CharField(
        "Téléphone du producteur", max_length=10, blank=True
    )
    emitterCompanyMail = models.EmailField("Email du producteur", blank=True)
    signeByEmitter = models.DateTimeField(
        "Signé par le producteur", blank=True, null=True
    )
    # Transporter

    transporterCompanyName = models.CharField(
        "Nom du transporteur", max_length=256, blank=True
    )
    transporterCompanySiret = models.CharField(
        "Siret du transporteur", max_length=8, blank=True
    )
    transporterCompanyAddress = models.CharField(
        "Adresse du transporteur", max_length=256, blank=True
    )
    transporterCompanyContact = models.CharField(
        "Nom de l'exploitant (transporteur)", max_length=64, blank=True
    )
    transporterCompanyPhone = models.CharField(
        "Téléphone du transporteur", max_length=10, blank=True
    )
    transporterCompanyMail = models.EmailField("Email du transporteur", blank=True)

    # Recipient
    recipientCompanyName = models.CharField(
        "Nom du destinataire", max_length=256, blank=True
    )
    recipientCompanySiret = models.CharField(
        "Siret du destinataire", max_length=8, blank=True
    )
    recipientCompanyAddress = models.CharField(
        "Adresse du destinataire", max_length=256, blank=True
    )
    recipientCompanyContact = models.CharField(
        "Nom de l'exploitant (destinataire)", max_length=64, blank=True
    )
    recipientCompanyPhone = models.CharField(
        "Téléphone du destinataire", max_length=10, blank=True
    )
    recipientCompanyMail = models.EmailField("Email du destinataire", blank=True)

    # Waste details
    wasteDetailsCode = models.CharField(
        "Code déchet",
        max_length=256,
        choices=WasteCodes.choices,
        default=WasteCodes.BLANK,
        blank=True,
    )
    wasteDetailsOnuCode = models.CharField("Code ADR", max_length=9, blank=True)
    wasteDetailsQuantity = models.PositiveSmallIntegerField(
        "Quantité de déchets remis (en kg)", blank=True, null=True
    )
    wasteDetailsQuantityType = models.CharField(
        "Réelle ou estimée",
        max_length=9,
        choices=QuantityTypes.choices,
        default=QuantityTypes.BLANK,
        blank=True,
    )
    wasteDetailsVolume = models.PositiveSmallIntegerField(
        "Quantité de déchets remis (en l)", blank=True, null=True
    )

    class Meta:
        verbose_name = "Formulaire dasri"
        verbose_name_plural = "Formulaires dasri"
        ordering = ("-createdAt",)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        now = timezone.now()
        if not self.readableId:
            year = now.year
            count = DasriForm.objects.filter(createdAt__year=year).count()
            self.readableId = f"TD-{year}-{count}"

        self.updatedAt = timezone.now()
        super().save(force_insert, force_update, using, update_fields)


class WastePackagings(models.TextChoices):
    BLANK = ("", "--")
    CARDBOARD_BOX_TYPE = ("CARDBOARD_BOX", "Caisse en carton avec sac en plastique")
    JERRYCAN_TYPE = ("JERRYCAN", "Fût ou jerrican à usage unique")
    SHARP_WASTE_BOX = (
        "SHARP_WASTE_BOX",
        "Boîtes et Mini-collecteurs pour déchets perforants",
    )
    BIG_PACKAGE = ("BIG_PACKAGE", "Grand emballage")
    BIG_CONTAINER = ("BIG_CONTAINER", "Grand récipient pour vrac")


class WastePackaging(models.Model):
    id = models.UUIDField(
        unique=True, default=uuid.uuid4, editable=False, primary_key=True
    )
    form = models.ForeignKey(
        DasriForm, related_name="packagings", on_delete=models.CASCADE
    )
    packaging_type = models.CharField(
        max_length=20,
        choices=WastePackagings.choices,
        default=WastePackagings.BLANK,
        blank=True,
    )
    other_packaging_type = models.CharField(max_length=128, blank=True)
    volume = models.PositiveSmallIntegerField("Capacité", blank=True, null=True)
    quantity = models.PositiveSmallIntegerField("Nombre", blank=True, null=True)

    class Meta:
        verbose_name = "Conditionnement"
        verbose_name_plural = "Conditionnements"
        ordering = ("packaging_type",)


class WasteIdentifier(models.Model):
    id = models.UUIDField(
        unique=True, default=uuid.uuid4, editable=False, primary_key=True
    )
    form = models.ForeignKey(
        DasriForm, related_name="identifiers", on_delete=models.CASCADE
    )
    number = models.CharField(
        "Numéro d'identification d'un container",
        max_length=128,
        blank=True,
    )

    class Meta:
        verbose_name = "Identifiant de container"
        verbose_name_plural = "Identifiants de container"
