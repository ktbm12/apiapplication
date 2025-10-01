from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from ecommerce_project.users.models import BaseModel

User = get_user_model()

class Order(BaseModel):
    """
    Modèle représentant une commande passée par un utilisateur.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="orders",
        verbose_name=_("Utilisateur")
    )
    order_number = models.CharField(
        max_length=100,
        unique=True,
        verbose_name=_("Numéro de commande")
    )
    status = models.CharField(
        max_length=50,
        choices=[
            ("pending", "En attente"),
            ("paid", "Payée"),
            ("shipped", "Expédiée"),
            ("delivered", "Livrée"),
            ("cancelled", "Annulée"),
        ],
        default="pending",
        verbose_name=_("Statut")
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Montant total")
    )
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Créée le"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Mise à jour le"))

    class Meta:
        verbose_name = _("Commande")
        verbose_name_plural = _("Commandes")

    def __str__(self):
        return f"Commande {self.order_number} - {self.user.email}"
