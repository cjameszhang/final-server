import json
from scrapy import Spider

class ProfessorSpider(Spider):
    name = 'professor_spider'
    start_urls = ['https://ws.engr.illinois.edu/directory/list.asp?unit=1434&cat=15,22,9']
    def parse(self, response):
        names = response.css('a::text').extract()[::2]
        formatted_names = [name.replace('  ', ' ') for name in names]
        with open('professors.json', 'w') as f:
            f.write(json.dumps(formatted_names))
        return []
