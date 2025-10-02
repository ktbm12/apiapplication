from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def home(request):
    """
    Vue minimale pour afficher la page d'accueil.
    """
    return render(request, "home/index.html")
