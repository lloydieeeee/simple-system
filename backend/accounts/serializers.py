from rest_framework import serializers
from accounts.models import UserAccount
from django.contrib.auth.hashers import make_password


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = "__all__"
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super(UserAccountSerializer, self).create(validated_data)
