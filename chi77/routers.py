
from rest_framework import routers

from getdata.views import PopulationViewSet


router = routers.DefaultRouter()
router.register('population', PopulationViewSet)
