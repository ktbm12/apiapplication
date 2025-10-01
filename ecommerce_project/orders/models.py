from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import BaseModel, User
from catalog.models import Product


class Order(BaseModel):
    """
    Commande client.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", verbose_name=_("Utilisateur"))
    status = models.CharField(
        _("Statut"),
        max_length=20,
        choices=[
            ("pending", "En attente"),
            ("paid", "Payée"),
            ("shipped", "Expédiée"),
            ("delivered", "Livrée"),
            ("cancelled", "Annulée"),
        ],
        default="pending"
    )
    total_price = models.DecimalField(_("Prix total"), max_digits=12, decimal_places=2, default=0)

    class Meta:
        verbose_name = _("Commande")
        verbose_name_plural = _("Commandes")

    def __str__(self):
        return f"Commande {self.id} - {self.user.email}"


class OrderItem(BaseModel):
    """
    Ligne de commande (produit + quantité).
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items", verbose_name=_("Commande"))
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="order_items", verbose_name=_("Produit"))
    quantity = models.PositiveIntegerField(_("Quantité"), default=1)
    price = models.DecimalField(_("Prix unitaire"), max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = _("Article de commande")
        verbose_name_plural = _("Articles de commande")

    def __str__(self):
        return f"{self.quantity}x {self.product.title}"
