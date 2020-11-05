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
    (STATE.DRAFT, "Brouillon", "Brouillon"),
    (STATE.CANCELED, "Annulé", "Annulé"),
    (STATE.WAITING_FOR_TAKE_OVER, "En attente d'enlèvement", "En attente d'enlèvement"),
    (STATE.SENT, "Envoyé", "Envoyé"),
    (STATE.RECEIVED, "Reçu", "Reçu"),
    (STATE.ACCEPTED, "Accepté", "Accepté"),
    (STATE.REFUSED, "Refusé", "Refusé"),
    (STATE.PROCESSED, "Traité", "Traité"),
)


class DasriForm(models.Model):
    uuid = models.UUIDField(
        unique=True, default=uuid.uuid4, editable=False, primary_key=True
    )
    readable_id = models.CharField(
        "Identifiant lisible", max_length=30, unique=True, db_index=True, blank=True
    )
    state = FSMField(state_choices=STATE_CHOICES, default=STATE.DRAFT)

    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Formulaire dasri"
        verbose_name_plural = "Formulaires dasri"
        ordering = ("-created",)

    def save(
        self, force_insert=False, force_update=False, using=None, update_fields=None
    ):
        if not self.uuid:
            year = timezone.now().year
            count = DasriForm.objects.filter(created__year=year).count()
            self.readable_id = f"TD-{year}-{count}"
        super().save(force_insert, force_update, using, update_fields)
