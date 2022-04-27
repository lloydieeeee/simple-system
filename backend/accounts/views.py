from django.utils import timezone
from datetime import datetime

from django.http import Http404
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect

from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.clickjacking import xframe_options_deny
from django.views.decorators.cache import never_cache


from accounts.models import UserAccount
from accounts.serializers import UserAccountSerializer

# Create your views here.
class GetCSRFToken(APIView):
    @method_decorator(xframe_options_deny)
    @method_decorator(never_cache)
    def get(self, request, format=None):
        try:
            csrf_cookie = request.META["CSRF_COOKIE"]
        except KeyError:
            response = Response({"x-csrftoken": get_token(request)})
        else:
            response = Response({"x-csrftoken": csrf_cookie})

        return response


class ObtainTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["name"] = user.first_name
        return token


class ObtainToken(TokenObtainPairView):
    serializer_class = ObtainTokenSerializer

    @method_decorator(csrf_protect)
    @method_decorator(xframe_options_deny)
    @method_decorator(never_cache)
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )

        serializer.is_valid()

        # user = UserAccount.objects.get(email=request.data["email"])
        # user.last_login = datetime.datetime.now()

        # user_serializer = UserSerializer(user)

        data = serializer.validated_data

        # user.save()

        cookie_max_age = 3600 * 24 * 14

        response = Response(data, status=status.HTTP_200_OK)

        # response = Response({
        #     'status': 'OK',
        #     'token': data,
        #     'user': user_serializer.data
        # }, status=status.HTTP_200_OK)

        current_time = timezone.now()
        expiration = timezone.timedelta(minutes=15)

        response.set_cookie(
            "access",
            data["access"],
            expires=current_time + expiration,
            secure=True,
            # secure=True if DEVELOPMENT == False else False,
            httponly=True,
            samesite="Lax"
            # samesite='None' if DEVELOPMENT == False else 'Lax'
        )

        response.set_cookie(
            "refresh",
            data["refresh"],
            expires=current_time + expiration,
            secure=True,
            # secure=True if DEVELOPMENT == False else False,
            httponly=True,
            samesite="None",
            # samesite='None' if DEVELOPMENT == False else 'Lax'
            max_age=cookie_max_age,
        )

        return response


class ClearToken(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    @method_decorator(csrf_protect)
    @method_decorator(xframe_options_deny)
    @method_decorator(never_cache)
    def post(self, request, format=None):
        try:
            refresh_token = request.data["refresh_token"]
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserList(APIView):
    @method_decorator(csrf_protect)
    @method_decorator(xframe_options_deny)
    @method_decorator(never_cache)
    def post(self, request, format=None):
        serializer = UserAccountSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_protect, name="dispatch")
@method_decorator(xframe_options_deny, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class UserDetail(APIView):
    def get_object(self, pk):
        try:
            return UserAccount.objects.get(pk=pk)
        except UserAccount.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        user = self.get_object(pk)
        serializer = UserAccountSerializer(user)
        return Response(serializer.data)

    permission_classes = [permissions.IsAdminUser]

    def put(self, request, pk, format=None):
        user = self.get_object(pk)

        serializer = UserAccountSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        user = self.get_object(pk)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# @method_decorator(csrf_protect, name="dispatch")
@method_decorator(xframe_options_deny, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class RegisteredUser(APIView):
    def get(self, request, format=None):
        users = UserAccount.objects.get(email=request.user)
        serializer = UserAccountSerializer(users)
        return Response(serializer.data)


# @method_decorator(csrf_protect, name="dispatch")
@method_decorator(xframe_options_deny, name="dispatch")
@method_decorator(never_cache, name="dispatch")
class AllUser(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request, format=None):
        users = UserAccount.objects.exclude(email=request.user)
        serializer = UserAccountSerializer(users, many=True)
        return Response(serializer.data)
