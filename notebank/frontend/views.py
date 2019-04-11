from django.shortcuts import render


def index(request):
    return render(request, 'frontend/home/index.html')


def create_note(request):
    return render(request, 'frontend/notes/create_note/index.html')
