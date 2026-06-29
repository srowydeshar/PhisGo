import json

from django.contrib.auth.models import User
from django.contrib.auth import (
    authenticate,
    login,
    logout
)

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt


def index(request):

    return render(
        request,
        "index.html"
    )


@csrf_exempt
def api_signup(request):

    if request.method == "POST":

        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if User.objects.filter(
            username=email
        ).exists():

            return JsonResponse(
                {
                    "error":
                    "User already exists"
                },
                status=400
            )

        user = User.objects.create_user(
            username=email,
            password=password,
            first_name=name
        )

        login(
            request,
            user
        )

        return JsonResponse(
            {
                "redirect":
                "/dash/user_view/"
            }
        )


@csrf_exempt
def api_login(request):

    if request.method == "POST":

        data = json.loads(
            request.body
        )

        email = data.get(
            "email"
        )

        password = data.get(
            "password"
        )

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user:

            login(
                request,
                user
            )

            return JsonResponse(
                {
                    "redirect":
                    "/dash/user_view/"
                }
            )

        return JsonResponse(
            {
                "error":
                "Invalid credentials"
            },
            status=401
        )


def check_login(request):

    return JsonResponse(
        {
            "logged_in":
            request.user.is_authenticated
        }
    )


def api_logout(request):

    logout(
        request
    )

    return JsonResponse(
        {
            "redirect":
            "/"
        }
    )


@login_required(
    login_url="/"
)
def user_view(request):

    return render(
        request,
        "dash/user_view.html",
        {
            "player":
            request.user
        }
    )