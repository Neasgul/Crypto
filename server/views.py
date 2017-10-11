from django.shortcuts import render
from django.views.generic import TemplateView

# Create your views here.

class HomeView(TemplateView):
    template_name = "templates/html/home.html"
    
    def post(self, request, **kwargs):
        print("Action lors d'un post")
        return render(request, self.template_name)