import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _
from model_utils.models import TimeStampedModel, StatusModel
from model_utils import Choices
from model_utils.fields import StatusField


class BaseModel(TimeStampedModel, StatusModel):
    """
    Modèle de base abstrait pour toutes les entités du projet.
    - UUID comme clé primaire
    - Champs de traçabilité (created, modified via TimeStampedModel)
    - StatusField (actif/inactif/etc.)
    - Soft delete (is_deleted)
    - Métadonnées JSON
    - Adresse IP
    """

    STATUS = Choices("active", "inactive", "archived")

    id = models.UUIDField(
        verbose_name=_("Identifiant unique"),
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        unique=True
    )
    status = StatusField(
        verbose_name=_("Statut"),
        default=STATUS.active
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
        ordering = ["-created"]
        get_latest_by = "created"


class User(AbstractUser, BaseModel):
    """
    Utilisateur personnalisé pour le projet.
    Authentification basée sur l'email.
    """
    USER_STATUS = Choices("active", "inactive", "banned", "pending")

    # Override de StatusField uniquement pour User (plus détaillé)
    status = StatusField(
        choices_name="USER_STATUS",
        default=USER_STATUS.active
    )

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
    avatar = models.ImageField(
        verbose_name=_("Photo de profil"),
        upload_to="users/avatars/",
        blank=True,
        null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    class Meta:
        verbose_name = _("Utilisateur")
        verbose_name_plural = _("Utilisateurs")

    def __str__(self):
        return f"{self.username} ({self.email})"

    @property
    def is_active_user(self):
        """Renvoie True si l’utilisateur est actif et non supprimé."""
        return self.status == self.USER_STATUS.active and not self.is_deleted
