import json
from scrapy import Spider, Item, Field
from scrapy.selector import Selector

class MySpider(Spider):
    name = 'myspider'

    #""" add/remove the '#' to toggle the code

    times_crawled = 0
    start_urls = ['https://courses.illinois.edu/schedule/2014/fall/CS/', 'https://courses.illinois.edu/schedule/2015/spring/CS/']
    classes = dict()
    def parse(self, response):
        for sel in response.css('#default-dt tr'):
            class_id = ''.join(sel.xpath('td/text()').extract()).strip()
            class_title = ''.join(sel.xpath('td/a/text()').extract()).strip()
            if class_id and not class_id in self.classes:
                self.classes[class_id] = {'_id': class_id, 'title': class_title}

        self.times_crawled += 1
        if self.times_crawled == len(self.start_urls):
            with open('classes.json', 'w') as f:
                f.write(json.dumps(self.classes.values()))

        return []

    '''"""

    start_urls = ['https://ws.engr.illinois.edu/directory/list.asp?unit=1434&cat=15,22,9']
    def parse(self, response):
        names = response.css('a::text').extract()[::2]
        formatted_names = [name.replace('  ', ' ') for name in names]
        with open('professors.json', 'w') as f:
            f.write(json.dumps(formatted_names))
        return []

    #'''



