from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import BaseModel
from catalog.models import Product


class Promotion(BaseModel):
    """
    Promotions sur un produit.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="promotions",
        verbose_name=_("Produit")
    )
    discount_percentage = models.PositiveIntegerField(
        _("Pourcentage"),
        default=0,
        help_text=_("Exemple : 20 pour -20%")
    )
    start_date = models.DateTimeField(_("Date de début"))
    end_date = models.DateTimeField(_("Date de fin"))

    class Meta:
        verbose_name = _("Promotion")
        verbose_name_plural = _("Promotions")

    def __str__(self):
        return f"{self.discount_percentage}% - {self.product.title}"

    @property
    def is_active(self):
        from django.utils.timezone import now
        return self.start_date <= now() <= self.end_date
        verbose_name=_("Produit")
