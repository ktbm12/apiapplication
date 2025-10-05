from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Interface d'administration personnalisée pour le modèle User.
    """

    # 🧱 Colonnes affichées dans la liste
    list_display = (
        "id",
        "username",
        "email",
        "phone",
        "status",
        "is_staff",
        "is_superuser",
        "is_deleted",
        "created",
    )

    # 🔍 Filtres latéraux
    list_filter = (
        "status",
        "is_staff",
        "is_superuser",
        "is_deleted",
        "date_joined",
    )

    # 🕵️ Recherche rapide
    search_fields = ("username", "email", "phone")

    # ⏳ Tri par défaut
    ordering = ("-created",)

    # 🧰 Champs en lecture seule
    readonly_fields = ("created", "modified", "last_login")

    # 🧩 Organisation des champs (formulaire de modification)
    fieldsets = (
        (_("Identifiants"), {"fields": ("username", "email", "password")}),
        (_("Informations personnelles"), {"fields": ("first_name", "last_name", "phone", "avatar")}),
        (_("Statut et sécurité"), {"fields": ("status", "is_active", "is_staff", "is_superuser", "is_deleted")}),
        (_("Dates et suivi"), {"fields": ("last_login", "created", "modified")}),
        (_("Groupes et permissions"), {"fields": ("groups", "user_permissions")}),
    )

    # 🆕 Organisation du formulaire de création
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "email", "password1", "password2"),
            },
        ),
    )


    # 🎨 Personnalisation visuelle
    def get_queryset(self, request):
        """Inclut les soft-deleted users pour la gestion."""
        qs = super().get_queryset(request)
        return qs.filter(is_deleted=False)  # 👈 affiche uniquement les utilisateurs non supprimés


    def delete_model(self, request, obj):
        """Soft delete au lieu de suppression réelle."""
        obj.is_deleted = True
        obj.save()


    def has_delete_permission(self, request, obj=None):
        """Désactive la suppression directe."""
        return True  # autorise, mais via soft delete

