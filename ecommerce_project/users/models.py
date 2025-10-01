from django.db import models

# Create your models here.
import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel, StatusModel


class BaseModel(TimeStampedModel, StatusModel):
    """
    Modèle de base abstrait fournissant :
    - UUID comme clé primaire
    - Champs de traçabilité (timestamps, actif/inactif)
    - Soft delete (is_deleted)
    - Métadonnées JSON
    - Adresse IP
    """
    id = models.UUIDField(
        verbose_name=_("Identifiant unique"),
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    is_deleted = models.BooleanField(
        verbose_name=_("Supprimé"),
        default=False
    )
    metadata = models.JSONField(
        verbose_name=_("Métadonnées"),
        default=dict,
        blank=True,
        null=True
    )
    ip_address = models.GenericIPAddressField(
        verbose_name=_("Adresse IP"),
        blank=True,
        null=True
    )

    class Meta:
        abstract = True


class User(AbstractUser, BaseModel):
    """
    Utilisateur personnalisé pour l’authentification.
    """
    email = models.EmailField(
        verbose_name=_("Email"),
        unique=True
    )
    phone = models.CharField(
        verbose_name=_("Téléphone"),
        max_length=20,
        blank=True,
        null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = _("Utilisateur")
        verbose_name_plural = _("Utilisateurs")

    def __str__(self):
        return self.email
