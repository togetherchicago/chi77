from jinja2 import Environment, FileSystemLoader, select_autoescape


class Indicator:
    domain = str()
    column = int()


ind = Indicator
ind.domain = 'census_tract'
ind.column = 'pop_100'


env = Environment(
    loader=FileSystemLoader('./'),
    autoescape=select_autoescape(['html', 'xml'])
)

modelTemplate = env.get_template('models.py.jinja2')

print(modelTemplate.render(dataset='Population', indicator=ind))
