from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.decorators import detail_route
from rest_framework.filters import SearchFilter

from .models import Population
from .serializers import PopulationSerializer


class PopulationViewSet(viewsets.ModelViewSet):
    queryset = Population.objects.all()
    serializer_class = PopulationSerializer