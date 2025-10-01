from django.db import models
from django.contrib.auth import get_user_model
from ecommerce_project.users.models import BaseModel

User = get_user_model()

class ContactMessage(BaseModel):
    """
    Modèle pour stocker les messages de contact envoyés par les utilisateurs.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="contact_messages",
        verbose_name="Utilisateur",
        blank=True,
        null=True
    )
    subject = models.CharField(max_length=255, verbose_name="Sujet")
    message = models.TextField(verbose_name="Message")
    email = models.EmailField(verbose_name="Email de l’expéditeur", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Message de contact"
        verbose_name_plural = "Messages de contact"

    def __str__(self):
        return f"{self.subject} - {self.user if self.user else self.email}"
