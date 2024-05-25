from django.shortcuts import render, HttpResponse

# Create your views here.

def home(request):
    return HttpResponse("sDrive żyje!")