from django.core.management.base import BaseCommand
from chicagomap.models import Tract, Neighborhood, Precinct, Ward, Zip
from chicagomap.models import NeighborhoodToTract, NeighborhoodToZip, NeighborhoodToWard, NeighborhoodToPrecinct
from chicagomap.models import ZipToTract, ZipToWard, ZipToPrecinct
from chicagomap.models import TractToPrecinct
from chicagomap.models import WardToTract
from django.contrib.gis.geos import MultiPolygon, Polygon, GeometryCollection


class Command(BaseCommand):
    help = 'Generates equivalencies between neighborhoods, precincts, wards, zipcodes, and tracts.' \
           ' Note that the ward-precinct equivalency is not generated, as precincts already belong to wards.'

    def add_arguments(self, parser):
        # Named (optional) arguments
        parser.add_argument(
            '-f',
            action='store_true',
            dest='force',
            help='Force equivalency generation even if equivalencies are available.',
        )

    def handle(self, *args, **options):
        if len(TractToPrecinct.objects.all()) > 0:
            if not options['force']:
                print("No equivalency generation necessary.")
                return
        clear()
        # to avoid duplicate equivalencies if we run the command twice.
        for neighborhood in Neighborhood.objects.all():
            zips = Zip.objects.filter(geom__intersects=neighborhood.geom)
            tracts = Tract.objects.filter(geom__intersects=neighborhood.geom)
            precincts = Precinct.objects.filter(geom__intersects=neighborhood.geom)
            wards = Ward.objects.filter(geom__intersects=neighborhood.geom)
            for elt in zips:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                n2z = NeighborhoodToZip(geom=overlap, zip=elt, neighborhood=neighborhood)
                n2z.save()
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                n2t = NeighborhoodToTract(geom=overlap, tract=elt, neighborhood=neighborhood)
                n2t.save()
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                n2p = NeighborhoodToPrecinct(geom=overlap, precinct=elt, neighborhood=neighborhood)
                n2p.save()
            for elt in wards:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                n2w = NeighborhoodToWard(geom=overlap, ward=elt, neighborhood=neighborhood)
                n2w.save()
        for zipcode in Zip.objects.all():
            tracts = Tract.objects.filter(geom__intersects=zipcode.geom)
            precincts = Precinct.objects.filter(geom__intersects=zipcode.geom)
            wards = Ward.objects.filter(geom__intersects=zipcode.geom)
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                z2t = ZipToTract(geom=overlap, tract=elt, zip=zipcode)
                z2t.save()
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                z2p = ZipToPrecinct(geom=overlap, precinct=elt, zip=zipcode)
                z2p.save()
            for elt in wards:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                z2w = ZipToWard(geom=overlap, ward=elt, zip=zipcode)
                z2w.save()
        for ward in Ward.objects.all():
            tracts = Tract.objects.filter(geom__intersects=ward.geom)
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(ward.geom))
                w2t = WardToTract(geom=overlap, tract=elt, ward=ward)
                w2t.save()
        for tract in Tract.objects.all():
            precincts = Precinct.objects.filter(geom__intersects=tract.geom)
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(tract.geom))
                t2p = TractToPrecinct(geom=overlap, precinct=elt, tract=tract)
                t2p.save()


def clear():
    NeighborhoodToTract.objects.all().delete()
    NeighborhoodToZip.objects.all().delete()
    NeighborhoodToWard.objects.all().delete()
    NeighborhoodToPrecinct.objects.all().delete()
    ZipToTract.objects.all().delete()
    ZipToWard.objects.all().delete()
    ZipToPrecinct.objects.all().delete()
    TractToPrecinct.objects.all().delete()
    WardToTract.objects.all().delete()


def filtershapes(overlap) -> MultiPolygon:
    # filters out all shapes that aren't polygons and returns a MultiPolygon object.
    if isinstance(overlap, MultiPolygon):
        return overlap
    elif isinstance(overlap, Polygon):
        return MultiPolygon(overlap)
    elif isinstance(overlap, GeometryCollection):
        # non-base case - we need to filter out non-Polygon shapes
        polys = []
        for elt in overlap:
            if isinstance(elt, Polygon):
                polys.append(elt)
        return MultiPolygon(*polys)
    else:
        return MultiPolygon()
