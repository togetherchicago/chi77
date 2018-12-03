from django.core.management.base import BaseCommand
from chicagomap.models import Domain, Equivalency
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
        if len(Equivalency.objects.all()) > 0:
            if not options['force']:
                print("No equivalency generation necessary.")
                return
        clear()
        all_neighborhoods = Domain.objects.filter(domain_name="Neighborhood")
        all_zips = Domain.objects.filter(domain_name="ZIP Code")
        all_tracts = Domain.objects.filter(domain_name="Census Tract")
        all_precincts = Domain.objects.filter(domain_name="Precinct")
        all_wards = Domain.objects.filter(domain_name="Ward")
        # to avoid duplicate equivalencies if we run the command twice.
        for neighborhood in all_neighborhoods:
            zips = all_zips.filter(geom__intersects=neighborhood.geom)
            tracts = all_tracts.filter(geom__intersects=neighborhood.geom)
            precincts = all_precincts.filter(geom__intersects=neighborhood.geom)
            wards = all_wards.filter(geom__intersects=neighborhood.geom)
            for elt in zips:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    n2z = Equivalency(intersection=overlap, geom_a=neighborhood, geom_b=elt, pct=ratio)
                    n2z.save()
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    n2t = Equivalency(intersection=overlap, geom_a=neighborhood, geom_b=elt, pct=ratio)
                    n2t.save()
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    n2p = Equivalency(intersection=overlap, geom_a=neighborhood, geom_b=elt, pct=ratio)
                    n2p.save()
            for elt in wards:
                overlap = filtershapes(elt.geom.intersection(neighborhood.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    n2w = Equivalency(intersection=overlap, geom_a=neighborhood, geom_b=elt, pct=ratio)
                    n2w.save()
        for zipcode in all_zips:
            tracts = all_tracts.filter(geom__intersects=zipcode.geom)
            precincts = all_precincts.filter(geom__intersects=zipcode.geom)
            wards = all_wards.filter(geom__intersects=zipcode.geom)
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    z2t = Equivalency(intersection=overlap, geom_a=zipcode, geom_b=elt, pct=ratio)
                    z2t.save()
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    z2p = Equivalency(intersection=overlap, geom_a=zipcode, geom_b=elt, pct=ratio)
                    z2p.save()
            for elt in wards:
                overlap = filtershapes(elt.geom.intersection(zipcode.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    z2w = Equivalency(intersection=overlap, geom_a=zipcode, geom_b=elt, pct=ratio)
                    z2w.save()
        for ward in all_wards:
            tracts = all_tracts.filter(geom__intersects=ward.geom)
            for elt in tracts:
                overlap = filtershapes(elt.geom.intersection(ward.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    w2t = Equivalency(intersection=overlap, geom_a=ward, geom_b=elt, pct=ratio)
                    w2t.save()
        for tract in all_tracts:
            precincts = all_precincts.filter(geom__intersects=tract.geom)
            for elt in precincts:
                overlap = filtershapes(elt.geom.intersection(tract.geom))
                ratio = overlap.area / elt.geom.area
                if ratio > 0.000001:
                    t2p = Equivalency(intersection=overlap, geom_a=tract, geom_b=elt, pct=ratio)
                    t2p.save()


def clear():
    Equivalency.objects.all().delete()


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
