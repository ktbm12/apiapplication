from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import BaseModel, User


class ContactMessage(BaseModel):
    """
    Messages envoyés par les utilisateurs ou visiteurs via le formulaire de contact.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name="contact_messages",
        null=True,
        blank=True,
        verbose_name=_("Utilisateur"),
        help_text=_("Utilisateur connecté (si disponible).")
    )
    name = models.CharField(
        verbose_name=_("Nom"),
        max_length=150,
        help_text=_("Nom de la personne qui envoie le message.")
    )
    email = models.EmailField(
        verbose_name=_("Email"),
        help_text=_("Email de contact.")
    )
    phone = models.CharField(
        verbose_name=_("Téléphone"),
        max_length=20,
        blank=True,
        null=True,
        help_text=_("Numéro de téléphone optionnel.")
    )
    subject = models.CharField(
        verbose_name=_("Sujet"),
        max_length=200
    )
    message = models.TextField(
        verbose_name=_("Message"),
        help_text=_("Contenu du message envoyé.")
    )
    is_processed = models.BooleanField(
        verbose_name=_("Traité"),
        default=False,
        help_text=_("Indique si l’équipe a déjà répondu ou pris en charge ce message.")
    )

    class Meta:
        verbose_name = _("Message de contact")
        verbose_name_plural = _("Messages de contact")
        ordering = ["-created"]

    def __str__(self):
        return f"[{self.subject}] {self.email}"
