from django.shortcuts import render
from django.views.generic import TemplateView
from server import forms

# Create your views here.

class HomeView(TemplateView):
    template_name = "templates/html/home.html"
    
    def post(self, request, **kwargs):
        print("Action lors d'un post")
        return render(request, self.template_name)

class InscriptionView(TemplateView):
    template_name = "templates/html/inscription.html"
    # form = forms.UserSignInForm

    def post(self, request, **kwargs):
        print("Action lors d'un post")
        return render(request, self.template_name)
