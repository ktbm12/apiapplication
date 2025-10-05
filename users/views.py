from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def home(request):
    """
    Vue minimale pour afficher la page d'accueil.
    """
    return render(request, "pages/index.html")


def comptes(request):

    return render(request, "home/comptes/comptes.html")



def contact(request):

    return render(request, "pages/contact.html")


def promotions(request):

    return render(request, "pages/promotions.html")



def about(request):

    return render(request, "pages/about..html")


def payments(request):

    return render(request, "pages/payments.html")




def login(request):

    return render(request, "pages/login.html")



def login(request):

    return render(request, "pages/login.html")

