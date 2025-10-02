from django.db import models

# Create your models here.
from django.db import models
from django.utils.translation import gettext_lazy as _
from users.models import BaseModel



class Category(BaseModel):
    """
    Catégorie de produits.
    """
    name = models.CharField(_("Nom"), max_length=100, unique=True)
    description = models.TextField(_("Description"), blank=True)

    class Meta:
        verbose_name = _("Catégorie")
        verbose_name_plural = _("Catégories")
        ordering = ["name"]

    def __str__(self):
        return self.name


class Product(BaseModel):
    """
    Produit de la boutique.
    """
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="products",
        verbose_name=_("Catégorie")
    )
    title = models.CharField(_("Titre"), max_length=200)
    description = models.TextField(_("Description"))
    price = models.DecimalField(_("Prix"), max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField(_("Stock"), default=0)

    class Meta:
        verbose_name = _("Produit")
        verbose_name_plural = _("Produits")
        ordering = ["-created"]

    def __str__(self):
        return self.title

    @property
    def in_stock(self):
        return self.stock > 0


class ProductImage(BaseModel):
    """
    Multi-images pour un produit.
    """
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name="images",
        verbose_name=_("Produit")
    )
    image = models.ImageField(_("Image"), upload_to="products/")
    alt_text = models.CharField(_("Texte alternatif"), max_length=150, blank=True)
    is_main = models.BooleanField(_("Image principale"), default=False)

    class Meta:
        verbose_name = _("Image produit")
        verbose_name_plural = _("Images produits")

    def __str__(self):
        return f"{self.product.title} - Image"
