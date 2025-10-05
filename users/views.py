from django.shortcuts import render
# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import LogoutSerializer
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



def articles(request):

    return render(request, "pages/article.html")


from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    """
    Permet à un utilisateur connecté de se déconnecter (invalidation du token JWT).
    """
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            {"detail": "Déconnexion réussie — le token a été invalidé."},
            status=status.HTTP_205_RESET_CONTENT
        )
