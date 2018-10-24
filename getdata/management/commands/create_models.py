import jinja2
from django.core.management.base import BaseCommand


class Dataset:
    name = str()
    domain = str()
    indicators = []

    def __init__(self, name, domain, indicators):
        self.name = name
        self.domain = domain
        self.indicators = indicators


class Command(BaseCommand):
    @staticmethod
    def run():
        loop = 1
        datasets = []

        while loop > 0:
            print("Creating dataset model. Provide name for dataset:")
            dsname = input(">")
            print("Provide native domain for dataset:")
            dsdomain = input(">")
            print("Provide number of indicators in this dataset:")
            numindicators = int(input(">"))
            ds = Dataset(dsname, dsdomain, [])
            for i in range(1, numindicators):
                print("Provide indicator ", i, " name:")
                ds.indicators.append(input(">"))
            datasets.append(ds)
            print("Add more datasets? Enter 1 for yes, 0 for no.")
            loop = input(">")

        env = jinja2.Environment(
            loader=jinja2.FileSystemLoader('../../')
        )

        template = env.get_template('models.py.jinja2')
        outfile = open('models.py', 'w')
        outfile.write(template.render(datasets=datasets))
        outfile.close()
        print("Inspect the new models.py in the getdata/management/commands folder before replacing the old models.py.")
        print("Make sure to make and run migrations after replacing the old getdata/models.py.")

    def handle(self, *args, **options):
        self.run()
