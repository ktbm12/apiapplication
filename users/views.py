from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def home(request):
    """
    Vue minimale pour afficher la page d'accueil.
    """
    return render(request, "pages/article.html")


def login(request):

    return render(request, "home/comptes/comptes.html")



def contact(request):

    return render(request, "contact/contact.html")