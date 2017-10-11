from django import forms
from server.models import UserSignIn

# Create your forms here.

class UserSignInForm(forms.Form):
    name = forms.CharField(max_length=50)
    password = forms.CharField(widget=forms.PasswordInput)
