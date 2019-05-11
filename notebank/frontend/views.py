from django.shortcuts import render


def index(request):
    return render(request, 'frontend/home/index.html')


def create_note(request):
    return render(request, 'frontend/notes/create_note/index.html')


def login(request):
    return render(request, 'frontend/login/index.html')


def create_account(request):
    return render(request, 'frontend/create_account/index.html')


def browse_notes(request):
    return render(request, 'frontend/notes/browse/index.html')


def account(request):
    return render(request, 'frontend/account/index.html')
