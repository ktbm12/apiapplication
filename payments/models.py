from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.auth import get_user_model
from ecommerce_project.users.models import BaseModel
from ecommerce_project.orders.models import Order

User = get_user_model()


class Payment(BaseModel):
    """
    Modèle représentant un paiement lié à une commande.
    """

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="payments",
        verbose_name=_("Utilisateur")
    )
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="payments",
        verbose_name=_("Commande")
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        verbose_name=_("Montant")
    )
    payment_method = models.CharField(
        max_length=50,
        choices=[
            ("card", "Carte bancaire"),
            ("paypal", "PayPal"),
            ("mobile_money", "Mobile Money"),
            ("bank_transfer", "Virement bancaire"),
        ],
        verbose_name=_("Méthode de paiement")
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ("pending", "En attente"),
            ("completed", "Terminé"),
            ("failed", "Échoué"),
            ("refunded", "Remboursé"),
        ],
        default="pending",
        verbose_name=_("Statut")
    )
    transaction_id = models.CharField(
        max_length=255,
        unique=True,
        verbose_name=_("ID de transaction")
    )
    paid_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name=_("Payé le")
    )

    class Meta:
        verbose_name = _("Paiement")
        verbose_name_plural = _("Paiements")

    def __str__(self):
        return f"Paiement {self.transaction_id} - {self.amount} {self.user.email}"
