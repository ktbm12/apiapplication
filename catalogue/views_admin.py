
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required

@staff_member_required
def admin_dashboard(request):
    return render(request, "catalogue/admin_dashboard.html")

@staff_member_required
def admin_categories(request):
    return render(request, "dashboard/categorie.html")

@staff_member_required
def admin_products(request):
    return render(request, "dashboard/product.html")

@staff_member_required
def admin_images(request):
    return render(request, "dashboard/images.html")
