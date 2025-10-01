from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import BaseModel, User
from orders.models import Order


class Payment(BaseModel):
    """
    Paiement d’une commande.
    """
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment", verbose_name=_("Commande"))
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments", verbose_name=_("Utilisateur"))
    amount = models.DecimalField(_("Montant"), max_digits=12, decimal_places=2)
    method = models.CharField(
        _("Méthode"),
        max_length=20,
        choices=[
            ("credit_card", "Carte bancaire"),
            ("paypal", "PayPal"),
            ("mobile_money", "Mobile Money"),
        ]
    )
    status = models.CharField(
        _("Statut"),
        max_length=20,
        choices=[
            ("pending", "En attente"),
            ("completed", "Terminé"),
            ("failed", "Échoué"),
        ],
        default="pending"
    )

    class Meta:
        verbose_name = _("Paiement")
        verbose_name_plural = _("Paiements")

    def __str__(self):
        return f"Paiement {self.id} - {self.amount} CFA"
